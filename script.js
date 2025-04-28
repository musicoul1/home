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
    const bottomNavMyClass = document.querySelector('.bottom-nav a:nth-child(2)'); // Selects the "My Class" link in bottom nav
    const overlay = document.querySelector('.overlay'); // Keep this if you added it

    // Define a mapping of subject and exam number to course page URLs
    const courseMap = {
        'Singing-1': 'prarambhik.html',
        'Piano-1': 'piano-prarambhik.html', // Example: Adjust as needed
        'Tabla-1': 'tabla-prarambhik.html', // Example: Adjust as needed
        'Singing-2': 'singing-level-2.html', // Example: Adjust as needed
        'Piano-2': 'piano-level-2.html',   // Example: Adjust as needed
        'Tabla-2': 'tabla-level-2.html',   // Example: Adjust as needed
        // Add more mappings for other subjects and exam numbers as needed
    };

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
        console.log("Logged in as:", user ? (user.displayName || user.email) : 'User Data Unavailable');
        showNotification(`Logged in as ${user ? (user.displayName || user.email) : 'User'}`);
    }

    function updateLoggedOutUI() {
        // Example: Show login buttons, hide logout button
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (sideNavLoginBtn) sideNavLoginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (sideNavLogoutBtn) sideNavLogoutBtn.style.display = 'none';
        // You might want to hide user-specific elements here
    }

    // Event listener for Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#login-email').value;
            const password = loginForm.querySelector('#login-password').value;

            // Replace with your actual login logic
            console.log("Login attempted with:", email, password);
            // Simulate successful login for UI update (replace with actual auth)
            const fakeUser = { email: email };
            updateLoggedInUI(fakeUser);
            closeAuthPopup();
            showNotification(`Logged in as ${fakeUser.email}`);
            // If login fails, show an error message
            // alert("Login Failed: Incorrect credentials.");
        });
    }

    // Event listener for Sign Up form submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = signupForm.querySelector('#signup-name').value;
            const email = signupForm.querySelector('#signup-email').value;
            const password = signupForm.querySelector('#signup-password').value;

            // Replace with your actual signup logic
            console.log("Signup attempted with:", name, email, password);
            // Simulate successful signup for UI update (replace with actual auth)
            const fakeUser = { displayName: name, email: email };
            updateLoggedInUI(fakeUser);
            closeAuthPopup();
            showNotification(`Signed up as ${name}`);
            // If signup fails, show an error message
            // alert("Signup Failed: Email already in use.");
        });
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            // Replace with your actual Google login logic
            console.log("Google login attempted.");
            // Simulate Google login success
            const fakeUser = { displayName: "Google User", email: "google@example.com" };
            updateLoggedInUI(fakeUser);
            closeAuthPopup();
            showNotification(`Logged in with Google as ${fakeUser.displayName}`);
            // If Google login fails, show an error message
            // alert("Google Sign-in Failed.");
        });
    }

    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', () => {
            // Replace with your actual Google signup logic
            console.log("Google signup attempted.");
            // Simulate Google signup success
            const fakeUser = { displayName: "New Google User", email: "newgoogle@example.com" };
            updateLoggedInUI(fakeUser);
            closeAuthPopup();
            showNotification(`Signed up with Google as ${fakeUser.displayName}`);
            // If Google signup fails, show an error message
            // alert("Google Sign-up Failed.");
        });
    }

    // Logout Functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Replace with your actual logout logic
            console.log("User logged out.");
            updateLoggedOutUI();
            showNotification("Logged out successfully.");
        });
    }

    if (sideNavLogoutBtn) {
        sideNavLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Replace with your actual logout logic
            console.log("User logged out from side nav.");
            updateLoggedOutUI();
            showNotification("Logged out successfully.");
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
        body.classList.add('popup-open'); // Optional: Add class to body to prevent scrolling
        if (overlay) overlay.style.display = 'block'; // Show overlay if it exists
    }

    // Close Auth Pop-up
    function closeAuthPopup() {
        authPopup.style.display = 'none';
        body.classList.remove('popup-open'); // Optional: Remove class from body
        if (overlay) overlay.style.display = 'none'; // Hide overlay if it exists
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

    // "My Class" Bottom Navigation Logic (Direct Redirection)
    //if (bottomNavMyClass) {
      //  bottomNavMyClass.addEventListener('click', (e) => {
        //    e.preventDefault();
          //  const subject = prompt("Enter your subject (e.g., Singing, Piano, Tabla):");
            //if (subject) {
              //  const examNo = prompt("Enter your Exam No. (e.g., 1, 2, 3):");
                //if (examNo) {
                  //  const key = `${subject.trim()}-${examNo.trim()}`;
                    //const courseUrl = courseMap[key];

                    //if (courseUrl) {
                      //  window.location.href = courseUrl;
                    //} else {
                      //  showNotification("No specific course found for your selection. Redirecting to courses page.");
                        //setTimeout(() => {
                          //  window.location.href = 'courses.html';
                       // }, 2000);
                   // }
               // } else {
                  //  showNotification("Exam No. cannot be empty.");
                //}
            //} else {
              //  showNotification("Subject cannot be empty.");
            //}
        //});
    //}

    // FAQ Accordion Functionality (remains the same - assuming this section exists elsewhere)
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

    // Interactive Resource Folders (remains the same - assuming this section exists elsewhere)
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
