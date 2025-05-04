const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const journeyDir = path.join(__dirname);

const files = fs.readdirSync(journeyDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(journeyDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  const parsed = matter(content);

  // Skip files that already have frontmatter
  if (parsed.data && parsed.data.title) {
    console.log(`✅ Skipped (already has title): ${file}`);
    return;
  }

  // Turn filename into Title Case
  const baseName = path.basename(file, path.extname(file));
  const title = baseName
    .replace(/^journey_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());

  const updated = matter.stringify(parsed.content, {
    title: title,
    tags: [],
    veil: false
  });

  fs.writeFileSync(filePath, updated);
  console.log(`🌟 Added frontmatter to: ${file}`);
});

console.log('📝 ALL JOURNEYS BLESSED WITH METADATA ✨');
