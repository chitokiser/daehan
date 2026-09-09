const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'app', 'shop', '[id]', 'page.tsx');
const buffer = fs.readFileSync(filePath);
let valid = true;
let i = 0;
while (i < buffer.length) {
    if (buffer[i] <= 0x7F) {
        i += 1;
    } else if ((buffer[i] & 0xE0) === 0xC0) {
        if (i + 1 < buffer.length && (buffer[i+1] & 0xC0) === 0x80) {
            i += 2;
        } else {
            console.log('Invalid 2-byte at index ' + i);
            valid = false;
            break;
        }
    } else if ((buffer[i] & 0xF0) === 0xE0) {
        if (i + 2 < buffer.length && (buffer[i+1] & 0xC0) === 0x80 && (buffer[i+2] & 0xC0) === 0x80) {
            i += 3;
        } else {
            console.log('Invalid 3-byte at index ' + i);
            valid = false;
            break;
        }
    } else if ((buffer[i] & 0xF8) === 0xF0) {
        if (i + 3 < buffer.length && (buffer[i+1] & 0xC0) === 0x80 && (buffer[i+2] & 0xC0) === 0x80 && (buffer[i+3] & 0xC0) === 0x80) {
            i += 4;
        } else {
            console.log('Invalid 4-byte at index ' + i);
            valid = false;
            break;
        }
    } else {
        console.log('Invalid byte at index ' + i);
        valid = false;
        break;
    }
}
console.log('Is valid UTF-8:', valid);
