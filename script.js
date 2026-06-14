const toggleButton = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggleButton && navLinks) {
  toggleButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggleButton.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!navLinks.contains(target) && !toggleButton.contains(target)) {
      navLinks.classList.remove('open');
      toggleButton.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      navLinks.classList.remove('open');
      toggleButton.setAttribute('aria-expanded', 'false');
    }
  });
}

const revealTargets = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealTargets.forEach((item) => revealObserver.observe(item));

const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveSectionLink() {
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const scrollPosition = window.scrollY + 140;

  let activeId = '';
  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      activeId = section.id;
    }
  });

  sectionLinks.forEach((link) => {
    const target = link.getAttribute('href')?.slice(1);
    if (!target) {
      return;
    }

    if (target === activeId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', updateActiveSectionLink, { passive: true });
window.addEventListener('load', updateActiveSectionLink);

const navLoginLink = document.querySelector('.nav-links .login');
const navCtaLink = document.querySelector('.nav-links .cta');

function updateAuthNavigation() {
  if (!window.alphaAuth || !navLoginLink || !navCtaLink) {
    return;
  }

  const currentUser = window.alphaAuth.getCurrentUser();
  if (!currentUser) {
    navLoginLink.textContent = 'Log In';
    navLoginLink.setAttribute('href', 'login.html');

    navCtaLink.textContent = 'Join Now';
    navCtaLink.setAttribute('href', 'login.html?mode=signup');
    navCtaLink.dataset.logout = 'false';
    return;
  }

  navLoginLink.textContent = 'Dashboard';
  navLoginLink.setAttribute('href', 'dashboard.html');

  navCtaLink.textContent = 'Log Out';
  navCtaLink.setAttribute('href', '#');
  navCtaLink.dataset.logout = 'true';
}

if (navCtaLink) {
  navCtaLink.addEventListener('click', (event) => {
    if (navCtaLink.dataset.logout !== 'true') {
      return;
    }

    event.preventDefault();
    if (window.alphaAuth) {
      window.alphaAuth.logout();
    }
    updateAuthNavigation();
  });
}

updateAuthNavigation();
