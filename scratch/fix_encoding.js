const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'shop', '[id]', 'page.tsx');
const buffer = fs.readFileSync(filePath);

let fixedString = '';
let i = 0;
while (i < buffer.length) {
    // Try to decode as UTF-8
    let char = '';
    if (buffer[i] <= 0x7F) {
        char = String.fromCharCode(buffer[i]);
        i += 1;
    } else if ((buffer[i] & 0xE0) === 0xC0) {
        // 2-byte
        if (i + 1 < buffer.length && (buffer[i+1] & 0xC0) === 0x80) {
            char = Buffer.from([buffer[i], buffer[i+1]]).toString('utf8');
            i += 2;
        } else {
            console.log('Invalid 2-byte sequence at index ' + i);
            i += 1;
        }
    } else if ((buffer[i] & 0xF0) === 0xE0) {
        // 3-byte
        if (i + 2 < buffer.length && (buffer[i+1] & 0xC0) === 0x80 && (buffer[i+2] & 0xC0) === 0x80) {
            char = Buffer.from([buffer[i], buffer[i+1], buffer[i+2]]).toString('utf8');
            i += 3;
        } else {
            console.log('Invalid 3-byte sequence at index ' + i);
            i += 1;
        }
    } else if ((buffer[i] & 0xF8) === 0xF0) {
        // 4-byte
        if (i + 3 < buffer.length && (buffer[i+1] & 0xC0) === 0x80 && (buffer[i+2] & 0xC0) === 0x80 && (buffer[i+3] & 0xC0) === 0x80) {
            char = Buffer.from([buffer[i], buffer[i+1], buffer[i+2], buffer[i+3]]).toString('utf8');
            i += 4;
        } else {
            console.log('Invalid 4-byte sequence at index ' + i);
            i += 1;
        }
    } else {
        console.log('Invalid byte sequence at index ' + i + ' byte: ' + buffer[i].toString(16));
        i += 1;
    }
    fixedString += char;
}

fs.writeFileSync(filePath, fixedString, 'utf8');
console.log('Fixed encoding saved.');
