// ---------- Mobile nav toggle (all pages) ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.textContent = open ? 'CLOSE' : 'MENU';
      toggle.setAttribute('aria-expanded', open);
    });
  }
});

// ---------- Homepage pie chart ----------
// EDIT ME: this is the single source of truth for the homepage chart.
// Percentages should add up to 100. Everything else on this page
// (labels, colors, copy) is generated from this array.
const PRACTICES = [
  {
    id: 'engineering',
    label: 'Engineering',
    percent: 25,
    color: '#4A6FA5',
    href: 'engineering.html',
    tagline: 'Building systems that hold up under real-world pressure, from mechanical prototypes to production software.',
    facts: [
      { num: '6+', label: 'Years designing' },
      { num: '14', label: 'Projects shipped' },
      { num: '2', label: 'Patents filed' },
      { num: 'CAD+Code', label: 'Core toolkit' },
    ],
  },
  {
    id: 'digital',
    label: 'Digital Solutions',
    percent: 20,
    color: '#3E6B6B',
    href: 'digital-solutions.html',
    tagline: 'Designing and building websites and apps for people who need their idea working in the real world, not just on paper.',
    facts: [
      { num: '22', label: 'Sites & apps built' },
      { num: '9', label: 'Clients served' },
      { num: '99.9%', label: 'Uptime delivered' },
      { num: 'React', label: 'Primary stack' },
    ],
  },
  {
    id: 'creative-art',
    label: 'Creative Art Business',
    percent: 18,
    color: '#B8734A',
    href: 'creative-art.html',
    tagline: 'Turning studio work into a small, sustainable business — from first sketch to finished product on someone\u2019s wall.',
    facts: [
      { num: '60+', label: 'Pieces sold' },
      { num: '9', label: 'Markets & fairs' },
      { num: '4', label: 'Product lines' },
      { num: '2021', label: 'Studio founded' },
    ],
  },
  {
    id: 'photography',
    label: 'Photography',
    percent: 15,
    color: '#8B6F8C',
    href: 'photography.html',
    tagline: 'Documenting people and places with a preference for available light and unposed moments.',
    facts: [
      { num: '40K+', label: 'Frames shot' },
      { num: '12', label: 'Publications' },
      { num: '5', label: 'Countries covered' },
      { num: '35mm', label: 'Preferred format' },
    ],
  },
  {
    id: 'gardening',
    label: 'Gardening',
    percent: 13,
    color: '#9C8B4E',
    href: 'gardening.html',
    tagline: 'Growing food and flowers in small spaces, and writing down what actually works season to season.',
    facts: [
      { num: '120', label: 'Species grown' },
      { num: '5', label: 'Seasons documented' },
      { num: '3', label: 'Community plots' },
      { num: 'Zone 6b', label: 'Growing zone' },
    ],
  },
  {
    id: 'nonprofit',
    label: 'Nonprofit',
    percent: 9,
    color: '#7A9471',
    href: 'nonprofit.html',
    tagline: 'Volunteering time and skills toward causes worth the hours — mostly education and community food access.',
    facts: [
      { num: '3', label: 'Organizations served' },
      { num: '500+', label: 'Volunteer hours' },
      { num: '$40K', label: 'Funds raised' },
      { num: '2019', label: 'First campaign' },
    ],
  },
];

function initPieChart() {
  const svg = document.getElementById('pie-svg');
  if (!svg) return;

  const cx = 210, cy = 210, rOuter = 200, rInner = 118;
  const legend = document.getElementById('legend');
  const panel = document.getElementById('detail-panel');
  const centerPct = document.getElementById('center-pct');
  const centerLbl = document.getElementById('center-lbl');

  const NS = 'http://www.w3.org/2000/svg';

  function polar(cx, cy, r, angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcPath(startAngle, endAngle) {
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const p1 = polar(cx, cy, rOuter, endAngle);
    const p2 = polar(cx, cy, rOuter, startAngle);
    const p3 = polar(cx, cy, rInner, startAngle);
    const p4 = polar(cx, cy, rInner, endAngle);
    return [
      `M ${p1.x} ${p1.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${p2.x} ${p2.y}`,
      `L ${p3.x} ${p3.y}`,
      `A ${rInner} ${rInner} 0 ${largeArc} 1 ${p4.x} ${p4.y}`,
      'Z',
    ].join(' ');
  }

  let angle = 0;
  const slices = [];

  PRACTICES.forEach((practice) => {
    const sweep = (practice.percent / 100) * 360;
    const start = angle;
    const end = angle + sweep;
    const mid = (start + end) / 2;
    angle = end;

    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', arcPath(start, end));
    path.setAttribute('fill', practice.color);
    path.setAttribute('class', 'pie-slice');
    path.setAttribute('tabindex', '0');
    path.setAttribute('role', 'button');
    path.setAttribute('aria-label', `${practice.label}, ${practice.percent} percent`);
    path.dataset.id = practice.id;

    const mvec = polar(0, 0, 1, mid);
    path.style.transform = 'translate(0px, 0px)';

    const select = () => selectPractice(practice.id, mvec);
    path.addEventListener('click', select);
    path.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); }
    });

    svg.appendChild(path);
    slices.push({ el: path, practice, mvec });
  });

  // Legend
  PRACTICES.forEach((practice) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.id = practice.id;
    btn.innerHTML = `<span class="dot" style="background:${practice.color}"></span>${practice.label} · ${practice.percent}%`;
    btn.addEventListener('click', () => {
      const s = slices.find((s) => s.practice.id === practice.id);
      selectPractice(practice.id, s.mvec);
    });
    legend.appendChild(btn);
  });

  function selectPractice(id, mvec) {
    const practice = PRACTICES.find((p) => p.id === id);

    slices.forEach((s) => {
      if (s.practice.id === id) {
        s.el.style.transform = `translate(${s.mvec.x * 14}px, ${s.mvec.y * 14}px)`;
        s.el.classList.remove('dimmed');
      } else {
        s.el.style.transform = 'translate(0px, 0px)';
        s.el.classList.add('dimmed');
      }
    });

    document.querySelectorAll('#legend button').forEach((b) => {
      b.classList.toggle('active', b.dataset.id === id);
    });

    centerPct.textContent = practice.percent + '%';
    centerLbl.textContent = practice.label;

    panel.style.setProperty('--dot', practice.color);
    panel.innerHTML = `
      <p class="detail-eyebrow"><span class="dot" style="background:${practice.color}"></span>${practice.label}</p>
      <h2>${practice.label}</h2>
      <p class="detail-percent">${practice.percent}% of practice</p>
      <p class="detail-copy">${practice.tagline}</p>
      <ul class="detail-facts">
        ${practice.facts.map(f => `<li><span class="fact-num">${f.num}</span><span class="fact-lbl">${f.label}</span></li>`).join('')}
      </ul>
      <a class="detail-cta" href="${practice.href}">View the full page
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    `;
  }

  // Select the largest slice by default
  const biggest = slices.reduce((a, b) => (a.practice.percent > b.practice.percent ? a : b));
  selectPractice(biggest.practice.id, biggest.mvec);
}

document.addEventListener('DOMContentLoaded', initPieChart);
