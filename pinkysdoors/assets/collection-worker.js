async function fetchPage(url) {
  let response = await fetch(url);
  if (response.status === 200) {
    let data = await response.text();
    console.log('posting:'+ url);
    self.postMessage(data);
    // handle data
  }
}
self.addEventListener('message', event => {
  fetchPage('https://pinkysirondoors.com'+event.data);
});