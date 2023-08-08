function secondsToHMS(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds - (hrs * 3600)) / 60);
  const secs = Math.floor(seconds % 60);

  let timeString = '';
  if (hrs > 0) {
    timeString += hrs + 'h ';
  }
  if (mins > 0) {
    timeString += mins + 'm ';
  }
  timeString += secs + 's';

  return timeString;
}

function populateBookmarks() {
  chrome.storage.sync.get('bookmarks', function(data) {
    let bookmarks = data.bookmarks || [];
    let bookmarksList = document.getElementById('bookmarksList');
    bookmarksList.innerHTML = ''; // Clear previous bookmarks
    bookmarks.forEach(function(bookmark, index) {
      let timeString = secondsToHMS(bookmark.time);
      let li = document.createElement('li');
      // Added (index + 1) to the displayed text to number the bookmarks
      li.innerHTML = `${index + 1}. <a href="${bookmark.url}?t=${timeString}" target="_blank">${bookmark.title}</a> at ${timeString}
                      <button class="delete-button" data-index="${index}">Delete</button>`;
      bookmarksList.appendChild(li);
    });

    // Add event listeners to the delete buttons
    document.querySelectorAll('.delete-button').forEach(function(button) {
      button.addEventListener('click', function() {
        deleteBookmark(this.getAttribute('data-index'));
      });
    });
  });
}

function deleteBookmark(index) {
  chrome.storage.sync.get('bookmarks', function(data) {
    let bookmarks = data.bookmarks || [];
    bookmarks.splice(index, 1);
    chrome.storage.sync.set({ bookmarks: bookmarks }, populateBookmarks);
  });
}

populateBookmarks(); // Call the function to populate the bookmarks when the page loads
