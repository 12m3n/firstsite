/* =========================================================
   "BEFORE YOU WALK AWAY" — SCRIPT
   Everything you're likely to want to customize lives in the
   CONFIG object right below. The rest of the file wires up
   the interactions (landing screen, scroll reveals, timeline,
   split-section animation, pause sequence, gallery lightbox,
   music toggle, progress bar, particle background).
   ========================================================= */

/* =========================================================
   CONFIG — EDIT ME
   ========================================================= */
const CONFIG = {
  // REPLACE: her name (used anywhere .js-partner-name appears in the HTML)
  partnerName: 'Laiba',

  // REPLACE: your company / group name
  companyName: 'Saabify',

  // REPLACE: the timeline shown in "Remember Where We Started".
  // Add, remove, or edit entries freely — they render automatically.
  timelineEvents: [
    {
      label: 'The Beginning',
      title: 'The Idea',
      text: 'Just a conversation between two people who believed something could be built.',
    },
    {
      label: 'Chapter One',
      title: 'The First Client',
      text: 'The moment it stopped being an idea and started being real.',
    },
    {
      label: 'Momentum',
      title: 'The First Win',
      text: 'Proof, for the first time, that this could actually work.',
    },
    {
      label: 'The Hard Stretch',
      title: 'The Difficult Days',
      text: 'Late nights, hard calls, and moments neither of us wants to repeat — but got through anyway.',
    },
    {
      label: 'The Result',
      title: 'What We Built',
      text: 'Something that didn\'t exist before we decided to build it.',
    },
    {
      label: 'Today',
      title: 'Where We Are Now',
      text: 'Still here. Still building. Still figuring it out, together.',
    },
  ],

  // REPLACE: background music. Leave musicSrc empty to keep the toggle disabled.
  musicSrc: '', // e.g. 'assets/music.mp3'
};

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  renderTimeline();
  initParticles();
  initProgressBar();
  initMusicToggle();
  initLandingScreen();
  initRevealObserver();
  initSplitSection();
  initPauseSequence();
  initGallery();
  initOneMoreToggle();
});

/* ---------- Apply name / company placeholders ---------- */
function applyConfig() {
  document.querySelectorAll('.js-partner-name').forEach((el) => {
    el.textContent = CONFIG.partnerName;
  });
  document.querySelectorAll('.js-company-name').forEach((el) => {
    el.textContent = CONFIG.companyName;
  });
  document.title = `Before You Walk Away — for ${CONFIG.partnerName}`;
}

/* ---------- Render timeline from CONFIG.timelineEvents ---------- */
function renderTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;

  CONFIG.timelineEvents.forEach((event) => {
    const item = document.createElement('div');
    item.className = 'timeline-item reveal';
    item.innerHTML = `
      <span class="timeline-dot"></span>
      <p class="timeline-year">${event.label}</p>
      <h3>${event.title}</h3>
      <p>${event.text}</p>
    `;
    container.appendChild(item);
  });
}

/* =========================================================
   LANDING SCREEN
   ========================================================= */
function initLandingScreen() {
  const landing = document.getElementById('landing');
  const openBtn = document.getElementById('openBtn');
  if (!landing || !openBtn) return;

  openBtn.addEventListener('click', () => {
    landing.classList.add('hide');
    document.documentElement.classList.remove('locked');
    document.documentElement.classList.add('unlocked');

    setTimeout(() => {
      document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  });
}

/* =========================================================
   SCROLL REVEAL (fade/slide in on scroll)
   ========================================================= */
function initRevealObserver() {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* =========================================================
   SPLIT SECTION (Anger / After Calming Down) — staggered reveal
   ========================================================= */
function initSplitSection() {
  const section = document.getElementById('disagree');
  if (!section || !('IntersectionObserver' in window)) {
    section?.classList.add('in-view');
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add('in-view');
          observer.unobserve(section);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
}

/* =========================================================
   INTERACTIVE PAUSE — three questions, one at a time
   ========================================================= */
function initPauseSequence() {
  const stage = document.getElementById('questionStage');
  const nextBtn = document.getElementById('pauseNextBtn');
  if (!stage || !nextBtn) return;

  const questions = Array.from(stage.querySelectorAll('.question'));
  const finalMsg = document.getElementById('questionFinal');
  let step = 0;

  nextBtn.addEventListener('click', () => {
    questions[step]?.classList.remove('is-active');
    step += 1;

    if (step < questions.length) {
      questions[step].classList.add('is-active');
      nextBtn.textContent = step === questions.length - 1 ? 'Continue' : 'Continue';
    } else {
      finalMsg.classList.add('is-active');
      nextBtn.classList.add('is-hidden');
    }
  });
}

/* =========================================================
   GALLERY LIGHTBOX
   ========================================================= */
function initGallery() {
  const items = Array.from(document.querySelectorAll('.masonry-item img'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!items.length || !lightbox) return;

  let currentIndex = 0;

  function open(index) {
    currentIndex = index;
    updateImage();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function close() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  function updateImage() {
    const img = items[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    updateImage();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateImage();
  }

  items.forEach((img, index) => {
    img.addEventListener('click', () => open(index));
  });

  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* =========================================================
   "ONE MORE THING" REVEAL (final section)
   ========================================================= */
function initOneMoreToggle() {
  const btn = document.getElementById('oneMoreBtn');
  const text = document.getElementById('oneMoreText');
  if (!btn || !text) return;

  btn.addEventListener('click', () => {
    const isOpen = text.classList.toggle('is-open');
    btn.textContent = isOpen ? 'Close' : 'One More Thing';
  });
}

/* =========================================================
   BACKGROUND MUSIC TOGGLE (off by default)
   ========================================================= */
function initMusicToggle() {
  const toggle = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  if (!toggle || !audio) return;

  const source = audio.querySelector('source');
  if (CONFIG.musicSrc) {
    source.src = CONFIG.musicSrc;
    audio.load();
  } else {
    // No music file configured — disable the toggle rather than error on play().
    toggle.disabled = true;
    toggle.style.opacity = '0.35';
    toggle.style.cursor = 'default';
    return;
  }

  let playing = false;
  toggle.addEventListener('click', () => {
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    playing = !playing;
    toggle.classList.toggle('playing', playing);
    toggle.setAttribute('aria-pressed', String(playing));
  });
}

/* =========================================================
   SCROLL PROGRESS BAR
   ========================================================= */
function initProgressBar() {
  const fill = document.getElementById('progressFill');
  if (!fill) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    fill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* =========================================================
   SUBTLE PARTICLE BACKGROUND (canvas)
   ========================================================= */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let width, height, particles;

  const PARTICLE_COUNT = 55;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.15,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 105, ${p.alpha})`;
      ctx.fill();
    });

    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}
