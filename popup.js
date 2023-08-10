import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports.js';

Amplify.configure(awsconfig);

import { DataStore } from 'aws-amplify';
import { Bookmark } from './src/models/index.js';


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

document.getElementById('bookmark').addEventListener('click', function() {
  // Query the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    // Make sure at least one tab is found
    if (tabs.length === 0) {
      console.error('No active tab found');
      return;
    }
    
    // ... rest of the code
    chrome.tabs.sendMessage(tabs[0].id, { action: "bookmarkVideo" }, function(response) {
      // ... rest of the code
      if (response) {
        console.log("Debug time value:", response.time); // Add this line
        let bookmark = {
          url: response.url,
          timestamp: response.time,
          title: response.title,
          timeString: secondsToHMS(response.time)
        };

        // Save the bookmark using Amplify's DataStore
        DataStore.save(new Bookmark(bookmark)).then(() => {
          console.log("Bookmark saved successfully!");
          // You can also handle any post-save actions here
        }).catch(error => {
          console.error("Error saving bookmark:", error);
        });
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