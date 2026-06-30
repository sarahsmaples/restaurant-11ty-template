const { generate } = require('critical');
const path = require('path');
const fs = require('fs');

const distDir = path.join(__dirname, '..', 'dist');

// Normalize PATH_PREFIX: strip leading/trailing slashes
// e.g. "/nittis/" → "nittis", "" → ""
const prefix = (process.env.PATH_PREFIX || '').replace(/^\/+|\/+$/g, '');

function getHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    // Don't recurse into symlinks (our temp prefix symlink)
    if (entry.isDirectory()) results.push(...getHtmlFiles(full));
    else if (entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

async function run() {
  if (prefix) {
    console.log('Skipping critical CSS for preview build (PATH_PREFIX set).');
    return;
  }

  const files = getHtmlFiles(distDir);
  console.log(`Processing ${files.length} HTML files for critical CSS...`);

  for (const file of files) {
    const rel = path.relative(distDir, file);
    process.stdout.write(`  ${rel} ... `);
    try {
      await generate({
        base: distDir,
        src: rel,
        target: rel,
        inline: true,
        dimensions: [
          { width: 375, height: 812 },
          { width: 1300, height: 900 },
        ],
        ignore: {
          atrule: ['@font-face'],
          decl: (_node, value) => /url\(/.test(value),
        },
      });
      console.log('done');
    } catch (err) {
      console.log(`skipped (${err.message})`);
    }
  }

  console.log('Critical CSS complete.');
}

run().catch(console.error);
