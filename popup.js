document.getElementById('bookmark').addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "bookmarkVideo" }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('An error occurred:', chrome.runtime.lastError.message);
        return;
      }
      if (response) {
        let bookmark = response;
        chrome.storage.sync.set({ [bookmark.url]: bookmark }, function() {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else {
            // Bookmark saved.
          }
        });
      } else {
        console.error('No video found');
      }
    });
  });
});

  
  // You can also retrieve and display previously saved bookmarks here

  document.getElementById('viewBookmarks').addEventListener('click', function() {
    chrome.tabs.create({ url: 'bookmarks.html' });
  });

