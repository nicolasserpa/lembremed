const fs = require('fs');
const opentype = require('opentype.js');
const buffer = fs.readFileSync('quicksand.ttf');
const font = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));

const lembrePath = font.getPath('lembre', 5, 27, 25);
const mePath = font.getPath('me', 84.30, 27, 25);
const dPath = font.getPath('d', 120.93, 27, 25);

console.log('=== PATH FOR "lembre" (Blue) ===');
console.log(lembrePath.toPathData(2));

console.log('\n=== PATH FOR "me" (Cyan) ===');
console.log(mePath.toPathData(2));

console.log('\n=== PATH FOR "d" (Cyan) ===');
console.log(dPath.toPathData(2));
