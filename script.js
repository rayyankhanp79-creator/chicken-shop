/* ═══════════════════════════════════════════════════════
   SULEMAN CHICKEN HOUSE — JavaScript
═══════════════════════════════════════════════════════ */

// ── Configuration ─────────────────────────────────────
// UPDATE THIS NUMBER when the shop owner provides their WhatsApp number
const SHOP_WHATSAPP = '923001234567'; // Placeholder — update to real number

// ── Dynamic Copyright Year ─────────────────────────────
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ── Navbar scroll effect ───────────────────────────────
const navbar = document.getElementById('navbar');

function onScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // Run on load

// ── Mobile Navigation ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const mobileOverlay = document.getElementById('mobileOverlay');

function openMobileNav() {
  navLinks.classList.add('open');
  mobileOverlay.classList.add('active');
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  navLinks.classList.remove('open');
  mobileOverlay.classList.remove('active');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
});

mobileOverlay.addEventListener('click', closeMobileNav);

// Close on nav link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// ── Smooth Active Nav Link ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

// ── Order Modal ────────────────────────────────────────
const modalOverlay = document.getElementById('orderModalOverlay');
const modalClose = document.getElementById('modalClose');
const orderForm = document.getElementById('orderForm');
const productSelect = document.getElementById('productSelect');
const quantityInput = document.getElementById('quantityInput');
const notesInput = document.getElementById('notesInput');

function openOrderModal(productName) {
  // Set selected product if provided
  if (productName) {
    for (let i = 0; i < productSelect.options.length; i++) {
      if (productSelect.options[i].value === productName) {
        productSelect.selectedIndex = i;
        break;
      }
    }
  }

  // Reset form errors
  clearErrors();

  // Show modal
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focus on quantity if product is already set
  if (productSelect.value) {
    setTimeout(() => quantityInput.focus(), 100);
  } else {
    setTimeout(() => productSelect.focus(), 100);
  }
}

function closeOrderModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeOrderModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeOrderModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeOrderModal();
  }
});

// ── Form Validation & WhatsApp Message ────────────────
function clearErrors() {
  document.getElementById('productError').classList.remove('visible');
  document.getElementById('quantityError').classList.remove('visible');
  productSelect.classList.remove('error');
  quantityInput.classList.remove('error');
}

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  clearErrors();

  const product = productSelect.value.trim();
  const quantity = quantityInput.value.trim();
  const notes = notesInput.value.trim();

  let valid = true;

  if (!product) {
    document.getElementById('productError').classList.add('visible');
    productSelect.classList.add('error');
    valid = false;
  }

  if (!quantity) {
    document.getElementById('quantityError').classList.add('visible');
    quantityInput.classList.add('error');
    valid = false;
  }

  if (!valid) return;

  // Build WhatsApp message
  let message = `Hello! I'd like to place an order from *Suleman Chicken House*.\n\n`;
  message += `🐔 *Product:* ${product}\n`;
  message += `📦 *Quantity:* ${quantity}\n`;

  if (notes) {
    message += `📝 *Special Instructions:* ${notes}\n`;
  }

  message += `\nKindly confirm availability and price. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${SHOP_WHATSAPP}?text=${encodedMessage}`;

  // Open WhatsApp
  window.open(whatsappURL, '_blank', 'noopener,noreferrer');

  // Show confirmation feedback
  const submitBtn = document.getElementById('orderSubmitBtn');
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    WhatsApp Opened!
  `;
  submitBtn.style.background = '#128c7e';

  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.style.background = '';
    closeOrderModal();
    orderForm.reset();
  }, 2500);
});

// ── Entrance Animations (Intersection Observer) ────────
const animatedElements = document.querySelectorAll('.animate-in');

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

animatedElements.forEach(el => observer.observe(el));

// ── Scroll-triggered section animations ───────────────
const revealElements = document.querySelectorAll(
  '.product-card, .why-card, .step-card, .quality-item, .contact-block, .about-content-side, .about-image-side'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

// ── Respect reduced motion preference ─────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  revealElements.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.transition = 'none';
  });
}

// ── Make openOrderModal globally accessible ────────────
window.openOrderModal = openOrderModal;
