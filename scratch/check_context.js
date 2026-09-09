const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'app', 'shop', '[id]', 'page.tsx');
const buffer = fs.readFileSync(filePath);
let index = 1710;
let slice = buffer.slice(index - 20, index + 20);
console.log(slice.toString('utf8'));
