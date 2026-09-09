const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'app', 'shop', '[id]', 'page.tsx');
const buffer = fs.readFileSync(filePath);
let invalidCount = 0;
for(let i = 0; i < buffer.length; i++) {
    if (buffer[i] > 127) {
        // Just a rough check to see how many non-ascii bytes there are
        invalidCount++;
    }
}
console.log("Non-ASCII bytes:", invalidCount);
