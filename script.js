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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const sideNav = document.querySelector('.side-nav');
    const closeBtn = document.querySelector('.close-btn');
    const body = document.body;
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const sideNavLoginBtn = document.getElementById('side-nav-login-btn');
    const sideNavLogoutBtn = document.getElementById('side-nav-logout-btn');
    const authPopup = document.getElementById('auth-popup');
    const closePopupBtn = document.querySelector('.close-popup');
    const authTabs = document.querySelectorAll('.auth-tabs .tab');
    const authForms = document.querySelectorAll('.auth-forms form');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const googleLoginBtn = document.querySelector('#login-form .google-auth-button');
    const googleSignupBtn = document.querySelector('#signup-form .google-auth-button');
    const bottomNavLoginBtn = document.getElementById('bottom-nav-login-btn');

    // Function to show notification
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
        console.log("Logged in as:", user ? (user.displayName || user.email) : null);
        if (loginBtn) loginBtn.style.display = 'none';
        if (sideNavLoginBtn) sideNavLoginBtn.style.display = 'none';
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
        } else {
            // If logout button doesn't exist in main nav, ensure side nav is updated
            const tempLogoutBtn = document.getElementById('logout-btn');
            if (tempLogoutBtn) tempLogoutBtn.style.display = 'inline-block';
        }
        if (sideNavLogoutBtn) sideNavLogoutBtn.style.display = 'inline-block';

        if (user) {
            showNotification(`Logged in as ${user.email}`);
            // You might want to redirect to a user dashboard here eventually
        }
    }

    function updateLoggedOutUI() {
        console.log("Logged out");
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (sideNavLoginBtn) sideNavLoginBtn.style.display = 'inline-block';
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        } else {
            const tempLogoutBtn = document.getElementById('logout-btn');
            if (tempLogoutBtn) tempLogoutBtn.style.display = 'none';
        }
        if (sideNavLogoutBtn) sideNavLogoutBtn.style.display = 'none';
        showNotification("Logged out successfully.");
    }

    auth.onAuthStateChanged((user) => {
        if (user) {
            updateLoggedInUI(user);
            // Optionally, fetch user-specific data here
        } else {
            updateLoggedOutUI();
        }
    });

    // Event listener for Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#login-email').value;
            const password = loginForm.querySelector('#login-password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    closeAuthPopup();
                    showNotification(`Successfully logged in as ${user.email}`);
                    // Redirect or update UI
                })
                .catch((error) => {
                    let errorMessage = 'Login failed.';
                    if (error.code === 'auth/user-not-found') {
                        errorMessage = 'User not found.';
                    } else if (error.code === 'auth/wrong-password') {
                        errorMessage = 'Incorrect password.';
                    }
                    showNotification(errorMessage);
                    console.error("Login Error:", error);
                });
        });
    }

    // Event listener for Sign Up form submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = signupForm.querySelector('#signup-name').value;
            const email = signupForm.querySelector('#signup-email').value;
            const password = signupForm.querySelector('#signup-password').value;
            const subject = signupForm.querySelector('#signup-subject').value;
            const examNo = signupForm.querySelector('#signup-exam-no').value;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    return user.updateProfile({
                        displayName: name
                    });
                })
                .then(() => {
                    closeAuthPopup();
                    showNotification(`Successfully signed up as ${name}`);
                    // You might want to store additional user info (subject, exam no) in Firestore
                    // For now, just a notification.
                    console.log("User signed up with subject:", subject, "and exam no:", examNo);
                })
                .catch((error) => {
                    let errorMessage = 'Signup failed.';
                    if (error.code === 'auth/email-already-in-use') {
                        errorMessage = 'Email address is already in use.';
                    } else if (error.code === 'auth/invalid-email') {
                        errorMessage = 'Invalid email address.';
                    } else if (error.code === 'auth/weak-password') {
                        errorMessage = 'Password should be at least 6 characters.';
                    }
                    showNotification(errorMessage);
                    console.error("Signup Error:", error);
                });
        });
    }

    // Google Sign-in
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then((result) => {
                    const user = result.user;
                    closeAuthPopup();
                    showNotification(`Logged in with Google as ${user.displayName || user.email}`);
                    // Redirect or update UI
                }).catch((error) => {
                    showNotification("Google sign-in failed.");
                    console.error("Google Sign-in Error:", error);
                });
        });
    }

    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then((result) => {
                    const user = result.user;
                    closeAuthPopup();
                    showNotification(`Signed up with Google as ${user.displayName || user.email}`);
                    // Redirect or update UI
                }).catch((error) => {
                    showNotification("Google sign-up failed.");
                    console.error("Google Sign-up Error:", error);
                });
        });
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                showNotification("Logged out successfully.");
                // Update UI
            }).catch((error) => {
                showNotification("Error logging out.");
                console.error("Logout Error:", error);
            });
        });
    }

    if (sideNavLogoutBtn) {
        sideNavLogoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                showNotification("Logged out successfully.");
                // Update UI
            }).catch((error) => {
                showNotification("Error logging out.");
                console.error("Logout Error:", error);
            });
        });
    }

    hamburger.addEventListener('click', () => {
        sideNav.style.right = '0px';
    });

    closeBtn.addEventListener('click', () => {
        sideNav.style.right = '-250px';
    });

    // Open Auth Pop-up
    function openAuthPopup() {
        authPopup.style.display = 'flex';
        body.classList.add('popup-open');
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        body.appendChild(overlay);
        overlay.addEventListener('click', closeAuthPopup);
    }

    // Close Auth Pop-up
    function closeAuthPopup() {
        authPopup.style.display = 'none';
        body.classList.remove('popup-open');
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Event listeners to open the pop-up
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthPopup();
        });
    }

    if (bottomNavLoginBtn) {
        bottomNavLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthPopup();
        });
    }

    if (sideNavLoginBtn) {
        sideNavLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthPopup();
        });
    }

    // Event listener to close the pop-up using the close button
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', closeAuthPopup);
    }

    // Switch between Login and Sign Up forms
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));

            tab.classList.add('active');
            const targetFormId = tab.getAttribute('data-tab') + '-form';
            const targetForm = document.getElementById(targetFormId);
            if (targetForm) {
                targetForm.classList.add('active');
            }
        });
    });

    // --- Existing "My Class" Pop-up Functionality ---
    const myClassButtonMainNav = document.querySelector('nav .nav-links a[href="myclass.html"]');

    const courseMap = {
        'Singing-1': 'prarambhik.html',
        'Singing-4': 'madhyama-pratham.html',
        'Singing-6': 'visharad-pratham.html',
        'Piano-1': 'piano-prarambhik.html',
        // Add more mappings as needed
    };

    // Function to open the "My Class" pop-up
    function openMyClassPopup() {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        const myClassPopup = document.createElement('div');
        myClassPopup.classList.add('my-class-popup');

        const popupContent = `
            <div class="my-class-container">
                <span class="close-my-class-popup">&times;</span>
                <h2>Enter Your Class Details</h2>
                <form id="my-class-form">
                    <div class="input-group">
                        <label for="myClassSubject">Subject:</label>
                        <input type="text" id="myClassSubject" placeholder="e.g., Singing, Piano">
                    </div>
                    <div class="input-group" id="input-group-2">
                        <label for="myClassExamNo">Exam No.:</label>
                        <input type="number" id="myClassExamNo" placeholder="e.g., 1, 4, 6">
                    </div>
                    <button type="submit" class="action-button">Go to Class</button>
                </form>
            </div>
        `;
        myClassPopup.innerHTML = popupContent;

        const closeButton = myClassPopup.querySelector('.close-my-class-popup');
        const myClassFormElement = myClassPopup.querySelector('#my-class-form');

        closeButton.addEventListener('click', closeMyClassPopup);
        myClassFormElement.addEventListener('submit', handleMyClassSubmit);

        body.appendChild(overlay);
        body.appendChild(myClassPopup);
        setTimeout(() => {
            myClassPopup.classList.add('active');
            overlay.classList.add('active');
        }, 10); // slight delay for transition
    }

    // Function to close the "My Class" pop-up
    function closeMyClassPopup() {
        const activePopup = document.querySelector('.my-class-popup.active');
        const activeOverlay = document.querySelector('.overlay.active');

        if (activePopup) {
            activePopup.classList.remove('active');
        }
        if (activeOverlay) {
            activeOverlay.classList.remove('active');
        }

        setTimeout(() => {
            if (activePopup && activePopup.parentNode) {
                body.removeChild(activePopup);
            }
            if (activeOverlay && activeOverlay.parentNode) {
                body.removeChild(activeOverlay);
            }
        }, 300); // duration of the fade-out
    }

    // Function to handle the "My Class" form submission
    function handleMyClassSubmit(event) {
        event.preventDefault();
        const subjectInput = document.getElementById('myClassSubject');
        const examNoInput = document.getElementById('myClassExamNo');
        const subject = subjectInput.value.trim();
        const examNo = examNoInput.value.trim();
        const key = `<span class="math-inline">\{subject\}\-</span>{examNo}`;
        const courseUrl = courseMap[key];

        if (courseUrl) {
            window.location.href = courseUrl;
        } else {
            showNotification("No specific course found for your selection.");
        }
        closeMyClassPopup();
    }

    // Event listener for the "My Class" button click in main nav
    if (myClassButtonMainNav) {
        myClassButtonMainNav.addEventListener('click', (e) => {
            e.preventDefault();
            openMyClassPopup();
        });
    }

    // --- Scroll-based navbar hide/show ---
    let lastScrollTop = 0;
    const navbar = document.querySelector('nav');
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // --- Add musical notes to the background (Fewer notes, smoother, random, varied size, glow) ---
    const numberOfNotes = 15; // Slightly increased number of notes
    const musicalSymbols = ['♫', '♪', '♩', '♬', '♭', '♯'];

    for (let i = 0; i < numberOfNotes; i++) {
        const note = document.createElement('div');
        note.classList.add('musical-note');
        note.textContent = musicalSymbols[Math.floor(Math.random() * musicalSymbols.length)];
        note.style.left = `${Math.random() * 100}vw`;
        note.style.top = `${Math.random() * 100}vh`;
        // More varied font sizes, ensuring smaller ones are still decent
        const size = Math.random() * 20 + 14; // Size between 14px and 34px
        note.style.fontSize = `${size}px`;
        note.style.animationDelay = `${Math.random() * 12}s`; // More varied and longer delay
        note.style.animationDuration = `${Math.random() * 12 + 18}s`; // Longer, smoother duration
        note.style.opacity = `${Math.random() * 0.5 + 0.5}`; // Varied opacity

        const animationName = Math.random() > 0.5 ? 'floatNoteSmoothRandom1' : 'floatNoteSmoothRandom2';
        note.style.animationName = animationName;
        note.style.animationIterationCount = 'infinite';
        note.style.animationTimingFunction = 'ease-in-out'; // Smoother timing

        body.appendChild(note);
    }

    // ---// Existing FAQ and Resource Folder interactivity ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        const icon = question.querySelector('i');

        if (question && answer && icon) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                    $(answer).velocity("slideDown", { duration: 300, queue: false });
                } else {
                    $(answer).velocity("slideUp", { duration: 200, queue: false, complete: function(){
                        answer.style.display = 'none';
                    } });
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            });
        }
    });

    const interactiveFolders = document.querySelectorAll('.resource-folder.interactive');
    interactiveFolders.forEach(folder => {
        folder.addEventListener('click', () => {
            console.log('Interactive folder clicked:', folder.dataset.path);
            // Here you would typically implement the action of opening the folder
            showNotification(`Opened folder: ${folder.dataset.path}`);
        });
    });
});