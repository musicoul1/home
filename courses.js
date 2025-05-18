// --- Firebase and Razorpay Integration ---
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app'; // Import initializeApp

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBaDBLoe2Wi2WgmJfPRXoEP-ZSgkVhMxVI",
    authDomain: "musicoul-15025.firebaseapp.com",
    databaseURL: "https://musicoul-15025-default-rtdb.firebaseio.com",
    projectId: "musicoul-15025",
    storageBucket: "musicoul-15025.firebasestorage.app",
    messagingSenderId: "863099041367",
    appId: "1:863099041367:web:c3d61399489a219611d512",
    measurementId: "G-WBPE697N9Q"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

async function initiateSubscription(courseId) {
    if (!auth.currentUser) {
        alert('Please sign in to subscribe.');
        return;
    }
    try {
        const createSubscription = httpsCallable(functions, 'createSubscription');
        const result = await createSubscription({ courseId: courseId });
        const paymentData = result.data;
        console.log('Cloud Function Result:', paymentData);

        if (paymentData?.subscriptionId) {
            console.log('Razorpay Subscription ID:', paymentData.subscriptionId);
            openRazorpayPayment(paymentData.subscriptionId, paymentData.razorpayOrderId, courseId);
        } else if (paymentData?.freeEnrollment) {
            alert('You are now enrolled in this free course.');
            // TODO: Update UI for free enrollment
            const status = await getSubscriptionStatusForCourse(courseId);
            console.log('Subscription Status:', status);
            // Example UI update:
            // const buyButton = document.querySelector(`.course-card[data-course-id="${courseId}"] .view-button`);
            // if (buyButton) {
            //     buyButton.textContent = 'Enrolled';
            //     buyButton.disabled = true;
            // }
        } else {
            console.log('No subscription needed or an issue occurred.');
            alert('Enrollment processed.');
            // Handle other scenarios if needed
        }
    } catch (error) {
        console.error('Error initiating subscription:', error);
        alert('Failed to initiate subscription.');
    }
}

function openRazorpayPayment(subscriptionId, razorpayOrderId, courseId) {
    const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Placeholder - Ideally fetched server-side
        subscription_id: subscriptionId,
        order_id: razorpayOrderId, // Include the order ID
        name: 'Musicoul Course Subscription',
        description: 'Monthly access to the course',
        theme: {
            color: '#3399cc'
        },
        handler: async function (response) {
            console.log('Payment successful:', response);
            alert('Subscription successful!');
            const status = await getSubscriptionStatusForCourse(courseId);
            console.log('Subscription Status:', status);
            // TODO: Update UI to reflect successful subscription
            // Example: Change button to "Enrolled" or redirect
        },
        prefill: {
            name: auth.currentUser?.displayName || '',
            email: auth.currentUser?.email || '',
        },
        modal: {
            ondismiss: function () {
                console.log('Payment modal dismissed');
                alert('Payment was cancelled or failed.');
            }
        }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
}

