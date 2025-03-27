const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets', 'images');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log(`Created directory: ${assetsDir}`);
}

// Create placeholder files
const placeholderFiles = [
  'logo.png',
  'profile-placeholder.png',
  'stadium1.png',
  'stadium2.png',
  'stadium3.png',
  'stadium4.png',
  'icon.png',
  'adaptive-icon.png',
  'favicon.png',
  'splash-icon.png'
];

placeholderFiles.forEach(file => {
  const filePath = path.join(assetsDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
    console.log(`Created placeholder file: ${filePath}`);
  }
});

console.log('Placeholder image files created successfully!');