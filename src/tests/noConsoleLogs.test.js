import fs from 'fs';
import path from 'path';

// Directories to scan for production code
const TARGET_DIRS = [
  path.resolve(__dirname, '..', 'components'),
  path.resolve(__dirname, '..', 'pages'),
  path.resolve(__dirname, '..', 'services'),
  path.resolve(__dirname, '..', 'utils'),
];

// Files to ignore (allowed to contain console examples or logger implementation)
const IGNORE_FILES = new Set([
  path.resolve(__dirname, '..', 'components', 'ContentBlocks', 'SandboxBlock.js'),
  path.resolve(__dirname, '..', 'components', 'admin', 'builder', 'TemplateManager.js'),
  path.resolve(__dirname, '..', 'components', 'admin', 'AIFeaturesPanel.js'),
  path.resolve(__dirname, '..', 'services', 'smartHintService.js'),
  path.resolve(__dirname, '..', 'utils', 'logger.js'),
]);

function listJsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listJsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

function stripStringsAndComments(code) {
  // Remove template literals (no nested backticks handling)
  let stripped = code.replace(/`[\s\S]*?`/g, '');
  // Remove block comments
  stripped = stripped.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove line comments
  stripped = stripped.replace(/(^|\s)\/\/.*$/gm, '');
  // Remove single-quoted strings
  stripped = stripped.replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, '');
  // Remove double-quoted strings
  stripped = stripped.replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, '');
  return stripped;
}

describe('No console.log in production code', () => {
  test('scans source files and fails on direct console.log usage', () => {
    const offending = [];
    for (const dir of TARGET_DIRS) {
      const files = listJsFiles(dir);
      for (const file of files) {
        if (IGNORE_FILES.has(file)) continue;
        // Ignore tests
        if (file.includes(`${path.sep}tests${path.sep}`)) continue;
        const content = fs.readFileSync(file, 'utf8');
        const stripped = stripStringsAndComments(content);
        if (/console\s*\.\s*log\s*\(/.test(stripped)) {
          offending.push(file);
        }
      }
    }
    if (offending.length > 0) {
      throw new Error(`Found console.log in production files:\n${offending.join('\n')}`);
    }
  });
});


