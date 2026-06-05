// Scroll-triggered fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// Lightbox / image modal
const modal    = document.getElementById('modal');
const modalImg = modal.querySelector('.modal-img');
const closeBtn = modal.querySelector('.modal-close');
const backdrop = modal.querySelector('.modal-backdrop');

document.querySelectorAll('.card-img-wrap').forEach(wrap => {
  wrap.addEventListener('click', () => {
    const img = wrap.querySelector('.card-img');
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Smooth scroll for nav links
document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
