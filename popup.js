import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports.js';
import awsmobile from './src/aws-exports.js';

Amplify.configure(awsconfig);
Amplify.configure(awsmobile);

// Amplify.Logger.LOG_LEVEL = 'DEBUG';

import { DataStore } from 'aws-amplify';
import { Bookmark } from './src/models/index.js';

async function getUserId() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
      if (chrome.runtime.lastError) {
        console.error('Error fetching auth token:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
        return;
      }

      // Use the token to fetch user profile information
      fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('User Profile:', data); // Log entire user profile
        resolve(data.id); // Return the user ID or other relevant field
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        reject(error);
      });
    });
  });
}


// Function to update the bookmark count displayed in the popup
async function updateBookmarkCount() {
  console.log('Updating bookmark count...');
  const userId = await getUserId(); // Get user ID using Chrome Identity API
  console.log('userId:', userId);
  
  const allBookmarks = await DataStore.query(Bookmark);
  const userBookmarks = allBookmarks.filter(bookmark => bookmark.userID === userId.toString());
  console.log('User bookmarks:', userBookmarks); // Log the retrieved bookmarks for the user

  const bookmarkCount = userBookmarks.length; // Count only the bookmarks for the current user

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
          const uId = await getUserId(); // Get user ID using Chrome Identity API
          console.log('userId:', uId);

          const allBookmarks = await DataStore.query(Bookmark);
          const existingBookmarks = allBookmarks.filter(bookmark => bookmark.userID === uId.toString());
          console.log('Existing bookmarks for user:', existingBookmarks);

          
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
            userID: uId
          };

          console.log('bookmark object:', bookmark); // Log the bookmark object

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
