function getEpisodesList() {
  return fetch('https://swapi.dev/api/films').then((res) => res.json())
    .then((data) => {
      return data.results
    })
}

function getEpisodeInfo(number) {
  return fetch(`https://swapi.dev/api/films/${number}`).then((res) => res.json())
    .then((data) => {
      return data
    })
}

let controllers = [];
function getListData(array) {
  const controller = new AbortController();
  const signal = controller.signal;
  controllers.push(controller);
  let listData = [];
  let requests = array.map(url => fetch(url, { signal: signal }));
  return Promise.all(requests).then((res) => {
    res.forEach((item) => listData.push(item.json()));
    return listData;
  })
}

function abortFetching() {
  if (controllers) controllers.forEach((controller) => controller.abort());
}

export { getEpisodesList, getEpisodeInfo, getListData, abortFetching };
