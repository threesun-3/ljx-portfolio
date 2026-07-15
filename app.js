const data = window.PORTFOLIO_DATA;

const state = {
  category: "全部",
  keyword: "",
};

let revealObserver;

const $ = (selector, scope = document) => scope.querySelector(selector);

function fillProfile() {
  const { profile } = data;
  $("#profile-name").textContent = profile.name;
  $("#profile-role").textContent = profile.role;
  $("#profile-summary").textContent = profile.summary;
  $("#profile-location").textContent = profile.location;
  $("#profile-education").textContent = profile.education;
  $("#footer-name").textContent = profile.name;
  const monogram = $(".profile-monogram");
  if (monogram) monogram.textContent = profile.name.slice(0, 1).toUpperCase();
  document.title = `${profile.name}｜个人经历与证书`;

  const emailLink = $("#email-link");
  emailLink.href = `mailto:${profile.email}`;
  $("#resume-link").href = profile.resume || "#contact";

  $("#hero-stats").innerHTML = profile.stats
    .map((item) => {
      const match = String(item.value).match(/^(\d+)(.*)$/);
      const count = match?.[1] ?? item.value;
      const suffix = match?.[2] ?? "";
      return `
        <div>
          <dt>${escapeHTML(item.label)}</dt>
          <dd data-count="${escapeAttribute(count)}" data-suffix="${escapeAttribute(suffix)}">${escapeHTML(item.value)}</dd>
        </div>`;
    })
    .join("");
}

function renderSkills() {
  $("#skills-grid").innerHTML = data.skills
    .map(
      (skill) => `
        <article class="skill-card">
          <div class="skill-icon" aria-hidden="true">${escapeHTML(skill.icon)}</div>
          <h3>${escapeHTML(skill.title)}</h3>
          <p>${escapeHTML(skill.description)}</p>
        </article>`,
    )
    .join("");
}

function renderTimeline() {
  $("#timeline").innerHTML = data.experiences
    .map(
      (experience) => `
        <article class="timeline-item">
          <time class="timeline-date">${escapeHTML(experience.date)}</time>
          <div class="timeline-content">
            <h3>${escapeHTML(experience.title)}</h3>
            <p class="timeline-subtitle">${escapeHTML(experience.subtitle)}</p>
            <p>${escapeHTML(experience.description)}</p>
          </div>
        </article>`,
    )
    .join("");
}

function renderFilters() {
  const categories = ["全部", ...new Set(data.certificates.map((item) => item.category))];
  $("#certificate-filters").innerHTML = categories
    .map(
      (category) => `
        <button
          class="filter-button ${category === state.category ? "is-active" : ""}"
          type="button"
          data-category="${escapeHTML(category)}"
          aria-pressed="${category === state.category}"
        >${escapeHTML(category)}</button>`,
    )
    .join("");
}

function renderCertificates() {
  const keyword = state.keyword.trim().toLowerCase();
  const filtered = data.certificates.filter((certificate) => {
    const categoryMatch = state.category === "全部" || certificate.category === state.category;
    const haystack = `${certificate.title} ${certificate.issuer} ${certificate.description}`.toLowerCase();
    return categoryMatch && (!keyword || haystack.includes(keyword));
  });

  $("#certificate-grid").innerHTML = filtered
    .map((certificate) => {
      const index = data.certificates.indexOf(certificate);
      return `
        <button class="certificate-card" type="button" data-certificate-index="${index}">
          <span class="certificate-image">
            <img src="${escapeAttribute(certificate.image)}" alt="${escapeAttribute(certificate.title)}证书缩略图" loading="lazy" />
          </span>
          <span class="certificate-info">
            <span class="tag">${escapeHTML(certificate.category)}</span>
            <h3>${escapeHTML(certificate.title)}</h3>
            <span class="certificate-meta">
              <span>${escapeHTML(certificate.issuer)}</span>
              <time>${escapeHTML(certificate.date)}</time>
            </span>
          </span>
        </button>`;
    })
    .join("");

  $("#certificate-empty").hidden = filtered.length !== 0;
  if (revealObserver) registerReveal($("#certificate-grid").children);
}

function registerReveal(elements) {
  [...elements].forEach((element) => {
    if (element.classList.contains("reveal")) return;
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}

function setupReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  registerReveal(
    document.querySelectorAll(".section-heading, .skill-card, .photo-archive figure, .timeline-item, .certificate-card, .contact-inner"),
  );
}

function setupStatCounters() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.count);
        const suffix = element.dataset.suffix ?? "";
        if (!Number.isFinite(target)) return;

        const startedAt = performance.now();
        const duration = 720;
        const step = (now) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - (1 - progress) ** 3;
          element.textContent = `${Math.round(target * eased)}${suffix}`;
          if (progress < 1) requestAnimationFrame(step);
        };
        element.textContent = `0${suffix}`;
        requestAnimationFrame(step);
        observer.unobserve(element);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => observer.observe(counter));
}

function setupActiveNavigation() {
  const links = [...document.querySelectorAll("#site-nav a[href^='#']")];
  const sections = links
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter((item) => item.section);

  let scheduled = false;
  const update = () => {
    const marker = window.scrollY + window.innerHeight * 0.34;
    let current = sections[0];
    sections.forEach((item) => {
      if (item.section.offsetTop <= marker) current = item;
    });
    sections.forEach(({ link }) => {
      const active = link === current?.link;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    scheduled = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

function openCertificate(index) {
  const certificate = data.certificates[index];
  if (!certificate) return;

  $("#modal-image").src = certificate.image;
  $("#modal-image").alt = `${certificate.title}证书大图`;
  $("#modal-category").textContent = certificate.category;
  $("#modal-title").textContent = certificate.title;
  $("#modal-issuer").textContent = certificate.issuer;
  $("#modal-date").textContent = certificate.date;
  $("#modal-description").textContent = certificate.description;
  $("#modal-original").href = certificate.image;

  const modal = $("#certificate-modal");
  document.body.classList.add("modal-open");
  modal.showModal();
}

function closeCertificate() {
  const modal = $("#certificate-modal");
  modal.close();
  document.body.classList.remove("modal-open");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHTML(value);
}

function bindEvents() {
  const navToggle = $(".nav-toggle");
  const siteNav = $("#site-nav");

  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  $("#certificate-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    renderFilters();
    renderCertificates();
  });

  $("#certificate-search").addEventListener("input", (event) => {
    state.keyword = event.target.value;
    renderCertificates();
  });

  $("#certificate-grid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-certificate-index]");
    if (card) openCertificate(Number(card.dataset.certificateIndex));
  });

  $(".modal-close").addEventListener("click", closeCertificate);
  $("#certificate-modal").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeCertificate();
  });
  $("#certificate-modal").addEventListener("close", () => document.body.classList.remove("modal-open"));

  $("#copy-email").addEventListener("click", async () => {
    const email = data.profile.email;
    if (!email || email === "your-email@example.com") {
      showToast("请先在 data.js 中填写真实邮箱");
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      showToast("邮箱已复制");
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = email;
      fallback.setAttribute("readonly", "");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      const copied = document.execCommand("copy");
      fallback.remove();
      showToast(copied ? "邮箱已复制" : `邮箱：${email}`);
    }
  });
}

function init() {
  fillProfile();
  renderSkills();
  renderTimeline();
  renderFilters();
  renderCertificates();
  bindEvents();
  setupReveal();
  setupStatCounters();
  setupActiveNavigation();
  $("#current-year").textContent = new Date().getFullYear();
}

init();
