const fs = require('fs');
const buffer = fs.readFileSync('quicksand-bold.ttf');
console.log('File size:', buffer.length);
console.log('First 20 bytes in hex:', buffer.slice(0, 20).toString('hex'));
console.log('First 20 bytes in text:', buffer.slice(0, 20).toString('utf8'));
