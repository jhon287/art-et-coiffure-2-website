const DEFAULT_LANGUAGE = 'fr';

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

function updateLanguageLinks(activeLanguage) {
  document.querySelectorAll('.language-switch a[data-lang]').forEach((link) => {
    const isActive = link.dataset.lang === activeLanguage;
    link.classList.toggle('active', isActive);
    link.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function getLanguageFromUrlOrStorage(availableLanguages) {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang');
  const savedLang = localStorage.getItem('lang');

  if (urlLang && availableLanguages.includes(urlLang)) return urlLang;
  if (savedLang && availableLanguages.includes(savedLang)) return savedLang;
  if (availableLanguages.includes(DEFAULT_LANGUAGE)) return DEFAULT_LANGUAGE;
  return availableLanguages[0];
}

function setDocumentLanguage(lang) {
  document.documentElement.setAttribute('lang', lang);
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url);
  localStorage.setItem('lang', lang);
}

function applyTranslations(translations) {
  setText('navAbout', translations.nav.about);
  setText('navHours', translations.nav.hours);
  setText('navPrices', translations.nav.prices);
  setText('navContact', translations.nav.contact);

  setText('aboutTitle', translations.sections.aboutTitle);
  setText('hoursTitle', translations.sections.hoursTitle);
  setText('pricesTitle', translations.sections.pricesTitle);
  setText('pricesMenTitle', translations.sections.pricesMenTitle);
  setText('pricesWomenTitle', translations.sections.pricesWomenTitle);
  setText('contactTitle', translations.sections.contactTitle);

  setText('labelAddress', `${translations.labels.address}:`);
  setText('labelPhone', `${translations.labels.phone}:`);
  setText('labelMobile', `${translations.labels.mobile}:`);
  setText('labelEmail', `${translations.labels.email}:`);

  setText('callBtn', translations.actions.call);
  setText('mapBtn', translations.actions.map);
}

function applyData(data, language) {
  const langData = data.languages[language];

  setText('brandName', data.name);
  setText('salonName', data.name);

  setText('introText', langData.intro);
  setText('aboutText', langData.about);

  const contactAddressHref =  data.contact.mapUrl ? data.contact.mapUrl : '#';
  const phoneHref = data.contact.phone ? `tel:${data.contact.phone.replace(/\s+/g, '')}` : '#';
  const mobileHref = data.contact.mobile ? `tel:${data.contact.mobile.replace(/\s+/g, '')}` : '#';
  const emailHref = data.contact.email ? `mailto:${data.contact.email}` : '#';
  const facebookHref = data.contact.facebookUrl ? data.contact.facebookUrl : '#';

  setLink('contactAddress', contactAddressHref, data.contact.address);
  setLink('contactPhone', phoneHref, data.contact.phone);
  setLink('contactMobile', mobileHref, data.contact.mobile);
  setLink('contactEmail', emailHref, data.contact.email);
  setLink('contactFacebook', facebookHref, "Art Et Coiffure 2");

  setLink('callBtn', phoneHref, langData.actions.call);
  setLink('mapBtn', data.contact.mapUrl, langData.actions.map);
  setLink('facebookBtn', data.contact.facebookUrl, langData.actions.follow);

  renderList('hoursList', langData.hours, (entry) => `<span>${entry.day}</span><span>${entry.hours}</span>`);
  renderList('pricesMen', langData.prices.men, (entry) => `<span>${entry.service}</span><span>${entry.price}</span>`);
  renderList('pricesWomen', langData.prices.women, (entry) => `<span>${entry.service}</span><span>${entry.price}</span>`);

  setText('pricesText1', langData.prices.text[0]);
  setText('pricesText2', langData.prices.text[1]);
  setText('pricesText3', langData.prices.text[2]);

  applyTranslations(langData);
  setText('footerText', `© ${new Date().getFullYear()} ${data.name}`);
  setDocumentLanguage(language);
  updateLanguageLinks(language);
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

function setupLanguageSwitcher(data, state) {
  document.querySelectorAll('.language-switch a[data-lang]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const nextLanguage = link.dataset.lang;
      if (!data.languages[nextLanguage]) return;
      state.currentLanguage = nextLanguage;
      applyData(data, state.currentLanguage);
    });
  });
}

(async function init() {
  try {
    const data = await loadSiteData();
    const availableLanguages = Object.keys(data.languages);
    const state = {
      currentLanguage: getLanguageFromUrlOrStorage(availableLanguages)
    };

    applyData(data, state.currentLanguage);
    setupLanguageSwitcher(data, state);
  } catch (error) {
    console.error(error);
  } finally {
    setupNavToggle();
  }
})();
