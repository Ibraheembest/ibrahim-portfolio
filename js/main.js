/* ============================================================
   main.js — Ibrahim Portfolio | CV Style Data Renderer
   ============================================================ */

const ENDPOINTS = {
  profile: 'data/profile.json',
  experience: 'data/experience.json',
  projects: 'data/milestones.json',
  education: 'data/education.json',
  certifications: 'data/certifications.json'
};

/* ── DOM Utilities ───────────────────────────────────────── */
const $ = id => document.getElementById(id);

function renderSkeleton(containerId) {
  const container = $(containerId);
  if (container) {
    container.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem">Loading data...</p>`;
  }
}

/* ── Render: Profile Sidebar & Hero ─────────────────────── */
function buildProfile(data) {
  // Bio
  $('profile-title').textContent = data.title;
  $('profile-bio').innerHTML = data.bio.replace(/\n\n/g, '<br><br>');
  $('profile-photo').src = data.photo;
  $('nav-brand').textContent = data.name;

  // Contact Sidebar
  const sidebar = $('contact-list');
  const c = data.contact;

  const links = [
    { icon: '✉️', text: c.email, href: `mailto:${c.email}` },
    { icon: '📍', text: c.location },
    { icon: '💼', text: c.currentRole },
    { icon: '🔗', text: `${data.name} (LinkedIn)`, href: c.linkedin },
    { icon: '💻', text: `${data.name} (GitHub)`, href: c.github },
    { icon: '💬', text: `WhatsApp: ${c.whatsapp}`, href: `https://wa.me/${c.whatsapp.replace(/\D/g, '')}`, cls: 'mt-3' }
  ];

  sidebar.innerHTML = links.map(l => `
    <li class="${l.cls || ''}">
      <span class="contact-icon">${l.icon}</span>
      ${l.href ? `<a href="${l.href}" target="_blank" rel="noopener">${l.text}</a>` : `<span>${l.text}</span>`}
    </li>
  `).join('');
}

/* ── Render: Experience ─────────────────────────────────── */
function buildExperience(data) {
  const container = $('experience-list');
  container.innerHTML = data.map((job, index) => {
    const delay = `stagger-${(index % 4) + 1}`;
    return `
    <div class="job-card fade-up ${delay}">
      <div class="job-header">
        <h3 class="job-title">${job.role}</h3>
        <span class="job-period">${job.period} | ${job.location}</span>
      </div>
      <div class="job-company">${job.company}</div>
      <ul class="job-bullets">
        ${job.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
  `}).join('');
}

/* ── Render: Projects (Using milestones.json format) ────── */
function buildProjects(data) {
  const container = $('projects-grid');
  // Sort by date desc
  const sorted = [...data].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  container.innerHTML = sorted.map((p, index) => {
    const delay = `stagger-${(index % 4) + 1}`;
    const linkObj = p.link ? `<a href="${p.link}" target="_blank" class="btn btn--primary" style="align-self:flex-start;font-size:0.85rem">${p.linkLabel || 'View Details'}</a>`
      : `<button class="btn btn--outline" style="align-self:flex-start;font-size:0.85rem">View Details</button>`;

    const tagsObj = p.tags && p.tags.length ? `<div class="project-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>` : '';

    return `
    <div class="project-card fade-up ${delay}">
      ${p.category ? `<div class="project-category">${p.category}</div>` : ''}
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.description}</p>
      ${tagsObj}
      ${linkObj}
    </div>
  `}).join('');
}

