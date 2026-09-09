const fs = require('fs');
let c = fs.readFileSync('src/app/shop/[id]/page.tsx', 'utf8');

c = c.replace(/title="찜하[^\x00-\x7F]*\r?\n/g, 'title="찜하기"\n');
c = c.replace(/date: "방금 [^\x00-\x7F]*\r?\n/g, 'date: "방금 전",\n');
c = c.replace(/김[^\x00-\x7F]*\/span>/g, '김치</span>');

fs.writeFileSync('src/app/shop/[id]/page.tsx', c, 'utf8');
