import { showSpinner, refreshPage } from "./main.js";

const container = document.getElementById("app");

function renderList(name, urlArray, wrapper) {
  import("./api.js")
    .then((res) => res.getListData(urlArray))
    .then((res) => Promise.all(res))
    .then((data) => {
      const h2 = document.createElement("h2");
      h2.classList.add("h2");
      h2.textContent = name;
      const ul = document.createElement("ul");
      ul.classList.add("list-group", "col-6");

      data.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = item.name;
        ul.append(li);
      });
      wrapper.append(h2, ul);
    });
}

function renderPage(data) {
  document.title = `Episode ${data.episode_id} Info`;
  container.innerHTML = "";
  const btn = document.createElement("button");
  btn.classList.add("btn-primary", "d-block", "mb-3");
  btn.textContent = "Back to episodes";
  btn.addEventListener("click", () => {
    showSpinner();
    history.pushState(null, "", "/");
    refreshPage(
      "./episodesList.js",
      import("./api.js").then((res) => res.getEpisodesList())
    );
  });

  const h1 = document.createElement("h1");
  h1.classList.add("h1", "mb-3");
  h1.textContent = `${data.title} : ${data.episode_id}`;
  const p = document.createElement("p");
  p.classList.add("lead", "mb-3");
  p.textContent = data.opening_crawl;
  const planetsWrapper = document.createElement('div');
  planetsWrapper.id = "planets-wrapper";
  planetsWrapper.classList.add('mb-4');
  const speciesWrapper = document.createElement('div');
  speciesWrapper.id = "species-wrapper";
  speciesWrapper.classList.add('mb-4');
  const starshipsWrapper = document.createElement('div');
  starshipsWrapper.id = "starships-wrapper";

  container.append(btn, h1, p, planetsWrapper, speciesWrapper, starshipsWrapper);

  renderList("Planets", data.planets, document.getElementById("planets-wrapper"));
  renderList("Species", data.species, document.getElementById("species-wrapper"));
  renderList("Starships", data.starships, document.getElementById("starships-wrapper"));
}

export { renderPage };
