console.log('Content script is running!');

import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports.js';

Amplify.configure(awsconfig);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'bookmarkVideo') {
    let video = document.querySelector('video');
    let title = document.title; // Getting the title directly from the page
    if (video) {
      sendResponse({
        url: window.location.href,
        time: video.currentTime,
        title: title
      });
    } else {
      console.error("No video element found");
    }
    return true; // Indicate that we will respond asynchronously
  }
});