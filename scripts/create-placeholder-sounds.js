const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const ambientDir = path.join(__dirname, '..', 'public', 'sounds', 'ambient');
if (!fs.existsSync(ambientDir)) {
  fs.mkdirSync(ambientDir, { recursive: true });
}

// Create placeholder files with instructions
const soundFiles = [
  'rain.mp3',
  'forest.mp3',
  'cafe.mp3',
  'waves.mp3',
  'whitenoise.mp3'
];

// Create a placeholder HTML file that explains how to get the sound files
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ambient Sound Files</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .sound-list {
      list-style: none;
      padding: 0;
    }
    .sound-list li {
      margin-bottom: 20px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .sound-list h3 {
      margin-top: 0;
    }
    .btn {
      display: inline-block;
      background-color: #4CAF50;
      color: white;
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 4px;
      cursor: pointer;
      border: none;
    }
    .btn:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <h1>Ambient Sound Files for Focus Mode</h1>
  
  <p>The Focus Mode feature requires ambient sound files to function properly. You need to place the following MP3 files in the <code>public/sounds/ambient</code> directory:</p>
  
  <ul class="sound-list">
    <li>
      <h3>rain.mp3</h3>
      <p>Rainfall sounds</p>
      <a href="https://pixabay.com/sound-effects/rain-and-thunder-16705/" class="btn" target="_blank">Download from Pixabay</a>
    </li>
    <li>
      <h3>forest.mp3</h3>
      <p>Forest ambience</p>
      <a href="https://pixabay.com/sound-effects/forest-with-small-river-birds-and-nature-field-recording-6735/" class="btn" target="_blank">Download from Pixabay</a>
    </li>
    <li>
      <h3>cafe.mp3</h3>
      <p>Café background noise</p>
      <a href="https://pixabay.com/sound-effects/coffee-shop-ambience-6362/" class="btn" target="_blank">Download from Pixabay</a>
    </li>
    <li>
      <h3>waves.mp3</h3>
      <p>Ocean waves</p>
      <a href="https://pixabay.com/sound-effects/ocean-waves-112514/" class="btn" target="_blank">Download from Pixabay</a>
    </li>
    <li>
      <h3>whitenoise.mp3</h3>
      <p>White noise</p>
      <a href="https://pixabay.com/sound-effects/white-noise-10-minutes-22830/" class="btn" target="_blank">Download from Pixabay</a>
    </li>
  </ul>
  
  <h2>Instructions</h2>
  <ol>
    <li>Click on each link above to download the sound files from Pixabay</li>
    <li>Rename the downloaded files to match the required filenames (rain.mp3, forest.mp3, etc.)</li>
    <li>Place the renamed files in the <code>public/sounds/ambient</code> directory</li>
    <li>Restart your development server if it's running</li>
  </ol>
  
  <p><strong>Note:</strong> All sound files from Pixabay are free to use for commercial and non-commercial purposes.</p>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync(path.join(__dirname, '..', 'public', 'ambient-sounds-setup.html'), htmlContent);
console.log('Created ambient-sounds-setup.html with download instructions');

// Create empty placeholder files
soundFiles.forEach(filename => {
  const filePath = path.join(ambientDir, filename);
  if (!fs.existsSync(filePath)) {
    // Create an empty file
    fs.writeFileSync(filePath, '');
    console.log(`Created empty placeholder for ${filename}`);
  }
});

console.log('\nPlaceholder files created successfully!');
console.log('\nIMPORTANT: These are empty placeholder files and will not play any sound.');
console.log('To get the actual sound files, open public/ambient-sounds-setup.html in your browser and follow the instructions.'); 