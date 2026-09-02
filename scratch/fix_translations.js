import fs from 'fs';

const filePath = 'moexpress/src/data/translations.js';
let c = fs.readFileSync(filePath, 'utf-8');

// The issue was I inserted AFTER `},` instead of BEFORE it.
// Let's manually fix it by just finding `// Seller Center` and moving the `},`

// Let's just find the blocks and fix them.
// We have:
//   },
//     // Seller Center ...
//     page_in_construction_desc: "This feature will be available soon.",
//   fr: {

c = c.replace(/  \},\r?\n    \/\/ Seller Center/g, '    // Seller Center');
c = c.replace(/page_in_construction_desc: "This feature will be available soon.",\r?\n  fr: \{/g, 'page_in_construction_desc: "This feature will be available soon.",\n  },\n  fr: {');
c = c.replace(/page_in_construction_desc: "Cette fonctionnalité sera bientôt disponible.",\r?\n  ar: \{/g, 'page_in_construction_desc: "Cette fonctionnalité sera bientôt disponible.",\n  },\n  ar: {');

fs.writeFileSync(filePath, c);
console.log('Fixed');
