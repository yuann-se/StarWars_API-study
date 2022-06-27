import { abortFetching } from "./api.js";
const container = document.getElementById("app");
const bootstrap = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";

let cssPromise = {};
function loadStyles(src) {
  if (!cssPromise[src]) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = src;
    cssPromise[src] = new Promise((resolve) => {
      link.addEventListener("load", () => resolve());
    });
    document.head.append(link);
  }
  return cssPromise[src];
}

async function showSpinner() {
  await loadStyles("./spinner.css");
  container.innerHTML = `<div class="loader-spinner">
  <svg viewBox="0 0 120 120" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <circle class="load one" cx="60" cy="60" r="20" pathLength="1" />
    <circle class="load two" cx="60" cy="60" r="10" />
    <circle class="load three" cx="60" cy="60" r="30" pathLength="1" />
  </svg>
</div>`;
}

showSpinner();

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, { subtree: true, childList: true });

function onUrlChange() {
  const pageParams = new URLSearchParams(window.location.search);
  const episode = pageParams.get("episode");
  abortFetching();
  episode
    ? localStorage.setItem("url", episode)
    : localStorage.removeItem("url");
}

function refreshPage(module, apiFunctionImport) {
  Promise.all([
    import(module),
    apiFunctionImport,
    loadStyles(bootstrap),
  ]).then(([module, data]) => {
    module.renderPage(data);
  });
}

const episode = localStorage.getItem("url");
if (episode) {
  refreshPage(
    "./episodeDetails.js",
    import("./api.js").then((res) => res.getEpisodeInfo(episode))
  );
  history.pushState(null, "", `index.html?episode=${episode}`);
} else
  refreshPage(
    "./episodesList.js",
    import("./api.js").then((res) => res.getEpisodesList())
  );

window.addEventListener("popstate", () => {
  const pageParams = new URLSearchParams(window.location.search);
  const episode = pageParams.get("episode");
  showSpinner();
  episode
    ? refreshPage(
      "./episodeDetails.js",
      import("./api.js").then((res) => res.getEpisodeInfo(episode))
    )
    : refreshPage(
      "./episodesList.js",
      import("./api.js").then((res) => res.getEpisodesList())
    );
});

export { showSpinner, refreshPage };
