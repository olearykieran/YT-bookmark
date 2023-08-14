import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports.js';
import awsmobile from './src/aws-exports.js';

Amplify.configure(awsconfig);
Amplify.configure(awsmobile);

Amplify.Logger.LOG_LEVEL = 'DEBUG';

import { DataStore } from 'aws-amplify';
import { Bookmark } from './src/models/index.js';

// Function to update the bookmark count displayed in the popup
async function updateBookmarkCount() {
  console.log('Updating bookmark count...');
  const existingBookmarks = await DataStore.query(Bookmark);
  console.log('Existing bookmarks:', existingBookmarks); // Log the retrieved bookmarks
  const bookmarkCount = existingBookmarks.length;

  const bookmarkCountElement = document.getElementById('bookmarkCount');
  bookmarkCountElement.textContent = bookmarkCount;

  const bookmarkCountLabelElement = document.getElementById('bookmarkCountLabel');
  bookmarkCountLabelElement.style.display = 'inline'; // Show the label
}

// Call the function when the popup is loaded
updateBookmarkCount();

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

document.getElementById('bookmark').addEventListener('click', async function() {
  // Query the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    // Make sure at least one tab is found
    if (tabs.length === 0) {
      console.error('No active tab found');
      return;
    }

    console.log('Sending bookmarkVideo message to content script'); // Log before sending
     
    chrome.tabs.sendMessage(tabs[0].id, { action: "bookmarkVideo" }, async function(response) {
      console.log('Received response from content script:', response);
      if (response) {
        try {
          const existingBookmarks = await DataStore.query(Bookmark);
          
          if (existingBookmarks.length >= 10) {
            // Display a notification when bookmark limit is reached
            alert('You have reached the maximum bookmark limit. Please delete some bookmarks to save new ones.'); // Alert for limit reached
            return;
          }

          let bookmark = {
            url: response.url,
            timestamp: response.time,
            title: response.title,
            thumbnail: response.thumbnail,
          };

          await DataStore.save(new Bookmark(bookmark));
          console.log("Bookmark saved successfully!");
          alert("Bookmark saved successfully!");
          console.log("bookmark:", bookmark);
          await updateBookmarkCount(); // Update the bookmark count asynchronously
        } catch (error) {
          console.error("Error saving bookmark:", error);
        }
      } else {
        console.error('No video found');
      }
    });
  });
});

document.getElementById('viewBookmarks').addEventListener('click', function() {
  console.log('View All Bookmarks button clicked'); // Log message
  chrome.tabs.create({ url: 'bookmarks.html' }, function(tab) {
    if (chrome.runtime.lastError) {
      console.error('An error occurred:', chrome.runtime.lastError);
    } else {
      console.log('New tab created:', tab);
    }
  });
});







/* document.getElementById('bookmark').addEventListener('click', function() {
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
*/