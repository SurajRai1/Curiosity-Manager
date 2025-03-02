const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directories if they don't exist
const ambientDir = path.join(__dirname, '..', 'public', 'sounds', 'ambient');
if (!fs.existsSync(ambientDir)) {
  fs.mkdirSync(ambientDir, { recursive: true });
}

// Free ambient sound URLs (all from Pixabay, which allows free use)
const soundUrls = {
  'rain.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1fb1d4e4c1.mp3?filename=rain-and-thunder-16705.mp3',
  'forest.mp3': 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_8a49069f5c.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3',
  'cafe.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/18/audio_1fb1d4e4c1.mp3?filename=coffee-shop-ambience-6362.mp3',
  'waves.mp3': 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_c9a4a1d53b.mp3?filename=ocean-waves-112514.mp3',
  'whitenoise.mp3': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d1a8d6dc0f.mp3?filename=white-noise-10-minutes-22830.mp3'
};

// Download function
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${destination}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(destination, () => {}); // Delete the file if there's an error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

// Download all sound files
async function downloadAllSounds() {
  console.log('Downloading ambient sound files...');
  
  for (const [filename, url] of Object.entries(soundUrls)) {
    const destination = path.join(ambientDir, filename);
    try {
      console.log(`Downloading ${filename}...`);
      await downloadFile(url, destination);
    } catch (error) {
      console.error(`Error downloading ${filename}:`, error.message);
    }
  }
  
  console.log('Download process completed!');
}

// Run the download
downloadAllSounds(); 