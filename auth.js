(function () {
  const USERS_KEY = 'alpha_option_users';
  const SESSION_KEY = 'alpha_option_session';

  function readUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function seedDemoUser() {
    const users = readUsers();
    const demoEmail = 'demo@alphaoption.com';
    if (users.some((user) => user.email === demoEmail)) {
      return;
    }

    users.push({
      id: `u_${Date.now()}`,
      fullName: 'Demo Trader',
      email: demoEmail,
      password: 'Demo12345!',
      createdAt: new Date().toISOString(),
    });
    writeUsers(users);
  }

  function register(payload) {
    const fullName = String(payload.fullName || '').trim();
    const email = normalizeEmail(payload.email);
    const password = String(payload.password || '');

    if (fullName.length < 2) {
      return { ok: false, error: 'Please enter your full name.' };
    }

    if (!isValidEmail(email)) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }

    if (password.length < 8) {
      return { ok: false, error: 'Password must be at least 8 characters.' };
    }

    const users = readUsers();
    if (users.some((user) => user.email === email)) {
      return { ok: false, error: 'This email is already registered.' };
    }

    const newUser = {
      id: `u_${Date.now()}`,
      fullName,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeUsers(users);

    return {
      ok: true,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    };
  }

  function login(payload) {
    const email = normalizeEmail(payload.email);
    const password = String(payload.password || '');
    const remember = Boolean(payload.remember);

    const users = readUsers();
    const matched = users.find((user) => user.email === email && user.password === password);

    if (!matched) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const expiresInMs = remember ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 8;
    const session = {
      userId: matched.id,
      email: matched.email,
      createdAt: Date.now(),
      expiresAt: Date.now() + expiresInMs,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return {
      ok: true,
      user: {
        id: matched.id,
        fullName: matched.fullName,
        email: matched.email,
      },
    };
  }

  function getCurrentUser() {
    try {
      const rawSession = localStorage.getItem(SESSION_KEY);
      if (!rawSession) {
        return null;
      }

      const session = JSON.parse(rawSession);
      if (!session || Date.now() > Number(session.expiresAt || 0)) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }

      const users = readUsers();
      const user = users.find((item) => item.id === session.userId);
      if (!user) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
      };
    } catch (error) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  seedDemoUser();

  window.alphaAuth = {
    register,
    login,
    logout,
    getCurrentUser,
  };
})();