/* ── Render: Education ──────────────────────────────────── */
function buildEducation(data) {
  const acadContainer = $('academic-list');
  const awdContainer = $('awards-list');

  acadContainer.innerHTML = data.academic.map((ed, index) => {
    const delay = `stagger-${(index % 4) + 1}`;
    return `
    <div class="edu-card fade-up ${delay}">
      <div class="edu-title">
        <span>${ed.degree || ''}</span>
        <span class="edu-period">${ed.year || ed.period || ''}</span>
      </div>
      <div class="edu-uni">${ed.university || ''} ${ed.location ? '| ' + ed.location : ''}</div>
      ${ed.major ? `<div class="edu-note">Major: ${ed.major}</div>` : ''}
      ${ed.note ? `<div class="edu-note">${ed.note}</div>` : ''}
    </div>
  `}).join('');

  awdContainer.innerHTML = data.awards.map((awd, index) => {
    const delay = `stagger-${(index % 4) + 1}`;
    if (typeof awd === 'string') {
      return `<div class="award-card fade-up ${delay}">${awd}</div>`;
    }
    return `
    <div class="award-card fade-up ${delay}" style="display:flex; flex-direction:column; gap:0.5rem; text-align:left;">
      <strong style="font-size:1.1rem; color:var(--primary)">${awd.title}</strong>
      <span style="font-size:0.85rem; color:var(--text-muted); font-weight:bold; text-transform:uppercase; letter-spacing:0.5px">${awd.type}</span>
      <p style="margin:0; font-size:0.95rem; line-height:1.6">${awd.description}</p>
    </div>
  `}).join('');
}

/* ── Render: Certifications ─────────────────────────────── */
function buildCertifications(data) {
  const container = $('cert-grid');

  const icons = {
    'self-study': '📘',
    'certified': '🏆',
    'training': '📜',
    'learning': '⏳',
    'recommendation': '⭐'
  };

  container.innerHTML = data.map((cert, index) => {
    const delay = `stagger-${(index % 4) + 1}`;
    const isStudying = cert.status === 'studying' ? 'studying' : '';
    const icon = icons[cert.type] || '🔖';
    const postFix = cert.status === 'studying' ? ' (Studying)' : '';

    return `
    <div class="cert-card fade-up ${delay} ${isStudying}">
      <span class="cert-icon">${icon}</span>
      <span>${cert.name}${postFix}</span>
    </div>
  `}).join('');
}

/* ── Dark Mode Logic ────────────────────────────────────── */
function initTheme() {
  const toggleBtn = $('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');

  let isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

  const updateTheme = () => {
    document.body.classList.toggle('dark', isDark);
    toggleBtn.innerHTML = isDark ? '☀️' : '🌙';
  };

  updateTheme();

  toggleBtn.addEventListener('click', () => {
    isDark = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateTheme();
  });
}

/* ── Navigation Scroll Spy ──────────────────────────────── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop;
      if (scrollY >= top - 150) {
        current = sec.getAttribute('id');
      }
    });

    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href').includes(current)) {
        l.classList.add('active');
      }
    });
  });
}

/* ── Scroll Animations ──────────────────────────────────── */
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // observer.unobserve(entry.target); // keep it dynamic or uncomment to animate only once
      }
    });
  }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ── Main Loader ────────────────────────────────────────── */
async function loadAllData() {
  const sections = ['contact-list', 'experience-list', 'projects-grid', 'academic-list', 'awards-list', 'cert-grid'];
  sections.forEach(renderSkeleton);

  try {
    const v = '?v=' + Date.now();

    // Fetch all sequentially or parallel
    const [prof, exp, proj, edu, certs] = await Promise.all([
      fetch(ENDPOINTS.profile + v).then(r => r.json()),
      fetch(ENDPOINTS.experience + v).then(r => r.json()),
      fetch(ENDPOINTS.projects + v).then(r => r.json()),
      fetch(ENDPOINTS.education + v).then(r => r.json()),
      fetch(ENDPOINTS.certifications + v).then(r => r.json())
    ]);

    buildProfile(prof);
    buildExperience(exp);
    buildProjects(proj);
    buildEducation(edu);
    buildCertifications(certs);

  } catch (err) {
    console.error('Data loading error:', err);
    $('profile-wrap').innerHTML = `<p style="color:red;padding:20px">Failed to load data. Ensure local server is running.</p>`;
  }
}

/* ── Init ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollSpy();
  loadAllData().then(() => {
    // Add fade up to static elements too
    document.querySelectorAll('.profile-wrap, .section-header').forEach((el, index) => {
      el.classList.add('fade-up');
      if(index > 0) el.classList.add('stagger-1');
    });
    // Init animations after DOM is fully built by API
    setTimeout(initAnimations, 100);
  });
});
