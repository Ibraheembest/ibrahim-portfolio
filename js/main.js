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
  container.innerHTML = data.map(job => `
    <div class="job-card">
      <div class="job-header">
        <h3 class="job-title">${job.role} | ${job.company.split('|')[0] || job.company}</h3>
        <span class="job-period">${job.period} | ${job.location}</span>
      </div>
      <div class="job-company">${job.company}</div>
      <ul class="job-bullets">
        ${job.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/* ── Render: Projects (Using milestones.json format) ────── */
function buildProjects(data) {
  const container = $('projects-grid');
  // Sort by date desc
  const sorted = [...data].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  container.innerHTML = sorted.map(p => {
    // Adapter for old milestones format to new CV format
    const linkObj = p.link ? `<a href="${p.link}" target="_blank" class="btn btn--primary" style="align-self:flex-start;font-size:0.8rem">${p.linkLabel || 'View Details'}</a>`
      : `<button class="btn btn--primary" style="align-self:flex-start;font-size:0.8rem">View Details</button>`;

    return `
    <div class="project-card">
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.description}</p>
      ${linkObj}
    </div>
  `}).join('');
}

/* ── Render: Education ──────────────────────────────────── */
function buildEducation(data) {
  const acadContainer = $('academic-list');
  const awdContainer = $('awards-list');

  acadContainer.innerHTML = data.academic.map(ed => `
    <div class="edu-card">
      <div class="edu-title">
        <span>${ed.degree}</span>
        <span class="edu-period">${ed.period}</span>
      </div>
      <div class="edu-uni">${ed.university} | ${ed.location}</div>
      ${ed.note ? `<div class="edu-note">${ed.note}</div>` : ''}
    </div>
  `).join('');

  awdContainer.innerHTML = data.awards.map(awd => `
    <div class="award-card">${awd}</div>
  `).join('');
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

  container.innerHTML = data.map(cert => {
    const isStudying = cert.status === 'studying' ? 'studying' : '';
    const icon = icons[cert.type] || '🔖';
    const postFix = cert.status === 'studying' ? ' (Studying)' : '';

    return `
    <div class="cert-card ${isStudying}">
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
      if (scrollY >= top - 100) {
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
  loadAllData();
});
