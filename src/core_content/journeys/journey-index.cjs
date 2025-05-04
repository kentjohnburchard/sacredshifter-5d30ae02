// journey-index.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const journeyDir = __dirname;


const files = fs.readdirSync(journeyDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

let output = '| Filename | Title | Tags | Veil Locked? |\n';
output += '|----------|-------|------|--------------|\n';

files.forEach(file => {
  const filePath = path.join(journeyDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContent);

  const title = data.title || 'Untitled';
  const tags = Array.isArray(data.tags) ? data.tags.join(', ') : '';
  const veil = data.veil ? '🔒 Yes' : 'No';

  output += `| ${file} | ${title} | ${tags} | ${veil} |\n`;
});

// Save it as JourneyIndex.md in the project root
fs.writeFileSync('JourneyIndex.md', output);
console.log('✅ JourneyIndex.md created successfully!');
