async function loadSiteData() {
  const response = await fetch('data/site.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Could not load site data');
  }
  return response.json();
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node && value != null) node.textContent = value;
}

function setLink(id, href, text) {
  const node = document.getElementById(id);
  if (!node) return;
  node.href = href || '#';
  node.textContent = text || '';
}

function renderList(id, entries, formatter) {
  const list = document.getElementById(id);
  if (!list) return;
  list.innerHTML = '';
  entries.forEach((entry) => {
    const li = document.createElement('li');
    li.innerHTML = formatter(entry);
    list.appendChild(li);
  });
}

function applyData(data) {
  setText('brandName', data.name);
  setText('salonName', data.name);
  setText('tagline', data.tagline);
  setText('introText', data.intro);
  setText('aboutText', data.about);

  const phoneHref = data.contact.phone ? `tel:${data.contact.phone.replace(/\s+/g, '')}` : '#';
  const mobileHref = data.contact.mobile ? `tel:${data.contact.mobile.replace(/\s+/g, '')}` : '#';
  const emailHref = data.contact.email ? `mailto:${data.contact.email}` : '#';

  setText('contactAddress', data.contact.address);
  setLink('contactPhone', phoneHref, data.contact.phone);
  setLink('contactMobile', mobileHref, data.contact.mobile);
  setLink('contactEmail', emailHref, data.contact.email);

  setLink('callBtn', phoneHref, 'Call us');
  setLink('mapBtn', data.contact.mapUrl, 'Find us');

  renderList('hoursList', data.hours, (entry) => `<span>${entry.day}</span><span>${entry.hours}</span>`);
  renderList('pricesMen', data.prices.men, (entry) => `<span>${entry.service}</span><span>${entry.price}</span>`);
  renderList('pricesWomen', data.prices.women, (entry) => `<span>${entry.service}</span><span>${entry.price}</span>`);

  setText('footerText', `© ${new Date().getFullYear()} ${data.name}`);
}

function setupNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

(async function init() {
  try {
    const data = await loadSiteData();
    applyData(data);
  } catch (error) {
    console.error(error);
  } finally {
    setupNavToggle();
  }
})();
