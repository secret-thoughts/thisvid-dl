# Download Extension for ThisVid

## Installing

This extension is not eligible for inclusion in the Chrome Extension store, so it must be installed manually.

First clone this repository, or download a release.

First, go to `chrome://extensions` and enable **Developer Mode**. Then click on `Load Unpacked`. Enter the directory containing the js and json files and press Open.

## Using

Visit a ThisVid video and hit the play button. A download button should appear. Click it. Once it is done, your browser should show you that the file was downloaded.

For various reasons, the extension cannot show a progress bar in the browser's download tab. This is a known issue.

**Known bug**: Many videos have an ad that plays before the main video. The Download button will download this ad and it will not be playable. You will need to watch the ad and then click the Continue button to get to the main video. Unfortunately, the Download button still will not work. Refresh the page until you no longer need to watch an ad to view the video. Then click the Download button to download the actual video.

## Future Work

1. Trying to integrate with the Downloads tab in Chrome.
2. Fix the ad issue.
3. Allow the user to choose the format of the filename. Currently defaults to the ThisVid ID of the video. User could use the name of the video, or the author and the name combined.
