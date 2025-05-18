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
  setDoc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

// === Firebase Config ===
const firebaseConfig = {
  apiKey: "AIzaSyBaDBLoe2Wi2WgmJfPRXoEP-ZSgkVhMxVI",
  authDomain: "musicoul-15025.firebaseapp.com",
  projectId: "musicoul-15025",
  storageBucket: "musicoul-15025.appspot.com",
  messagingSenderId: "863099041367",
  appId: "1:863099041367:web:c3d61399489a219611d512",
  measurementId: "G-WBPE697N9Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
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
  const mclassBtn = document.getElementById('mclass-btn');

  let currentUserProfile = null;

  function showNotification(message) {
    if (!notificationDiv) return;
    notificationDiv.textContent = message;
    notificationDiv.classList.add('show');
    setTimeout(() => notificationDiv.classList.remove('show'), 3000);
  }

  function openAuthPopup() {
    authPopup.style.display = 'flex';
    document.body.classList.add('popup-open');
  }

  function closeAuthPopup() {
    authPopup.style.display = 'none';
    document.body.classList.remove('popup-open');
  }

  function switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tabs .tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-forms form').forEach(form => form.classList.remove('active'));
    document.querySelector(`.auth-tabs .tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-form`).classList.add('active');
  }

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
      bottomAuthBtn.onclick = () => { openAuthPopup(); switchAuthTab('login'); };
    }
  }

  async function fetchUserProfile(uid) {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      currentUserProfile = docSnap.data();
      return currentUserProfile;
    }
    return null;
  }

  function handleLogout() {
    signOut(auth).then(() => {
      showNotification("Logged out successfully.");
      currentUserProfile = null;
      setTimeout(() => location.reload(), 1000);
    }).catch(err => {
      showNotification("Error logging out.");
      console.error("Logout Error:", err);
    });
  }

  onAuthStateChanged(auth, async (user) => {
    updateAuthUI(user);
    if (user) {
      const profile = await fetchUserProfile(user.uid);
      if (profile) {
        showNotification(`Welcome to Musicoul, ${profile.name}!`);
      }
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
      }
    }
  });

  // Event bindings
  hamburger?.addEventListener('click', () => sideNav.style.right = '0px');
  closeSideNavBtn?.addEventListener('click', () => sideNav.style.right = '-250px');
  topAuthBtn?.addEventListener('click', (e) => { e.preventDefault(); openAuthPopup(); switchAuthTab('login'); });
  sideNavLoginBtn?.addEventListener('click', (e) => { e.preventDefault(); openAuthPopup(); switchAuthTab('login'); });
  document.querySelectorAll('.close-popup').forEach(btn => btn.addEventListener('click', closeAuthPopup));
  document.querySelectorAll('.auth-tabs .tab').forEach(tab => tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab)));
  topLogoutBtn?.addEventListener('click', (e) => { e.preventDefault(); handleLogout(); });
  sideNavLogoutBtn?.addEventListener('click', (e) => { e.preventDefault(); handleLogout(); });

  // === Login Form
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await fetchUserProfile(userCredential.user.uid);
      closeAuthPopup();
      if (profile && profile.name) {
        showNotification(`Welcome to Musicoul, ${profile.name}!`);
      } else {
        showNotification("Welcome back!");
      }
    } catch (error) {
      const msg = error.code === 'auth/user-not-found' ? 'User not found.' :
                  error.code === 'auth/wrong-password' ? 'Incorrect password.' :
                  'Login failed.';
      showNotification(msg);
    }
  });

  // === Signup Form
  const signupForm = document.getElementById('signup-form');
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const subject = document.getElementById('signup-subject').value;
    const exam = document.getElementById('signup-exam').value;

    if (!name || !email || !password || !subject || !exam) {
      showNotification("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, "users", user.uid), { name, email, subject, exam });
      currentUserProfile = { name, email, subject, exam };
      closeAuthPopup();
      showNotification(`Welcome to Musicoul, ${name}!`);
    } catch (error) {
      const msg = error.code === 'auth/email-already-in-use' ? 'Email already in use.' :
                  error.code === 'auth/invalid-email' ? 'Invalid email.' :
                  error.code === 'auth/weak-password' ? 'Password too weak.' :
                  'Signup failed.';
      showNotification(msg);
    }
  });

  // === M-Class Redirection
  function getClassRedirectURL(subject, exam) {
    if (subject === 'Singing' && exam === '1') return 'prarambhik.html';
    if (subject === 'Singing' && exam === '4') return 'madhyama-pratham.html';
    if (subject === 'Singing' && exam === '5') return 'madhyama-purna.html';
    if (subject === 'Singing' && exam === '6') return 'visharad-pratham.html';
    if (subject === 'Piano' && exam === '1') return 'piano-prarambhik.html';
    if (subject === 'Piano' && exam === '3') return 'piano-praveshikapurna.html';
    if (subject === 'Tabla' && exam === '1') return 'tabla-prarambhik.html';
    if (subject === 'Sugam-Sangeet' && exam === '1') return 'sugam-prarambhik.html';
    return null;
  }

  mclassBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!auth.currentUser || !currentUserProfile) {
      showNotification("Please login first.");
      openAuthPopup();
      switchAuthTab('login');
      return;
    }

    const { subject, exam } = currentUserProfile;
    const redirectURL = getClassRedirectURL(subject, exam);
    if (redirectURL) {
      window.location.href = redirectURL;
    } else {
      showNotification("Invalid subject or exam. Please contact support.");
    }
  });
});
