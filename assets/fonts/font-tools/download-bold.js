const fs = require('fs');
const https = require('https');

const url = 'https://cdn.jsdelivr.net/npm/@fontsource/quicksand/files/quicksand-latin-700-normal.ttf';
const file = fs.createWriteStream('quicksand-bold.ttf');

function download(downloadUrl) {
  console.log('Downloading from jsDelivr:', downloadUrl);
  https.get(downloadUrl, function(response) {
    if (response.statusCode === 302 || response.statusCode === 301) {
      download(response.headers.location);
    } else if (response.statusCode === 200) {
      response.pipe(file);
      file.on('finish', function() {
        file.close();
        console.log('Download complete!');
      });
    } else {
      console.error('Failed to download, status code:', response.statusCode);
      fs.unlink('quicksand-bold.ttf', () => {});
    }
  }).on('error', function(err) {
    fs.unlink('quicksand-bold.ttf', () => {});
    console.error('Error downloading:', err.message);
  });
}

download(url);
