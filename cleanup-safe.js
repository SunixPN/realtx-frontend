const fs = require('fs');
const path = require('path');

const srcDir = 'D:/development/realtx-frontend/src';

function getAllFiles(dir) {
    let results = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);

        if (stat.isDirectory()) {
            results = results.concat(getAllFiles(filepath));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(filepath);
        }
    }
    return results;
}

function removeCommentsOnly(content) {
    const lines = content.split('\n');
    const result = [];
    let inMultilineComment = false;
    let removedCount = 0;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (inMultilineComment) {
            if (line.includes('*/')) {
                const afterComment = line.substring(line.indexOf('*/') + 2);
                line = afterComment;
                inMultilineComment = false;
                removedCount++;
            } else {
                removedCount++;
                continue;
            }
        }

        if (line.includes('/*') && !inMultilineComment) {
            const beforeComment = line.substring(0, line.indexOf('/*'));
            const inString = (beforeComment.split('"').length - 1) % 2 === 1 ||
                           (beforeComment.split("'").length - 1) % 2 === 1 ||
                           (beforeComment.split('`').length - 1) % 2 === 1;

            if (!inString) {
                if (line.includes('*/')) {
                    const afterComment = line.substring(line.indexOf('*/') + 2);
                    line = beforeComment + afterComment;
                    removedCount++;
                } else {
                    line = beforeComment;
                    inMultilineComment = true;
                    removedCount++;
                }
            }
        }

        if (line.includes('//') && !inMultilineComment) {
            const beforeComment = line.substring(0, line.indexOf('//'));
            const inString = (beforeComment.split('"').length - 1) % 2 === 1 ||
                           (beforeComment.split("'").length - 1) % 2 === 1 ||
                           (beforeComment.split('`').length - 1) % 2 === 1;

            if (!inString && !line.trim().startsWith('http') && !line.trim().startsWith('https')) {
                line = beforeComment;
                removedCount++;
            }
        }

        const trimmed = line.trim();
        if (trimmed || line === '') {
            result.push(line);
        }
    }

    let final = result.join('\n');
    final = final.replace(/\n\s*\n\s*\n+/g, '\n\n');

    return { content: final, removedCount };
}

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    const result = removeCommentsOnly(content);
    content = result.content;

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        return { removedComments: result.removedCount };
    }

    return null;
}

const files = getAllFiles(srcDir);
console.log('Found ' + files.length + ' TypeScript/TSX files');

let totalRemovedComments = 0;
let filesModified = 0;
const modifiedList = [];

for (const file of files) {
    const result = cleanFile(file);
    if (result && result.removedComments > 0) {
        filesModified++;
        totalRemovedComments += result.removedComments;
        const shortPath = file.replace('D:/development/realtx-frontend/src/', '');
        modifiedList.push(shortPath + ': ' + result.removedComments + ' comments');
    }
}

console.log('');
console.log('=== RESULTS ===');
modifiedList.forEach(m => console.log(m));
console.log('');
console.log('Files modified: ' + filesModified);
console.log('Total comments removed: ' + totalRemovedComments);
