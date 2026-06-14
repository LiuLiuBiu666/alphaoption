const tabSignIn = document.getElementById('tabSignIn');
const tabSignUp = document.getElementById('tabSignUp');
const panelSignIn = document.getElementById('panelSignIn');
const panelSignUp = document.getElementById('panelSignUp');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const authMessage = document.getElementById('authMessage');
const showSignUpLink = document.getElementById('showSignUpLink');
const showSignInLink = document.getElementById('showSignInLink');

const params = new URLSearchParams(window.location.search);
const requestedMode = params.get('mode');
const redirectTo = params.get('redirect') || 'dashboard.html';

function showMessage(type, text) {
  if (!authMessage) {
    return;
  }

  authMessage.className = `auth-message ${type}`;
  authMessage.textContent = text;
}

function clearMessage() {
  if (!authMessage) {
    return;
  }

  authMessage.className = 'auth-message';
  authMessage.textContent = '';
}

function switchMode(mode) {
  const isSignUp = mode === 'signup';

  tabSignIn?.classList.toggle('active', !isSignUp);
  tabSignUp?.classList.toggle('active', isSignUp);
  panelSignIn?.classList.toggle('active', !isSignUp);
  panelSignUp?.classList.toggle('active', isSignUp);
  clearMessage();
}

if (window.alphaAuth?.getCurrentUser()) {
  window.location.href = redirectTo;
}

if (requestedMode === 'signup') {
  switchMode('signup');
}

tabSignIn?.addEventListener('click', () => switchMode('signin'));
tabSignUp?.addEventListener('click', () => switchMode('signup'));
showSignUpLink?.addEventListener('click', (event) => {
  event.preventDefault();
  switchMode('signup');
});
showSignInLink?.addEventListener('click', (event) => {
  event.preventDefault();
  switchMode('signin');
});

signInForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  clearMessage();

  const email = document.getElementById('loginEmail')?.value || '';
  const password = document.getElementById('loginPassword')?.value || '';
  const remember = Boolean(document.getElementById('rememberMe')?.checked);

  if (!window.alphaAuth) {
    showMessage('error', 'Authentication service is unavailable.');
    return;
  }

  const result = window.alphaAuth.login({ email, password, remember });
  if (!result.ok) {
    showMessage('error', result.error);
    return;
  }

  showMessage('success', 'Login successful. Redirecting...');
  setTimeout(() => {
    window.location.href = redirectTo;
  }, 450);
});

signUpForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  clearMessage();

  const fullName = document.getElementById('registerName')?.value || '';
  const email = document.getElementById('registerEmail')?.value || '';
  const password = document.getElementById('registerPassword')?.value || '';

  if (!window.alphaAuth) {
    showMessage('error', 'Authentication service is unavailable.');
    return;
  }

  const registration = window.alphaAuth.register({ fullName, email, password });
  if (!registration.ok) {
    showMessage('error', registration.error);
    return;
  }

  const loginResult = window.alphaAuth.login({ email, password, remember: true });
  if (!loginResult.ok) {
    showMessage('error', 'Account created, but login failed. Please sign in.');
    switchMode('signin');
    return;
  }

  showMessage('success', 'Account created successfully. Redirecting...');
  setTimeout(() => {
    window.location.href = redirectTo;
  }, 500);
});
