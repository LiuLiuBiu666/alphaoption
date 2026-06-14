const user = window.alphaAuth?.getCurrentUser();

if (!user) {
  window.location.href = 'login.html?redirect=dashboard.html';
}

const dashTitle = document.getElementById('dashTitle');
const dashMeta = document.getElementById('dashMeta');
const dashLogoutBtn = document.getElementById('dashLogoutBtn');

if (user) {
  if (dashTitle) {
    dashTitle.textContent = `Welcome, ${user.fullName}`;
  }

  if (dashMeta) {
    const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
    dashMeta.textContent = `${user.email} • Member since ${joinedDate}`;
  }
}

dashLogoutBtn?.addEventListener('click', () => {
  if (window.alphaAuth) {
    window.alphaAuth.logout();
  }
  window.location.href = 'index.html';
});
