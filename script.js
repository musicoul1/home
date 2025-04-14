document.addEventListener('DOMContentLoaded', function() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('nav');
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

    // Firebase Configuration (Replace with your actual config)
    const firebaseConfig = {
        apiKey: "AIzaSyBaDBLoe2Wi2WgmJfPRXoEP-ZSgkVhMxVI",
        authDomain: "musicoul-15025.firebaseapp.com",
        projectId: "musicoul-15025",
        storageBucket: "musicoul-15025.firebasestorage.app",
        messagingSenderId: "863099041367",
        appId: "1:863099041367:web:c3d61399489a219611d512",
        measurementId: "G-WBPE697N9Q"
    };

    let auth;

    // Initialize Firebase
    try {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();

        // Listen for authentication state changes
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("User is signed in:", user);
                // Update UI for logged-in user (e.g., hide login button, show profile link)
                updateLoggedInUI(user);
            } else {
                console.log("User is signed out");
                // Update UI for logged-out user (e.g., show login button)
                updateLoggedOutUI();
            }
        });
    } catch (error) {
        console.error("Firebase initialization error:", error);
        // Handle initialization error (e.g., display a message to the user)
        alert("Failed to initialize Firebase. Please check your configuration.");
    }

    function showNotification(message) {
        const notificationDiv = document.createElement('div');
        notificationDiv.classList.add('notification');
        notificationDiv.textContent = message;
        document.body.appendChild(notificationDiv);
        setTimeout(() => {
            notificationDiv.remove();
        }, 3000); // Remove after 3 seconds
    }

    function updateLoggedInUI(user) {
        // Example: Hide login buttons, show logout button
        if (loginBtn) loginBtn.style.display = 'none';
        if (sideNavLoginBtn) sideNavLoginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (sideNavLogoutBtn) sideNavLogoutBtn.style.display = 'inline-block';
        // You might want to show a user profile link or display user info here
        console.log("Logged in as:", user.displayName || user.email);
        showNotification(`Logged in as ${user.displayName || user.email}`);
    }

    function updateLoggedOutUI() {
        // Example: Show login buttons, hide logout button
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (sideNavLoginBtn) sideNavLoginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (sideNavLogoutBtn) sideNavLogoutBtn.style.display = 'none';
        // You might want to hide user-specific elements here
    }

    function showNotification(message) {
        const notificationDiv = document.createElement('div');
        notificationDiv.classList.add('notification');
        notificationDiv.textContent = message;
        document.body.appendChild(notificationDiv);
        setTimeout(() => {
            notificationDiv.remove();
        }, 3000); // Remove after 3 seconds
    }

    function updateLoggedInUI(user) {
        // Example: Hide login buttons, show logout button
        if (loginBtn) loginBtn.style.display = 'none';
        if (sideNavLoginBtn) sideNavLoginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (sideNavLogoutBtn) sideNavLogoutBtn.style.display = 'inline-block';
        // You might want to show a user profile link or display user info here
        console.log("Logged in as:", user.displayName || user.email);
        showNotification(`Logged in as ${user.displayName || user.email}`); // ADD THIS LINE
    }

    // Event listener for Login form submission
    if (loginForm && auth) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#login-email').value;
            const password = loginForm.querySelector('#login-password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in successfully
                    const user = userCredential.user;
                    console.log("Login successful:", user);
                    closeAuthPopup(); // Close the pop-up
                    showNotification(`Logged in as ${user.displayName || user.email}`); // ADD THIS LINE
                    // The auth.onAuthStateChanged listener will handle UI updates
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Login failed:", errorCode, errorMessage);
                    alert(`Login Failed: ${errorMessage}`); // Replace with better UI feedback
                });
        });
    }

    // Event listener for Sign Up form submission
    if (signupForm && auth) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = signupForm.querySelector('#signup-name').value;
            const email = signupForm.querySelector('#signup-email').value;
            const password = signupForm.querySelector('#signup-password').value;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed up successfully
                    const user = userCredential.user;
                    console.log("Signup successful:", user);
                    // Update user's display name
                    return user.updateProfile({
                        displayName: name
                    });
                })
                .then(() => {
                    closeAuthPopup(); // Close the pop-up after updating profile
                    showNotification(`Signed up as ${name}`); // ADD THIS LINE
                    // The auth.onAuthStateChanged listener will handle UI updates
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Signup failed:", errorCode, errorMessage);
                    alert(`Signup Failed: ${errorMessage}`); // Replace with better UI feedback
                });
        });
    }

    if (googleLoginBtn && auth) {
        googleLoginBtn.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then((result) => {
                    // User signed in with Google.
                    const user = result.user;
                    console.log("Logged in with Google:", user);
                    closeAuthPopup();
                    showNotification(`Logged in with Google as ${user.displayName || user.email}`); // ADD THIS LINE
                    // The auth.onAuthStateChanged listener will handle UI updates
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Google Sign-in failed:", errorCode, errorMessage);
                    alert(`Google Sign-in Failed: ${errorMessage}`);
                });
        });
    }

    if (googleSignupBtn && auth) {
        googleSignupBtn.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then((result) => {
                    // User signed up with Google.
                    const user = result.user;
                    console.log("Signed up with Google:", user);
                    closeAuthPopup();
                    showNotification(`Signed up with Google as ${user.displayName || user.email}`); // ADD THIS LINE
                    // The auth.onAuthStateChanged listener will handle UI updates
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Google Sign-up failed:", errorCode, errorMessage);
                    alert(`Google Sign-up Failed: ${errorMessage}`);
                });
        });
    }

    // Logout Functionality
    if (logoutBtn && auth) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut()
                .then(() => {
                    console.log("User signed out successfully.");
                    showNotification("Logged out successfully."); // ADD THIS LINE
                    // The auth.onAuthStateChanged listener will handle UI updates
                }).catch((error) => {
                    console.error("Sign out error:", error);
                    alert(`Sign out failed: ${error.message}`);
                });
        });
    }

    if (sideNavLogoutBtn && auth) {
        sideNavLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut()
                .then(() => {
                    console.log("User signed out from side nav successfully.");
                    showNotification("Logged out successfully."); // ADD THIS LINE
                    // The auth.onAuthStateChanged listener will handle UI updates
                }).catch((error) => {
                    console.error("Side nav sign out error:", error);
                    alert(`Sign out failed from side nav: ${error.message}`);
                });
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
        const rect = exploreCourses.getBoundingClientRect();

        if (rect.top <= window.innerHeight / 2) {
            body.style.backgroundImage = "url('Resources/Homepage/music-background1.jpg')";
        } else {
            body.style.backgroundImage = "url('Resources/Homepage/music-background.jpg')";
        }
    });

    hamburger.addEventListener('click', () => {
        sideNav.style.right = '0px';
    });

    closeBtn.addEventListener('click', () => {
        sideNav.style.right = '-250px';
    });

    // Open Auth Pop-up
    function openAuthPopup() {
        authPopup.style.display = 'flex';
        body.classList.add('popup-open'); // Optional: Add class to body to prevent scrolling
    }

    // Close Auth Pop-up
    function closeAuthPopup() {
        authPopup.style.display = 'none';
        body.classList.remove('popup-open'); // Optional: Remove class from body
    }

    // Event listeners to open the pop-up
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            openAuthPopup();
        });
    }

    if (sideNavLoginBtn) {
        sideNavLoginBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            openAuthPopup();
        });
    }

    // Event listener to close the pop-up using the close button
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', closeAuthPopup);
    }

    // Event listener to close the pop-up by clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === authPopup) {
            closeAuthPopup();
        }
    });

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

    // Event listener for Login form submission
    if (loginForm && auth) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#login-email').value;
            const password = loginForm.querySelector('#login-password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in successfully
                    const user = userCredential.user;
                    console.log("Login successful:", user);
                    closeAuthPopup(); // Close the pop-up
                    showNotification(`Logged in as ${user.displayName || user.email}`);
                    // The auth.onAuthStateChanged listener will handle UI updates
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Login failed:", errorCode, errorMessage);
                    alert(`Login Failed: ${errorMessage}`); // Replace with better UI feedback
                });
        });
    }

    // Event listener for Sign Up form submission
    if (signupForm && auth) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = signupForm.querySelector('#signup-name').value;
            const email = signupForm.querySelector('#signup-email').value;
            const password = signupForm.querySelector('#signup-password').value;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed up successfully
                    const user = userCredential.user;
                    console.log("Signup successful:", user);
                    // Update user's display name
                    return user.updateProfile({
                        displayName: name
                    });
                })
                .then(() => {
                    closeAuthPopup(); // Close the pop-up after updating profile
                    showNotification(`Signed up as ${name}`);
                    // The auth.onAuthStateChanged listener will handle UI updates
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Signup failed:", errorCode, errorMessage);
                    alert(`Signup Failed: ${errorMessage}`); // Replace with better UI feedback
                });
        });
    }

    // Google Sign-in Logic
    if (googleLoginBtn && auth) {
        googleLoginBtn.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then((result) => {
                    // User signed in with Google.
                    const user = result.user;
                    console.log("Logged in with Google:", user);
                    closeAuthPopup();
                    showNotification(`Logged in with Google as ${user.displayName || user.email}`);
                    // The auth.onAuthStateChanged listener will handle UI updates
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Google Sign-in failed:", errorCode, errorMessage);
                    alert(`Google Sign-in Failed: ${errorMessage}`);
                });
        });
    }

    if (googleSignupBtn && auth) {
        googleSignupBtn.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then((result) => {
                    // User signed up with Google.
                    const user = result.user;
                    console.log("Signed up with Google:", user);
                    closeAuthPopup();
                    showNotification(`Signed up with Google as ${user.displayName || user.email}`);
                    // The auth.onAuthStateChanged listener will handle UI updates
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Google Sign-up failed:", errorCode, errorMessage);
                    alert(`Google Sign-up Failed: ${errorMessage}`);
                });
        });
    }

    // Logout Functionality
    if (logoutBtn && auth) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut()
                .then(() => {
                    console.log("User signed out successfully.");
                    showNotification("Logged out successfully.");
                    // The auth.onAuthStateChanged listener will handle UI updates
                }).catch((error) => {
                    console.error("Sign out error:", error);
                    alert(`Sign out failed: ${error.message}`);
                });
        });
    }

    if (sideNavLogoutBtn && auth) {
        sideNavLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut()
                .then(() => {
                    console.log("User signed out from side nav successfully.");
                    showNotification("Logged out successfully.");
                    // The auth.onAuthStateChanged listener will handle UI updates
                }).catch((error) => {
                    console.error("Side nav sign out error:", error);
                    alert(`Sign out failed from side nav: ${error.message}`);
                });
        });
    }

    // FAQ Accordion Functionality (remains the same)
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

    // Interactive Resource Folders (remains the same)
    const interactiveFolders = document.querySelectorAll('.resource-folder.interactive');
    interactiveFolders.forEach(folder => {
        folder.addEventListener('click', () => {
            console.log('Interactive folder clicked:', folder.querySelector('h3').textContent);
        });
    });

    const multimediaFolders = document.querySelectorAll('.resource-folder.multimedia');
    multimediaFolders.forEach(folder => {
        folder.addEventListener('click', () => {
            console.log('Multimedia folder clicked:', folder.querySelector('h3').textContent);
        });
    });

    const theoryFolders = document.querySelectorAll('.resource-folder.theory');
    theoryFolders.forEach(folder => {
        folder.addEventListener('click', () => {
            console.log('Theory folder clicked:', folder.querySelector('h3').textContent);
        });
    });

    const driveLinkFolders = document.querySelectorAll('.resource-folder.drive-link');
    driveLinkFolders.forEach(folder => {
        folder.addEventListener('click', () => {
            console.log('Drive Link folder clicked');
        });
    });
});