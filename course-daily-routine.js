const LEGACY_COMMENT_EMAIL = 'leona_forex@shipnhanh.online';
const NEW_COMMENT_EMAIL = 'travis_cotton.bnb@phimhay.online';
const ALLOWED_COMMENT_EMAILS = [LEGACY_COMMENT_EMAIL, NEW_COMMENT_EMAIL];
const STORAGE_KEY = 'dailyRoutineComments_v2';
const TODAY_SEED_COMMENT = {
  email: NEW_COMMENT_EMAIL,
  text: 'Excellent framework. I started using this daily routine today and it immediately improved my focus before market open. The pre-market checklist and end-of-day review structure are clear, practical, and easy to follow.',
  createdAt: '2026-06-14T09:00:00.000Z',
};
const REMOVED_COMMENT = {
  email: LEGACY_COMMENT_EMAIL,
  text: TODAY_SEED_COMMENT.text,
};

const SEED_COMMENTS = [
  {
    email: LEGACY_COMMENT_EMAIL,
    text: 'This lesson completely changed how I structure my trading day. The EOD review framework alone saved me from several bad trades this week. Highly recommend building this routine from day one.',
    createdAt: '2026-06-10T08:42:00.000Z',
  },
  {
    email: LEGACY_COMMENT_EMAIL,
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
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((comment) => comment && typeof comment.text === 'string' && typeof comment.createdAt === 'string')
      .map((comment) => ({
        email: typeof comment.email === 'string' ? comment.email.trim().toLowerCase() : LEGACY_COMMENT_EMAIL,
        text: comment.text,
        createdAt: comment.createdAt,
      }));
  } catch (error) {
    return [];
  }
}

function saveComments(comments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

function ensureSeedComments() {
  const stored = loadComments();
  const missingSeedComments = SEED_COMMENTS.filter(
    (seed) =>
      !stored.some(
        (comment) =>
          comment.email === seed.email && comment.text === seed.text && comment.createdAt === seed.createdAt
      )
  );

  if (!missingSeedComments.length) {
    return;
  }

  saveComments([...stored, ...missingSeedComments]);
}

function ensureTodaySeedComment() {
  const comments = loadComments();
  const exists = comments.some(
    (comment) =>
      comment.email === TODAY_SEED_COMMENT.email &&
      comment.text === TODAY_SEED_COMMENT.text &&
      comment.createdAt === TODAY_SEED_COMMENT.createdAt
  );

  if (exists) {
    return;
  }

  comments.unshift(TODAY_SEED_COMMENT);
  saveComments(comments);
}

function removeDeletedComments() {
  const comments = loadComments();
  const filtered = comments.filter(
    (comment) => !(comment.email === REMOVED_COMMENT.email && comment.text === REMOVED_COMMENT.text)
  );

  if (filtered.length !== comments.length) {
    saveComments(filtered);
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

  const html = comments
    .map((comment) => {
      const commentEmail = comment.email || LEGACY_COMMENT_EMAIL;
      const initial = commentEmail.charAt(0).toUpperCase();
      const safeText = escapeHtml(comment.text);
      const timeText = formatDate(comment.createdAt);
      return `<div class="comment-item"><div class="avatar">${initial}</div><div><div class="comment-meta"><strong>${escapeHtml(commentEmail)}</strong> &bull; ${timeText}</div><div class="comment-text">${safeText}</div></div></div>`;
    })
    .join('');

  commentList.innerHTML = html;
}

function isAllowedEmail(email) {
  return ALLOWED_COMMENT_EMAILS.includes(email.trim().toLowerCase());
}

function hasCommentedByEmail(email) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  const comments = loadComments();
  return comments.some((comment) => (comment.email || '').trim().toLowerCase() === normalized);
}

function updateFormAccess() {
  const email = emailInput.value.trim().toLowerCase();
  const allowed = isAllowedEmail(email);
  const alreadyCommented = hasCommentedByEmail(email);

  commentInput.disabled = !allowed || alreadyCommented;
  postCommentButton.disabled = !allowed || alreadyCommented;

  if (!allowed && email.trim()) {
    showWarning('This email is not authorized to comment on this lesson.');
  } else if (alreadyCommented) {
    showWarning('Each email can only post one comment on this lesson.');
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

  if (hasCommentedByEmail(email)) {
    showWarning('Each email can only post one comment on this lesson.');
    return;
  }

  const comments = loadComments();
  comments.unshift({
    email,
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
ensureTodaySeedComment();
removeDeletedComments();
updateFormAccess();
renderComments();
