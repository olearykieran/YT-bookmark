import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports.js';

Amplify.configure(awsconfig);

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

async function populateBookmarks() {
  const userId = await getUserId();
  const filter = { userID: { eq: userId } };
  console.log('populateBookmarks() function called'); // Add this line
  let allBookmarks = await DataStore.query(Bookmark);
  console.log('All bookmarks:', allBookmarks);
  let userBookmarks = allBookmarks.filter(bookmark => bookmark.userID === userId.toString());
  let bookmarksList = document.getElementById('bookmarksList');
  bookmarksList.innerHTML = ''; // Clear previous bookmarks
  userBookmarks.forEach(function(bookmark, index) {
    let timeString = secondsToHMS(bookmark.timestamp);
    let thumbnailUrl = bookmark.thumbnail;
    let displayThumbnailUrl = `${thumbnailUrl}`;
    let li = document.createElement('li');
    console.log('Thumbnail URL:', thumbnailUrl);
    li.innerHTML = `<div class="bookmark-details">
                      <div class="thumbnail-container">
                        <img src="${displayThumbnailUrl}" class="thumbnail">
                      </div>
                      <div class="text-container">
                        <h2><a href="${bookmark.url}?t=${timeString}" target="_blank">${index + 1}. ${bookmark.title}</a></h2>
                        <p>${timeString}</p>
                        <button class="delete-button" data-index="${index}">Delete</button>
                      </div>
                    </div>`;
    bookmarksList.appendChild(li);
  });

  // Add event listeners to the delete buttons
  document.querySelectorAll('.delete-button').forEach(function(button) {
    button.addEventListener('click', function() {
      deleteBookmark(bookmarks[this.getAttribute('data-index')]);
    });
  });
}

async function deleteBookmark(bookmark) {
  // Ask the user for confirmation
  const isConfirmed = window.confirm("Are you sure you want to delete this bookmark?");
  
  // If the user clicks "OK", proceed with the deletion
  if (isConfirmed) {
    await DataStore.delete(bookmark); // Clear local cache
    populateBookmarks(); // Refresh the bookmarks list
  }
}

populateBookmarks(); // Call the function to populate the bookmarks when the page loads

