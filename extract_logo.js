const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\abhay\\.gemini\\antigravity\\brain\\a03b1e8a-f2fc-4876-b5e7-12a38d2eaa8d\\.system_generated\\steps\\8041\\content.md', 'utf8');
const matches = content.match(/<img[^>]*src=["']([^"']*(logo|Logo)[^"']*)["'][^>]*>/gi);
console.log(matches ? matches.slice(0, 5) : 'NOT FOUND');
