document.getElementById('bookmark').addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "bookmarkVideo" }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('An error occurred:', chrome.runtime.lastError.message);
        return;
      }
      if (response) {
        console.log('Test message received', response);
        chrome.storage.sync.get('bookmarks', function(data) {
          let bookmarks = data.bookmarks || [];
          bookmarks.unshift(response); // Add the new bookmark to the beginning
          bookmarks = bookmarks.slice(0, 10); // Keep only the latest 10 bookmarks
          chrome.storage.sync.set({ bookmarks: bookmarks }, function() {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else {
              // Bookmark saved.
            }
          });
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

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "bookmarkVideo" }, function(response) {
      if (response) {
        console.log('Test message received', response);
      } else {
        console.error('No response received');
      }
    });
  });
  