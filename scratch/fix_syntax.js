const fs = require('fs');
let c = fs.readFileSync('src/app/shop/[id]/page.tsx', 'utf8');
c = c.replace(/date: .\uFFFD\uFFFD\uFFFD \?\?,/g, 'date: "방금 전",');
c = c.replace(/title=".\uFFFD\uFFFD\uFFFD\?/g, 'title="찜하기"');
c = c.replace(/김\?\/span>/g, '김치</span>');

// Specifically replacing the exact buggy strings
c = c.replace('date: "방금 ??,', 'date: "방금 전",');
c = c.replace('title="찜하?', 'title="찜하기"');
c = c.replace('김?/span>', '김치</span>');

fs.writeFileSync('src/app/shop/[id]/page.tsx', c, 'utf8');
