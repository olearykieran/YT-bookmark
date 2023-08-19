console.log('Content script is running!');

import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports.js';

Amplify.configure(awsconfig);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'bookmarkVideo') {
    let video = document.querySelector('video');
    let title = document.title; // Getting the title directly from the page
    console.log('Title:', title);
    const url = new URL(window.location.href);
    let videoId = url.searchParams.get('v');
    console.log('Video ID:', videoId); // Log the video ID
    
    let thumbnailUrl = ''; // Define the variable outside the if block

    if (videoId) {
      thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
      console.log('thumbnailUrl:', thumbnailUrl); 
    }

    if (video) {
      sendResponse({
        url: window.location.href,
        time: video.currentTime,
        title: title,
        thumbnail: thumbnailUrl
      });
    } else {
      console.error("No video element found");
    }
    return true; // Indicate that we will respond asynchronously
  }
});




/*
async function deleteAllBookmarks() {
  const bookmarks = await DataStore.query(Bookmark);
  bookmarks.forEach(async (bookmark) => {
    await DataStore.delete(bookmark);
  });
  console.log('All bookmarks deleted.');
}

// Call the function to delete all bookmarks
deleteAllBookmarks(); */