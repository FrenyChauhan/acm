const fs = require('fs');
const path = require('path');

const pages = [
  'Home', 'Events', 'EventDetail', 'Projects', 'Blogs', 'BlogDetail', 'Team', 'Achievements', 'Contact', 'NotFound'
];

pages.forEach(page => {
  const content = `import React from 'react';\n\nexport default function ${page}() {\n  return <div>${page} Page</div>;\n}\n`;
  fs.writeFileSync(path.join(__dirname, 'src/pages', `${page}.jsx`), content);
});

const components = [
  'Navbar', 'Footer', 'CustomCursor', 'PageTransition', 'ScrollToTop'
];

components.forEach(comp => {
  const content = `import React from 'react';\n\nexport default function ${comp}({ children }) {\n  return <>{children}</>;\n}\n`;
  fs.writeFileSync(path.join(__dirname, 'src/components/common', `${comp}.jsx`), content);
});

console.log('Pages and common components scaffolded.');
