const fs = require('fs');

function getAllFiles(dirPath, arrayOfFiles) {
  let entries = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  entries.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(dirPath + "/" + file);
    }
  });
  return arrayOfFiles;
}

const files = getAllFiles('src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

let updatedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Phone replacements
  newContent = newContent.replace(/\+1-800-MARKETHOM/g, '+91 8824896910');
  newContent = newContent.replace(/\+1800MARKETHOM/g, '+918824896910'); // for tel: hrefs
  newContent = newContent.replace(/\+1 \(800\) MARKET-HOM/g, '+91 8824896910');

  // Address replacements
  newContent = newContent.replace(/\[sangria jaipur, rajasthan\]/gi, '[BUSINESS ADDRESS]');

  // Refund Time replacements
  newContent = newContent.replace(/\[15-20 working days\]/gi, '20 days');
  newContent = newContent.replace(/\[REFUND_PERIOD\]/gi, '20 days');
  newContent = newContent.replace(/\[REFUND_PROCESSING_TIME\]/gi, '20 days');

  // Facebook replacements
  newContent = newContent.replace(/https:\/\/facebook\.com\/markethom/gi, 'https://www.facebook.com/profile.php?id=100069292151996');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    updatedFiles++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Updated ${updatedFiles} files.`);
