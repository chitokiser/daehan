/**
 * scripts/audit-mobile.js
 * 대한김치 웹 프로젝트 모바일 최적화 자동 진단 하네스 (Mobile Layout Audit Harness)
 */

const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, '..', 'src', 'app'),
    path.join(__dirname, '..', 'src', 'components')
];

let issuesFound = 0;
let filesScanned = 0;

function getAllFiles(dirPath, arrayOfFiles = []) {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.tsx') || file.endsWith('.css')) {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

console.log("\n=======================================================");
console.log("📱 대한김치 모바일 최적화 하네스 (Mobile Audit Harness)");
console.log("=======================================================\n");

targetDirs.forEach(dir => {
    const files = getAllFiles(dir);
    files.forEach(filePath => {
        filesScanned++;
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(path.join(__dirname, '..'), filePath);
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            const lineNum = index + 1;

            // Check 1: <br /> or <br> without desktopBr in TSX files
            if (filePath.endsWith('.tsx')) {
                if (/<br\s*\/?>/i.test(line) && !line.includes('desktopBr') && !line.includes('desktop-br')) {
                    console.log(`⚠️  [위험] 하드코딩된 <br> 태그 (모바일 어색한 끊김 우려)`);
                    console.log(`    📁 ${relativePath}:${lineNum}`);
                    console.log(`    💬 ${line.trim()}\n`);
                    issuesFound++;
                }
            }

            // Check 2: Fixed pixel widths > 320px in CSS files (excluding decorative pseudo elements like ::before / ::after)
            if (filePath.endsWith('.css')) {
                const isPseudoDecoration = line.includes('before') || line.includes('after') || (index > 0 && (lines[index-1].includes('before') || lines[index-1].includes('after')));
                if (!isPseudoDecoration) {
                    const fixedWidthMatch = line.match(/width:\s*([3-9]\d{2}|\d{4,})px/);
                    if (fixedWidthMatch && !line.includes('max-width') && !line.includes('min-width')) {
                        console.log(`⚠️  [경고] 고정 크기 width (${fixedWidthMatch[1]}px) 사용 (모바일 잘림 우려)`);
                        console.log(`    📁 ${relativePath}:${lineNum}`);
                        console.log(`    💬 ${line.trim()}\n`);
                        issuesFound++;
                    }
                }

                // Check 3: Font size > 2.0rem without responsive media query nearby
                const fontSizeMatch = line.match(/font-size:\s*([2-9]\.\d+)rem/);
                if (fontSizeMatch && parseFloat(fontSizeMatch[1]) >= 2.0) {
                    if (!content.includes('@media') && !content.includes('clamp')) {
                        console.log(`⚠️  [주의] 비대한 폰트 크기 (${fontSizeMatch[1]}rem) (모바일 미디어쿼리 검토 필요)`);
                        console.log(`    📁 ${relativePath}:${lineNum}`);
                        console.log(`    💬 ${line.trim()}\n`);
                        issuesFound++;
                    }
                }
            }
        });
    });
});

console.log("=======================================================");
console.log(`📊 진단 결과: 총 ${filesScanned}개 파일 검사 완료`);
if (issuesFound === 0) {
    console.log("✨ 축하합니다! 모바일 최적화 규칙 위반 항목이 없습니다 (100% 안전).");
} else {
    console.log(`🚨 총 ${issuesFound}개의 모바일 레이아웃 주의 항목이 발견되었습니다.`);
    console.log("👉 .agents/rules/mobile_harness.md 규칙에 따라 수정하세요.");
}
console.log("=======================================================\n");
