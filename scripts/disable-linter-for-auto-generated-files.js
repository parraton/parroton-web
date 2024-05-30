const fs = require('fs');
const path = require('path');

const generatedFiles = [
  'src/routes/index.ts'
];

const eslintConfigPath = path.resolve(__dirname, '..');

generatedFiles.forEach((file) => {
  const filePath = path.resolve(eslintConfigPath, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  if (fileContent.includes('eslint-disable')) {
    console.log(`File already contains eslint-disable: ${filePath}`);
    return;
  }

  fs.writeFileSync(filePath, `/* eslint-disable */\n${fileContent}`);
  console.log(`eslint-disable added to: ${filePath}`);
});