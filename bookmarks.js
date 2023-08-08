chrome.storage.sync.get(null, function(items) {
    let bookmarksList = document.getElementById('bookmarksList');
    for (let url in items) {
      let bookmark = items[url];
      let link = document.createElement('a');
      link.href = bookmark.url + '?t=' + Math.floor(bookmark.time);
      link.textContent = "Video at " + bookmark.url;
      bookmarksList.appendChild(link);
      bookmarksList.appendChild(document.createElement('br')); // Line break
    }
  });