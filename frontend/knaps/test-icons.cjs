const fs = require('fs');
const path = require('path');
const solidIcons = require('@fortawesome/free-solid-svg-icons');
const brandIcons = require('@fortawesome/free-brands-svg-icons');

const srcPath = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(srcPath).filter(f => f.endsWith('.jsx'));

let errorFound = false;

files.forEach(file => {
  const content = fs.readFileSync(path.join(srcPath, file), 'utf8');
  
  // Find solid imports
  const solidMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]@fortawesome\/free-solid-svg-icons['"]/);
  if (solidMatch) {
    const icons = solidMatch[1].split(',').map(i => i.trim()).filter(i => i);
    icons.forEach(icon => {
      if (!solidIcons[icon]) {
        console.log('MISSING SOLID ICON:', icon, 'in file', file);
        errorFound = true;
      }
    });
  }

  // Find brand imports
  const brandMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]@fortawesome\/free-brands-svg-icons['"]/);
  if (brandMatch) {
    const icons = brandMatch[1].split(',').map(i => i.trim()).filter(i => i);
    icons.forEach(icon => {
      if (!brandIcons[icon]) {
        console.log('MISSING BRAND ICON:', icon, 'in file', file);
        errorFound = true;
      }
    });
  }
});
console.log('Icon check complete. Found errors:', errorFound);
