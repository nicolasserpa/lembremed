const fs = require('fs');
const opentype = require('opentype.js');
const buffer = fs.readFileSync('quicksand-bold.ttf');
const font = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));

console.log('Units Per Em:', font.unitsPerEm);
console.log('Names Table:', JSON.stringify(font.names, null, 2));
