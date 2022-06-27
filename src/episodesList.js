import { showSpinner, refreshPage } from "./main.js";

function renderPage(data) {
  document.title = "Episodes List";
  const container = document.getElementById("app");
  container.innerHTML = "";
  const h1 = document.createElement("h1");
  h1.classList.add("h1", "mb-3");
  h1.textContent = "Episodes";
  const listGroup = document.createElement("div");
  listGroup.classList.add("list-group");
  listGroup.id = "episodes-list";

  data.forEach((item, index) => {
    const listItem = document.createElement("a");
    listItem.classList.add("list-group-item", "list-group-item-action");
    listItem.style.cursor = "pointer";
    listItem.textContent = `${index + 1}: ${item.title}`;
    listItem.href = `index.html?episode=${index + 1}`;

    listItem.addEventListener("click", (e) => {
      e.preventDefault();
      showSpinner();
      history.pushState(null, "", listItem.href);
      refreshPage(
        "./episodeDetails.js",
        import("./api.js").then((res) =>
          res.getEpisodeInfo(listItem.href.slice(-1, listItem.href.length))
        )
      );
    });
    listGroup.append(listItem);
  });
  container.append(h1, listGroup);
}

export { renderPage };
