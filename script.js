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

// === Firebase Config ===
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

// === Redirect if not logged in for protected pages ===
const protectedPages = ['/prarambhik.html'];
if (protectedPages.includes(location.pathname)) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', location.pathname);
      localStorage.setItem('showLoginMessage', 'true');
      localStorage.setItem('triggerAuthPopup', 'true');
      location.href = '/index.html';
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
  const hamburger = document.querySelector('.hamburger');
  const sideNav = document.querySelector('.side-nav');
  const closeSideNavBtn = document.querySelector('.close-btn');

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

  // === Update UI Based on Auth ===
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

  // === Popup Control ===
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
    }).catch(err => {
      showNotification("Error logging out.");
      console.error("Logout Error:", err);
    });
  }

  // === Hamburger ===
  hamburger?.addEventListener('click', () => sideNav.style.right = '0px');
  closeSideNavBtn?.addEventListener('click', () => sideNav.style.right = '-250px');

  // === Auth Button Listeners ===
  topAuthBtn?.addEventListener('click', (e) => { e.preventDefault(); openAuthPopup(); switchAuthTab('login'); });
  sideNavLoginBtn?.addEventListener('click', (e) => { e.preventDefault(); openAuthPopup(); switchAuthTab('login'); });
  bottomAuthBtn?.addEventListener('click', (e) => { e.preventDefault(); openAuthPopup(); switchAuthTab('login'); });
  topLogoutBtn?.addEventListener('click', handleLogout);
  sideNavLogoutBtn?.addEventListener('click', handleLogout);

  document.querySelectorAll('.close-popup').forEach(btn => btn.addEventListener('click', closeAuthPopup));
  document.querySelectorAll('.auth-tabs .tab').forEach(tab => tab.addEventListener('click', () => {
    switchAuthTab(tab.dataset.tab);
  }));

  // === Remember Me: Login ===
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const emailInput = loginForm.querySelector('#login-email');
    const rememberDiv = document.createElement('div');
    rememberDiv.classList.add('remember-me');
    rememberDiv.innerHTML = `
      <input type="checkbox" id="remember-login" />
      <label for="remember-login">Remember me</label>
    `;
    loginForm.insertBefore(rememberDiv, loginForm.querySelector('.auth-button'));

    const savedLoginEmail = localStorage.getItem('rememberedLoginEmail');
    if (emailInput && savedLoginEmail) {
      emailInput.value = savedLoginEmail;
      rememberDiv.querySelector('#remember-login').checked = true;
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value;
      const password = loginForm.querySelector('#login-password').value;
      const remember = rememberDiv.querySelector('#remember-login').checked;

      if (remember) localStorage.setItem('rememberedLoginEmail', email);
      else localStorage.removeItem('rememberedLoginEmail');

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          closeAuthPopup();
          showNotification(`Welcome back, ${userCredential.user.email}`);
        })
        .catch((error) => {
          let msg = 'Login failed.';
          if (error.code === 'auth/user-not-found') msg = 'User not found.';
          else if (error.code === 'auth/wrong-password') msg = 'Incorrect password.';
          showNotification(msg);
          console.error("Login Error:", error);
        });
    });
  }

  // === Remember Me: Signup ===
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');

    const rememberDiv = document.createElement('div');
    rememberDiv.classList.add('remember-me');
    rememberDiv.innerHTML = `
      <input type="checkbox" id="remember-signup" />
      <label for="remember-signup">Remember me</label>
    `;
    signupForm.insertBefore(rememberDiv, signupForm.querySelector('.auth-button'));

    const savedSignupEmail = localStorage.getItem('rememberedSignupEmail');
    if (emailInput && savedSignupEmail) {
      emailInput.value = savedSignupEmail;
      rememberDiv.querySelector('#remember-signup').checked = true;
    }

    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const remember = rememberDiv.querySelector('#remember-signup').checked;

      if (!name || !email || !password) {
        showNotification("Please fill in all fields.");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, "users", user.uid), { name, email });

        if (remember) localStorage.setItem("rememberedSignupEmail", email);
        else localStorage.removeItem("rememberedSignupEmail");

        closeAuthPopup();
        showNotification(`Welcome to Musicoul, ${name}!`);
      } catch (error) {
        let msg = 'Signup failed.';
        if (error.code === 'auth/email-already-in-use') msg = 'Email already in use.';
        else if (error.code === 'auth/invalid-email') msg = 'Invalid email.';
        else if (error.code === 'auth/weak-password') msg = 'Password too weak.';
        showNotification(msg);
        console.error("Signup Error:", error);
      }
    });
  }

  // === Block Access to Pages for Unauthenticated Users ===
  function protectLink(selector) {
    const link = document.querySelector(selector);
    if (!link) return;
    link.addEventListener('click', (e) => {
      if (!auth.currentUser) {
        e.preventDefault();
        showNotification("Please Login/Signup First");
        openAuthPopup();
        switchAuthTab('login');
      }
    });
  }

  protectLink('a[href="courses.html"]');
  protectLink('a[href="events.html"]');
  protectLink('a[href="myclass.html"]');
  protectLink('a[href="m-youtube.html"]');

  // === Navbar Scroll Behavior ===
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