async function getSubscriptionStatusForCourse(courseId) {
    const getStatus = httpsCallable(functions, 'getSubscriptionStatus');
    try {
        const result = await getStatus({ courseId: courseId });
        return result.data?.status || 'inactive';
    } catch (error) {
        console.error('Error getting subscription status:', error);
        return 'error'; // Indicate an error occurred
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is loaded.'); // Added for debugging

    let lastScrollTop = 0;
    const navbar = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    const sideNav = document.querySelector('.side-nav');
    const closeBtn = document.querySelector('.close-btn');
    const body = document.body;
    const loginBtn = document.querySelector('.nav-links a[data-page="login"]');
    const logoutBtn = document.getElementById('logout-btn');
    const sideNavLoginBtn = document.querySelector('.side-nav a[data-page="login"]');
    const sideNavLogoutBtn = document.getElementById('side-nav-logout-btn');
    const authPopup = document.querySelector('.auth-popup');
    const closePopupBtn = document.querySelector('.close-popup');
    const authTabs = document.querySelectorAll('.auth-tabs button');
    const authForms = document.querySelectorAll('.auth-forms form');
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    const googleLoginBtn = document.querySelector('.login-form .google-auth-button');
    const googleSignupBtn = document.querySelector('.signup-form .google-auth-button');
    const readMoreButtons = document.querySelectorAll('.read-more');

    const courseGrid = document.querySelector('.course-grid');
    const courseSearchInput = document.getElementById('courseSearch');
    const subjectFilter = document.getElementById('subjectFilter');
    const pricingFilter = document.getElementById('pricingFilter');
    const typeFilter = document.getElementById('typeFilter');
    const examFilter = document.getElementById('examFilter');
    const filterButton = document.getElementById('filterButton');

    function showNotification(message) {
        const notificationDiv = document.createElement('div');
        notificationDiv.classList.add('notification');
        notificationDiv.textContent = message;
        document.body.appendChild(notificationDiv);
        setTimeout(() => {
            notificationDiv.remove();
        }, 3000);
    }

    function updateLoggedInUI(user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (sideNavLoginBtn) sideNavLoginBtn.style.display = 'none';
        if (logoutBtn) { if (logoutBtn.style) logoutBtn.style.display = 'inline-block'; }
        if (sideNavLogoutBtn) { if (sideNavLogoutBtn.style) sideNavLogoutBtn.style.display = 'inline-block'; }
        console.log("Logged in as:", user ? (user.displayName || user.email) : 'User Data Unavailable');
        showNotification(`Logged in as ${user ? (user.displayName || user.email) : 'User'}`);
        if (authPopup) authPopup.style.display = 'none'; // Close popup after login
    }

    function updateLoggedOutUI() {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (sideNavLoginBtn) sideNavLoginBtn.style.display = 'inline-block';
        if (logoutBtn) { if (logoutBtn.style) logoutBtn.style.display = 'none'; }
        if (sideNavLogoutBtn) { if (sideNavLogoutBtn.style) sideNavLogoutBtn.style.display = 'none'; }
        showNotification("Logged out.");
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#loginEmail').value;
            const password = loginForm.querySelector('#loginPassword').value;
            console.log("Login attempted with:", email, password);
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                updateLoggedInUI(user);
                showNotification(`Logged in as ${user.email}`);
            } catch (error) {
                console.error("Login failed:", error.message);
                showNotification(`Login failed: ${error.message}`);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = signupForm.querySelector('#signupName').value;
            const email = signupForm.querySelector('#signupEmail').value;
            const password = signupForm.querySelector('#signupPassword').value;
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await user.updateProfile({ displayName: name });
                updateLoggedInUI(user);
                showNotification(`Signed up as ${name}`);
            } catch (error) {
                console.error("Signup failed:", error.message);
                showNotification(`Signup failed: ${error.message}`);
            }
        });
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            console.log("Google login attempted.");
            try {
                const result = await signInWithPopup(auth, googleAuthProvider);
                const user = result.user;
                updateLoggedInUI(user);
                showNotification(`Logged in with Google as ${user.displayName || user.email}`);
            } catch (error) {
                console.error("Google login failed:", error.message);
                showNotification(`Google login failed: ${error.message}`);
            }
        });
    }

    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', async () => {
            console.log("Google signup attempted.");
            try {
                const result = await signInWithPopup(auth, googleAuthProvider);
                const user = result.user;
                await user.updateProfile({ displayName: user.email.split('@')[0] }); // Default display name
                updateLoggedInUI(user);
                showNotification(`Signed up with Google as ${user.displayName || user.email}`);
            } catch (error) {
                console.error("Google signup failed:", error.message);
                showNotification(`Google signup failed: ${error.message}`);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                console.log("User logged out.");
                updateLoggedOutUI();
                showNotification("Logged out successfully.");
            } catch (error) {
                console.error("Logout error:", error.message);
                showNotification(`Logout failed: ${error.message}`);
            }
        });
    }

    if (sideNavLogoutBtn) {
        sideNavLogoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                console.log("User logged out from side nav.");
                updateLoggedOutUI();
                showNotification("Logged out successfully.");
            } catch (error) {
                console.error("Logout error from side nav:", error.message);
                showNotification(`Logout failed: ${error.message}`);
            }
        });
    }

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    window.addEventListener('scroll', function() {
        const exploreCourses = document.querySelector('.explore-courses');
        if (exploreCourses) {
            const rect = exploreCourses.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2) {
                body.style.backgroundImage = "url('Resources/Homepage/music-background1.jpg')";
            } else {
                body.style.backgroundImage = "url('Resources/Homepage/music-background.jpg')";
            }
        }
    });

    hamburger.addEventListener('click', () => {
        sideNav.style.right = '0px';
    });

    closeBtn.addEventListener('click', () => {
        sideNav.style.right = '-250px';
    });

    if (authPopup) {
        authPopup.style.display = 'none';
    }

    if (closePopupBtn && authPopup) {
        closePopupBtn.addEventListener('click', () => {
            authPopup.style.display = 'none';
        });
    }

    if (authTabs) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(form => form.classList.remove('active'));
                tab.classList.add('active');
                const targetForm = document.querySelector(`.${tab.textContent.toLowerCase()}-form`);
                if (targetForm) {
                    targetForm.classList.add('active');
                }
            });
        });
    }

    readMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const courseCard = this.closest('.course-card');
            const courseDetails = courseCard.querySelector('.course-details');

            readMoreButtons.forEach(otherButton => {
                if (otherButton !== this) {
                    const otherCard = otherButton.closest('.course-card');
                    const otherDetails = otherCard.querySelector('.course-details');
                    if (otherDetails && otherDetails.style.display === 'block') {
                        otherDetails.style.display = 'none';
                        otherButton.textContent = 'All Features';
                    }
                }
            });

            courseDetails.style.display = courseDetails.style.display === 'block' ? 'none' : 'block';
            this.textContent = this.textContent === 'All Features' ? 'Close Features' : 'All Features';
        });
    });

    // --- Filtering Logic ---
    const courseCardsForFiltering = document.querySelectorAll('.course-card');
    function filterCourses() {
        const selectedSubject = subjectFilter.value.toLowerCase();
        const selectedPricing = pricingFilter.value.toLowerCase();
        const selectedType = typeFilter.value.toLowerCase();
        const selectedExam = examFilter.value.toLowerCase();
        const searchTerm = courseSearchInput.value.toLowerCase();

        courseCardsForFiltering.forEach(card => {
            const cardSubject = card.dataset.subject.toLowerCase();
            const cardPricing = card.dataset.pricing.toLowerCase();
            const cardType = card.dataset.type.toLowerCase();
            const cardExam = card.dataset.exam.toLowerCase();
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardDescription = card.querySelector('p').textContent.toLowerCase();

            const subjectMatch = !selectedSubject || cardSubject.includes(selectedSubject);
            const pricingMatch = !selectedPricing || cardPricing === selectedPricing;
            const typeMatch = !selectedType || cardType === selectedType;
            const examMatch = !selectedExam || cardExam === selectedExam;
            const searchMatch = !searchTerm || cardTitle.includes(searchTerm) || cardDescription.includes(searchTerm);

            if (subjectMatch && pricingMatch && typeMatch && examMatch && searchMatch) {
                card.style.display = 'grid';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (filterButton) {
        filterButton.addEventListener('click', filterCourses);
    }
    if (subjectFilter) {
        subjectFilter.addEventListener('change', filterCourses);
    }
    if (pricingFilter) {
        pricingFilter.addEventListener('change', filterCourses);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', filterCourses);
    }
    if (examFilter) {
        examFilter.addEventListener('change', filterCourses);
    }
    if (courseSearchInput) {
        courseSearchInput.addEventListener('input', filterCourses);
    }

    // --- Event listeners for "Buy Now" buttons ---
    const buyNowButtons = document.querySelectorAll('.course-card .view-button');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Buy Now button clicked.'); // Debugging log
            const courseCard = this.closest('.course-card');
            const courseId = courseCard?.dataset?.courseId;
            console.log('Course ID:', courseId); // Debugging log
            if (courseId) {
                initiateSubscription(courseId);
            } else {
                console.error('Course ID not found for this course.');
                alert('Could not initiate subscription. Course ID missing.');
            }
        });
    });

    // --- Auth Popup Logic
    const authTriggers = document.querySelectorAll('.auth-trigger');
    if (authTriggers && authPopup) {
        authTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                authPopup.style.display = 'flex';
                // Optionally, determine if it's a login or signup trigger
                // and switch the active tab accordingly if needed.
                const page = trigger.dataset.page;
                if (page === 'login') {
                    const loginTab = document.querySelector('.auth-tabs .login-tab');
                    if (loginTab) loginTab.click();
                }
            });
        });
    }

    // Initialize the UI based on the current authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            updateLoggedInUI(user);
            // Optionally, check subscription status on load
            document.querySelectorAll('.course-card').forEach(async card => {
                const courseId = card.dataset.courseId;
                if (courseId) {
                    const status = await getSubscriptionStatusForCourse(courseId);
                    console.log(`Subscription status for ${courseId}:`, status);
                    // TODO: Update UI based on subscription status (e.g., change "Buy Now" to "View Course")
                }
            });
        } else {
            updateLoggedOutUI();
        }
    });
});