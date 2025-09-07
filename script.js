// genqr: HTML/JS QR generator with filename input and auto-fit sizing

const $ = (id) => document.getElementById(id);

function computeSize() {
  const host = document.getElementById('preview-box');
  if (host) {
    const rect = host.getBoundingClientRect();
    const s = Math.floor(Math.min(rect.width, rect.height));
    // Allow smaller sizes on very small screens and larger on desktops
    return Math.max(96, Math.min(s, 2048));
  }
  const s = Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.8);
  return Math.max(96, Math.min(s, 2048));
}

function sanitizeName(name) {
  const n = (name || 'qrcode.png').trim().replace(/[^a-z0-9._-]/gi, '_').toLowerCase();
  return n.endsWith('.png') ? n : `${n}.png`;
}

let qr = null;
let lastSize = 0;

function ensureQRCode(size) {
  const container = $('qr');
  if (!qr || lastSize !== size) {
    container.innerHTML = '';
    qr = new QRCode(container, {
      text: '',
      width: size,
      height: size,
      correctLevel: QRCode.CorrectLevel.M,
    });
    lastSize = size;
  }
}

function setButtonsEnabled(enabled) {
  $('download').disabled = !enabled;
  const copyBtn = $('copy');
  if (copyBtn) copyBtn.disabled = !enabled;
}

function render() {
  const text = $('qr-text').value || '';
  const hasText = text.trim().length > 0;
  setButtonsEnabled(hasText);

  const size = computeSize();
  ensureQRCode(size);

  // Keep container square according to computed size
  const box = $('qr');
  box.style.width = `${size}px`;
  box.style.height = `${size}px`;

  // qrcode.js updates via makeCode; width/height changes handled by re-init
  qr.clear();
  qr.makeCode(text);
}

// Observe preview box size to auto-fit QR
let ro;
function watchPreview() {
  const host = document.getElementById('preview-box');
  if (!host || typeof ResizeObserver === 'undefined') return;
  ro = new ResizeObserver(() => render());
  ro.observe(host);
}

// Debounced window resize as fallback
let resizeTimer;
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(render, 120); });

// Live update on text input
$('qr-text').addEventListener('input', render);

// Download button: export from canvas (or from image fallback)
$('download').addEventListener('click', () => {
  const name = sanitizeName($('filename').value);
  const container = $('qr');
  let dataUrl = '';

  const canvas = container.querySelector('canvas');
  if (canvas) {
    dataUrl = canvas.toDataURL('image/png');
  } else {
    const img = container.querySelector('img');
    if (img) {
      const size = Math.max(img.naturalWidth || lastSize, img.width || lastSize);
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      dataUrl = c.toDataURL('image/png');
    }
  }

  if (!dataUrl) return;
  const a = document.createElement('a');
  a.href = dataUrl; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
});

// Copy button: write image to clipboard if supported
const copyBtn = $('copy');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const container = $('qr');
    const canvas = container.querySelector('canvas');
    if (!canvas || !navigator.clipboard || !window.ClipboardItem) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        const original = copyBtn.textContent;
        copyBtn.textContent = 'คัดลอกแล้ว (Copied)';
        setTimeout(() => (copyBtn.textContent = original), 1200);
      } catch (_) { /* ignore */ }
    });
  });
}

// Initial render and observers
watchPreview();
render();
