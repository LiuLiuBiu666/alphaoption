const ALLOWED_COMMENT_EMAIL = 'leona_forex@shipnhanh.online';
const STORAGE_KEY = 'dailyRoutineComments_v2';

const SEED_COMMENTS = [
  {
    text: 'This lesson completely changed how I structure my trading day. The EOD review framework alone saved me from several bad trades this week. Highly recommend building this routine from day one.',
    createdAt: '2026-06-10T08:42:00.000Z',
  },
  {
    text: 'The checklist approach before market open is something I have been missing for months. Once I started following the pre-market routine outlined here, my win rate improved noticeably. Great lesson.',
    createdAt: '2026-06-12T14:17:00.000Z',
  },
];

const emailInput = document.getElementById('commentEmail');
const commentInput = document.getElementById('commentText');
const postCommentButton = document.getElementById('postCommentBtn');
const warningBox = document.getElementById('commentWarning');
const commentList = document.getElementById('commentList');

function showWarning(message) {
  warningBox.textContent = message;
  warningBox.classList.add('visible');
}

function clearWarning() {
  warningBox.textContent = '';
  warningBox.classList.remove('visible');
}

function loadComments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveComments(comments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

function ensureSeedComments() {
  const stored = loadComments();
  if (!stored.length) {
    saveComments([...SEED_COMMENTS]);
  }
}

function formatDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderComments() {
  const comments = loadComments();

  if (!comments.length) {
    commentList.innerHTML = '<p style="color:var(--muted);font-size:.9rem;">No comments yet. Be the first to comment.</p>';
    return;
  }

  const initial = ALLOWED_COMMENT_EMAIL.charAt(0).toUpperCase();
  const html = comments
    .map((comment) => {
      const safeText = escapeHtml(comment.text);
      const timeText = formatDate(comment.createdAt);
      return `<div class="comment-item"><div class="avatar">${initial}</div><div><div class="comment-meta"><strong>${ALLOWED_COMMENT_EMAIL}</strong> &bull; ${timeText}</div><div class="comment-text">${safeText}</div></div></div>`;
    })
    .join('');

  commentList.innerHTML = html;
}

function isAllowedEmail(email) {
  return email.trim().toLowerCase() === ALLOWED_COMMENT_EMAIL;
}

function updateFormAccess() {
  const email = emailInput.value;
  const allowed = isAllowedEmail(email);

  commentInput.disabled = !allowed;
  postCommentButton.disabled = !allowed;

  if (!allowed && email.trim()) {
    showWarning('This email is not authorized to comment on this lesson.');
  } else {
    clearWarning();
  }
}

function postComment() {
  const email = emailInput.value.trim().toLowerCase();
  const text = commentInput.value.trim();

  if (!isAllowedEmail(email)) {
    showWarning('You are not authorized to post a comment.');
    return;
  }

  if (!text) {
    showWarning('Comment cannot be empty.');
    return;
  }

  const comments = loadComments();
  comments.unshift({
    text,
    createdAt: new Date().toISOString(),
  });

  saveComments(comments);
  commentInput.value = '';
  clearWarning();
  renderComments();
}

emailInput.addEventListener('input', updateFormAccess);
postCommentButton.addEventListener('click', postComment);

ensureSeedComments();
updateFormAccess();
renderComments();
