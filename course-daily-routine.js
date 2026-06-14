const ALLOWED_COMMENT_EMAIL = 'leona_forex@shipnhanh.online';
const STORAGE_KEY = 'dailyRoutineComments';

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

function formatDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('vi-VN');
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
    commentList.innerHTML = '<div class="comment-item">Chua co binh luan nao.</div>';
    return;
  }

  const html = comments
    .map((comment) => {
      const safeText = escapeHtml(comment.text);
      const timeText = formatDate(comment.createdAt);
      return `<article class="comment-item"><div>${safeText}</div><small>${ALLOWED_COMMENT_EMAIL} • ${timeText}</small></article>`;
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
    showWarning('Email nay khong duoc phep binh luan cho bai hoc nay.');
  } else if (!allowed) {
    showWarning('Nhap dung email duoc cap quyen de binh luan.');
  } else {
    clearWarning();
  }
}

function postComment() {
  const email = emailInput.value.trim().toLowerCase();
  const text = commentInput.value.trim();

  if (!isAllowedEmail(email)) {
    showWarning('Ban khong co quyen dang binh luan.');
    return;
  }

  if (!text) {
    showWarning('Noi dung binh luan khong duoc de trong.');
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

updateFormAccess();
renderComments();
