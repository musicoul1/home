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

// Firebase Config
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
const auth = getAuth(app);
const db = getFirestore(app);

// === Protected Page Redirection ===
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

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const authPopup = document.getElementById('auth-popup');
  const notificationDiv = document.querySelector('.notification');

  const topAuthBtn = document.getElementById('top-auth-btn');
  const topLogoutBtn = document.getElementById('top-logout-btn');
  const sideNavLoginBtn = document.getElementById('side-nav-login-btn');
  const sideNavLogoutBtn = document.getElementById('side-nav-logout-btn');
  const bottomAuthBtn = document.getElementById('bottom-nav-auth-btn');

  // === Show Notification ===
  function showNotification(message) {
    if (!notificationDiv) return;
    notificationDiv.textContent = message;
    notificationDiv.classList.add('show');
    setTimeout(() => notificationDiv.classList.remove('show'), 3000);
  }

  // === First Visit Notification ===
  if (!localStorage.getItem('visitedOnce')) {
    showNotification("Please Login/Signup First");
    localStorage.setItem('visitedOnce', 'true');
  }

  if (localStorage.getItem('showLoginMessage') === 'true') {
    showNotification("Please log in to access that page.");
    localStorage.removeItem('showLoginMessage');
  }

  if (localStorage.getItem('triggerAuthPopup') === 'true') {
    openAuthPopup();
    switchAuthTab('login');
    localStorage.removeItem('triggerAuthPopup');
  }

  // === Auth UI ===
  function updateAuthUI(user) {
    if (user) {
      topAuthBtn.style.display = 'none';
      topLogoutBtn.style.display = 'inline-block';
      sideNavLoginBtn.style.display = 'none';
      sideNavLogoutBtn.style.display = 'inline-block';
      bottomAuthBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Logout</span>';
      bottomAuthBtn.onclick = handleLogout;
    } else {
      topAuthBtn.style.display = 'inline-block';
      topLogoutBtn.style.display = 'none';
      sideNavLoginBtn.style.display = 'inline-block';
      sideNavLogoutBtn.style.display = 'none';
      bottomAuthBtn.innerHTML = '<i class="fas fa-user"></i><span>Login/Signup</span>';
      bottomAuthBtn.onclick = openAuthPopup;
    }
  }

  onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);

    if (user && localStorage.getItem('redirectAfterLogin')) {
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectUrl;
    }
  });

  // === Popup Handlers ===
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
    document.querySelectorAll('.auth-tabs .tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-forms form').forEach(form => form.classList.remove('active'));

    const targetTab = document.querySelector(`.auth-tabs .tab[data-tab="${tabName}"]`);
    const targetForm = document.getElementById(`${tabName}-form`);
    if (targetTab) targetTab.classList.add('active');
    if (targetForm) targetForm.classList.add('active');
  }

  // === Logout ===
  function handleLogout() {
    signOut(auth).then(() => {
      showNotification("Logged out successfully.");
    }).catch(error => {
      showNotification("Error logging out.");
      console.error("Logout Error:", error);
    });
  }

  // === Event Listeners ===
  topAuthBtn?.addEventListener('click', (e) => { e.preventDefault(); openAuthPopup(); switchAuthTab('login'); });
  sideNavLoginBtn?.addEventListener('click', (e) => { e.preventDefault(); openAuthPopup(); switchAuthTab('login'); });
  bottomAuthBtn?.addEventListener('click', (e) => { e.preventDefault(); openAuthPopup(); switchAuthTab('login'); });
  topLogoutBtn?.addEventListener('click', handleLogout);
  sideNavLogoutBtn?.addEventListener('click', handleLogout);

  document.querySelectorAll('.close-popup').forEach(btn => {
    btn.addEventListener('click', closeAuthPopup);
  });

  document.querySelectorAll('.auth-tabs .tab').forEach(tab => {
    tab.addEventListener('click', function () {
      switchAuthTab(this.dataset.tab);
    });
  });

  // === Auth Forms ===
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('#login-email').value;
    const password = loginForm.querySelector('#login-password').value;

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        closeAuthPopup();
        showNotification(`Welcome back, ${userCredential.user.email}`);
      })
      .catch(error => {
        let errorMessage = 'Login failed.';
        if (error.code === 'auth/user-not-found') errorMessage = 'User not found.';
        else if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password.';
        showNotification(errorMessage);
        console.error("Login Error:", error);
      });
  });

  const signupForm = document.getElementById('signup-form');
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = signupForm.querySelector('#signup-name').value;
    const email = signupForm.querySelector('#signup-email').value;
    const password = signupForm.querySelector('#signup-password').value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), { name, email });

      closeAuthPopup();
      showNotification(`Welcome to Musicoul, ${name}!`);
    } catch (error) {
      let errorMessage = 'Signup failed.';
      if (error.code === 'auth/email-already-in-use') errorMessage = 'Email already in use.';
      else if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email.';
      else if (error.code === 'auth/weak-password') errorMessage = 'Password too weak.';
      showNotification(errorMessage);
      console.error("Signup Error:", error);
    }
  });

  // === Hamburger Menu ===
  const hamburger = document.querySelector('.hamburger');
  const sideNav = document.querySelector('.side-nav');
  const closeSideNavBtn = document.querySelector('.close-btn');

  hamburger?.addEventListener('click', () => {
    if (sideNav) sideNav.style.right = '0px';
  });

  closeSideNavBtn?.addEventListener('click', () => {
    if (sideNav) sideNav.style.right = '-250px';
  });

  // === Navbar Hide on Scroll ===
  let lastScrollTop = 0;
  const navbar = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    if (navbar) {
      navbar.style.transform = scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight
        ? 'translateY(-100%)'
        : 'translateY(0)';
    }
    lastScrollTop = scrollTop;
  });
});
