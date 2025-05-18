import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';

import {
  getFirestore,
  doc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBaDBLoe2Wi2WgmJfPRXoEP-ZSgkVhMxVI",
  authDomain: "musicoul-15025.firebaseapp.com",
  databaseURL: "https://musicoul-15025-default-rtdb.firebaseio.com",
  projectId: "musicoul-15025",
  storageBucket: "musicoul-15025.appspot.com",
  messagingSenderId: "863099041367",
  appId: "1:863099041367:web:c3d61399489a219611d512",
  measurementId: "G-WBPE697N9Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

const protectedPages = ['/prarambhik.html'];
const currentPath = window.location.pathname;

if (protectedPages.includes(currentPath)) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', currentPath);
      localStorage.setItem('showLoginMessage', 'true');
      localStorage.setItem('triggerAuthPopup', 'true');
      window.location.href = '/index.html';
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const sideNav = document.querySelector('.side-nav');
  const closeSideNavBtn = document.querySelector('.close-btn');
  const body = document.body;
  const authPopup = document.getElementById('auth-popup');
  const closePopupBtns = document.querySelectorAll('.close-popup');
  const authTabs = document.querySelectorAll('.auth-tabs .tab');
  const authForms = document.querySelectorAll('.auth-forms form');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const notificationDiv = document.querySelector('.notification');

  const topAuthBtn = document.getElementById('top-auth-btn');
  const topLogoutBtn = document.getElementById('top-logout-btn');
  const sideNavLoginBtn = document.getElementById('side-nav-login-btn');
  const sideNavLogoutBtn = document.getElementById('side-nav-logout-btn');
  const bottomAuthBtn = document.getElementById('bottom-nav-auth-btn');

  function showNotification(message) {
    if (!notificationDiv) return;
    notificationDiv.textContent = message;
    notificationDiv.classList.add('show');
    setTimeout(() => {
      notificationDiv.classList.remove('show');
    }, 3000);
  }

  if (localStorage.getItem('showLoginMessage') === 'true') {
    showNotification('Please log in to access that page.');
    localStorage.removeItem('showLoginMessage');
  }

  if (localStorage.getItem('triggerAuthPopup') === 'true') {
    openAuthPopup();
    switchAuthTab('login');
    localStorage.removeItem('triggerAuthPopup');
  }

  function updateAuthUI(user) {
    if (!topAuthBtn || !topLogoutBtn || !sideNavLoginBtn || !sideNavLogoutBtn || !bottomAuthBtn) return;

    if (user) {
      topAuthBtn.style.display = 'none';
      topLogoutBtn.style.display = 'inline-block';
      sideNavLoginBtn.style.display = 'none';
      sideNavLogoutBtn.style.display = 'inline-block';
      bottomAuthBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Logout</span>';
      bottomAuthBtn.style.display = 'flex';
      bottomAuthBtn.style.flexDirection = 'column';
      bottomAuthBtn.style.alignItems = 'center';
      bottomAuthBtn.onclick = handleLogout;
    } else {
      topAuthBtn.style.display = 'inline-block';
      topLogoutBtn.style.display = 'none';
      sideNavLoginBtn.style.display = 'inline-block';
      sideNavLogoutBtn.style.display = 'none';
      bottomAuthBtn.innerHTML = '<i class="fas fa-user"></i><span>Login/Signup</span>';
      bottomAuthBtn.onclick = openBottomAuthPopup;
    }
  }

  onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);

    if (!user && (window.location.pathname === '/index.html' || window.location.pathname === '/')) {
      showNotification("Please Login/Signin First!");
    }

    if (user) {
      if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          window.location.href = redirectUrl;
        }
      }
    }
  });

  function openAuthPopup() {
    if (!authPopup) return;
    authPopup.style.display = 'flex';
    body.classList.add('popup-open');
    let overlay = document.querySelector('.overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.classList.add('overlay');
      body.appendChild(overlay);
      overlay.addEventListener('click', closeAuthPopup);
    }
  }

  function closeAuthPopup() {
    if (!authPopup) return;
    authPopup.style.display = 'none';
    body.classList.remove('popup-open');
    const overlay = document.querySelector('.overlay');
    if (overlay && body.contains(overlay)) {
      body.removeChild(overlay);
    }
  }

  function switchAuthTab(tabName) {
    authTabs.forEach(tab => tab.classList.remove('active'));
    authForms.forEach(form => form.classList.remove('active'));
    const targetTab = document.querySelector(`.auth-tabs .tab[data-tab="${tabName}"]`);
    const targetForm = document.getElementById(`${tabName}-form`);
    if (targetTab) targetTab.classList.add('active');
    if (targetForm) targetForm.classList.add('active');
  }

  function openTopAuthPopup(e) {
    e.preventDefault();
    openAuthPopup();
    switchAuthTab('login');
  }

  function openBottomAuthPopup(e) {
    e.preventDefault();
    openAuthPopup();
    switchAuthTab('login');
  }

  function handleLogout() {
    signOut(auth)
      .then(() => {
        showNotification("Logged out Successfully!");
      })
      .catch((error) => {
        showNotification("Error logging out.");
        console.error("Logout Error:", error);
      });
  }

  if (topAuthBtn) topAuthBtn.addEventListener('click', openTopAuthPopup);
  if (bottomAuthBtn) bottomAuthBtn.addEventListener('click', openBottomAuthPopup);
  if (topLogoutBtn) topLogoutBtn.addEventListener('click', handleLogout);
  if (sideNavLoginBtn) sideNavLoginBtn.addEventListener('click', openTopAuthPopup);
  if (sideNavLogoutBtn) sideNavLogoutBtn.addEventListener('click', handleLogout);

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('#login-email').value;
      const password = loginForm.querySelector('#login-password').value;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          closeAuthPopup();
          showNotification(`Logged in as ${user.email} Successfully!`);
        })
        .catch((error) => {
          let errorMessage = 'Login failed.';
          if (error.code === 'auth/user-not-found') errorMessage = 'User not found.';
          else if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password.';
          showNotification(errorMessage);
          console.error("Login Error:", error);
        });
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = signupForm.querySelector('#signup-name').value;
      const email = signupForm.querySelector('#signup-email').value;
      const password = signupForm.querySelector('#signup-password').value;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });

        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email
        });

        closeAuthPopup();
        showNotification(`Successfully signed up as ${name}!`);
      } catch (error) {
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
      }
    });
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sideNav.style.right = '0px';
    });
  }

  if (closeSideNavBtn) {
    closeSideNavBtn.addEventListener('click', () => {
      sideNav.style.right = '-250px';
    });
  }

  closePopupBtns.forEach(btn => {
    btn.addEventListener('click', closeAuthPopup);
  });

  authTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      switchAuthTab(this.dataset.tab);
    });
  });

  let lastScrollTop = 0;
  const navbar = document.querySelector('nav');
  window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && navbar) {
      if (scrollTop > navbar.offsetHeight) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
    } else if (navbar) {
      navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
  });
});

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes floatNoteSmoothGlow1 {
  0% { transform: translateY(0) translateX(0); opacity: 0.6; text-shadow: 0 0 5px transparent; }
  50% { transform: translateY(-8px) translateX(4px); opacity: 1; text-shadow: 0 0 10px lightblue; }
  100% { transform: translateY(0) translateX(0); opacity: 0.6; text-shadow: 0 0 5px transparent; }
}

@keyframes floatNoteSmoothGlow2 {
  0% { transform: translateY(0) translateX(0); opacity: 0.7; text-shadow: 0 0 5px transparent; }
  50% { transform: translateY(6px) translateX(-2px); opacity: 1; text-shadow: 0 0 10px lightblue; }
  100% { transform: translateY(0) translateX(0); opacity: 0.7; text-shadow: 0 0 5px transparent; }
}

.notes-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.musical-note {
  position: fixed;
  color: lightblue;
  font-size: 20px;
  opacity: 0.8;
  pointer-events: none;
  z-index: -1;
}

.notification.show {
  opacity: 1;
  transform: translateX(-50%) translateY(20px);
}

.notification {
  position: fixed;
  top: 75px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  z-index: 1001;
  opacity: 0;
  text-align: center;
  font-size: 0.9em;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

@media (max-width: 768px) {
  .musical-note {
    font-size: 16px;
  }
}
`;
document.head.appendChild(styleSheet);
