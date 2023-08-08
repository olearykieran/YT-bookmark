console.log('Content script is running!');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'bookmarkVideo') {
    let video = document.querySelector('video');
    let title = document.querySelector('meta[name="title"]').content; // Getting the video title
    if (video) {
      sendResponse({
        url: window.location.href,
        time: video.currentTime,
        title: title // Including the title in the response
      });
    } else {
      console.error("No video element found");
    }
    return true;
  }
});