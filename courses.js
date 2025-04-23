document.addEventListener('DOMContentLoaded', function() {
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
    const authTabs = document.querySelectorAll('.auth-tabs .tab');
    const authForms = document.querySelectorAll('.auth-forms form');
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    const googleLoginBtn = document.querySelector('#login-form .google-auth-button');
    const googleSignupBtn = document.querySelector('#signup-form .google-auth-button');
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
    }

    function updateLoggedOutUI() {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (sideNavLoginBtn) sideNavLoginBtn.style.display = 'inline-block';
        if (logoutBtn) { if (logoutBtn.style) logoutBtn.style.display = 'none'; }
        if (sideNavLogoutBtn) { if (sideNavLogoutBtn.style) sideNavLogoutBtn.style.display = 'none'; }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#loginEmail').value;
            const password = loginForm.querySelector('#loginPassword').value;
            console.log("Login attempted with:", email, password);
            const fakeUser = { email: email };
            updateLoggedInUI(fakeUser);
            showNotification(`Logged in as ${fakeUser.email}`);
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = signupForm.querySelector('#signupName').value;
            const email = signupForm.querySelector('#signupEmail').value;
            const password = signupForm.querySelector('#signupPassword').value;
            console.log("Signup attempted with:", name, email, password);
            const fakeUser = { displayName: name, email: email };
            updateLoggedInUI(fakeUser);
            showNotification(`Signed up as ${name}`);
        });
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            console.log("Google login attempted.");
            const fakeUser = { displayName: "Google User", email: "google@example.com" };
            updateLoggedInUI(fakeUser);
            showNotification(`Logged in with Google as ${fakeUser.displayName}`);
        });
    }

    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', () => {
            console.log("Google signup attempted.");
            const fakeUser = { displayName: "New Google User", email: "newgoogle@example.com" };
            updateLoggedInUI(fakeUser);
            showNotification(`Signed up with Google as ${fakeUser.displayName}`);
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("User logged out.");
            updateLoggedOutUI();
            showNotification("Logged out successfully.");
        });
    }

    if (sideNavLogoutBtn) {
        sideNavLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("User logged out from side nav.");
            updateLoggedOutUI();
            showNotification("Logged out successfully.");
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

    // --- Filtering Logic Based on Tags ---
    function filterCoursesByTags() {
        const searchTerm = courseSearchInput.value.toLowerCase();
        const selectedSubject = subjectFilter.value.toLowerCase();
        const selectedPricing = pricingFilter.value.toLowerCase();
        const selectedType = typeFilter.value.toLowerCase();
        const selectedExam = examFilter.value.toLowerCase();

        const courseCards = document.querySelectorAll('.course-card');

        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = card.querySelectorAll('.course-tags span');
            let subjectMatch = selectedSubject === '';
            let pricingMatch = selectedPricing === '';
            let typeMatch = selectedType === '';
            let examMatch = selectedExam === '';

            tags.forEach(tag => {
                const tagClass = tag.classList[1] ? tag.classList[1].toLowerCase() : ''; // Get the second class

                if (selectedSubject !== '') {
                    if (selectedSubject === 'piano/harmonium' && tagClass === 'piano-harmonium') {
                        subjectMatch = true;
                    } else if (selectedSubject !== 'piano/harmonium' && tagClass === selectedSubject) {
                        subjectMatch = true;
                    }
                } else {
                    subjectMatch = true; // If 'All' is selected
                }

                if (selectedPricing !== '' && tagClass === selectedPricing) {
                    pricingMatch = true;
                } else if (selectedPricing === '') {
                    pricingMatch = true; // If 'All' is selected
                }

                if (selectedType !== '' && tagClass === selectedType) {
                    typeMatch = true;
                } else if (selectedType === '') {
                    typeMatch = true; // If 'All' is selected
                }

                if (selectedExam !== '') {
                    if (tagClass.includes(selectedExam.replace('exam ', 'exam-'))) {
                        examMatch = true;
                    }
                } else {
                    examMatch = true; // If 'All' is selected
                }
            });

            const searchMatch = searchTerm === '' || title.includes(searchTerm) || description.includes(searchTerm);

            if (searchMatch && subjectMatch && pricingMatch && typeMatch && examMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Event listeners for filter and search
    if (courseSearchInput) {
        courseSearchInput.addEventListener('input', filterCoursesByTags);
    }
    if (subjectFilter) {
        subjectFilter.addEventListener('change', filterCoursesByTags);
    }
    if (pricingFilter) {
        pricingFilter.addEventListener('change', filterCoursesByTags);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', filterCoursesByTags);
    }
    if (examFilter) {
        examFilter.addEventListener('change', filterCoursesByTags);
    }
    if (filterButton) {
        filterButton.addEventListener('click', filterCoursesByTags);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const courseCards = document.querySelectorAll('.course-card');
    const subjectFilter = document.getElementById('subjectFilter');
    const pricingFilter = document.getElementById('pricingFilter');
    const typeFilter = document.getElementById('typeFilter');
    const examFilter = document.getElementById('examFilter');
    const filterButton = document.getElementById('filterButton');
    const courseSearchInput = document.getElementById('courseSearch');

    function filterCourses() {
        const selectedSubject = subjectFilter.value.toLowerCase();
        const selectedPricing = pricingFilter.value.toLowerCase();
        const selectedType = typeFilter.value.toLowerCase();
        const selectedExam = examFilter.value.toLowerCase();
        const searchTerm = courseSearchInput.value.toLowerCase();

        courseCards.forEach(card => {
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

    // Function to handle initial filtering based on URL parameters
    function applyInitialFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        const subjectParam = urlParams.get('subject');
        const examParam = urlParams.get('exam');

        if (subjectParam) {
            const normalizedSubject = subjectParam.trim().toLowerCase();
            subjectFilter.value = normalizedSubject.includes('singing') ? 'Singing' :
                                normalizedSubject.includes('piano') || normalizedSubject.includes('harmonium') ? 'Piano/Harmonium' :
                                normalizedSubject.includes('tabla') ? 'Tabla' : '';
        }

        if (examParam) {
            examFilter.value = examParam.trim();
        }

        // Trigger the filter after setting the select values
        filterCourses();

        // Optionally, scroll to the courses section to make the filtered results visible
        const courseSection = document.querySelector('.course-section');
        if (courseSection) {
            courseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    applyInitialFilters();
});