const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");
const tabs = [...document.querySelectorAll("[data-project-tab]")];
const panels = [...document.querySelectorAll("[data-project-panel]")];

const projectVideos = {
  logistics: "",
  weighing: "",
};

function selectProject(project, focusTab = false) {
  tabs.forEach((tab) => {
    const active = tab.dataset.projectTab === project;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focusTab) tab.focus();
  });

  panels.forEach((panel) => {
    const active = panel.dataset.projectPanel === project;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });

  history.replaceState(null, "", `#${project}`);
  window.scrollTo({ top: document.querySelector(".project-switcher").offsetTop - 66, behavior: "auto" });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectProject(tab.dataset.projectTab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    selectProject(tabs[nextIndex].dataset.projectTab, true);
  });
});

navToggle.addEventListener("click", () => {
  const open = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

siteNav.addEventListener("click", () => {
  siteNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
});

document.querySelectorAll("[data-video-project]").forEach((player) => {
  const source = projectVideos[player.dataset.videoProject];
  if (!source) return;
  const video = player.querySelector("video");
  video.src = source;
  video.hidden = false;
  player.querySelector(".demo-placeholder").hidden = true;
});

const initialProject = location.hash.slice(1);
if (projectVideos[initialProject] !== undefined) selectProject(initialProject);
document.querySelector("#current-year").textContent = new Date().getFullYear();
