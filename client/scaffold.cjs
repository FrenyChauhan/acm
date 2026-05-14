const fs = require('fs');
const path = require('path');

const dirs = [
  'src/assets/fonts',
  'src/assets/images',
  'src/components/common',
  'src/components/home',
  'src/components/events',
  'src/components/blogs',
  'src/components/projects',
  'src/components/team',
  'src/components/achievements',
  'src/pages',
  'src/hooks',
  'src/context',
  'src/services',
  'src/utils',
  'src/styles/pages'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

const globalsCss = `:root {
  /* Backgrounds */
  --bg-primary:    #050A14;
  --bg-secondary:  #0A1628;
  --bg-card:       rgba(13, 31, 60, 0.6);
  --bg-glass:      rgba(255, 255, 255, 0.03);

  /* Accents */
  --accent-blue:   #0066FF;
  --accent-cyan:   #00D4FF;
  --accent-purple: #6C47FF;
  --accent-glow:   rgba(0, 102, 255, 0.2);
  --cyan-glow:     rgba(0, 212, 255, 0.15);

  /* Text */
  --text-primary:  #F0F4FF;
  --text-muted:    #8899BB;
  --text-dim:      #4A5A7A;

  /* Borders */
  --border-subtle: rgba(0, 212, 255, 0.1);
  --border-card:   rgba(0, 212, 255, 0.15);
  --border-hover:  rgba(0, 102, 255, 0.5);

  /* Fonts */
  --font-heading:  'Space Grotesk', sans-serif;
  --font-body:     'Inter', sans-serif;

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-med:  0.4s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.7s cubic-bezier(0.4, 0, 0.2, 1);

  /* Radius */
  --radius-sm:  8px;
  --radius-md:  12px;
  --radius-lg:  20px;
  --radius-xl:  32px;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-body);
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  margin: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, #00D4FF 0%, #0066FF 50%, #6C47FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glassmorphism card utility */
.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  transition: border-color var(--transition-med),
              transform var(--transition-med),
              box-shadow var(--transition-med);
}
.glass-card:hover {
  border-color: var(--border-hover);
  box-shadow: 0 0 30px var(--accent-glow), 0 20px 40px rgba(0,0,0,0.4);
  transform: translateY(-4px);
}

/* Dot grid background */
.dot-grid {
  background-image: radial-gradient(circle, rgba(0,212,255,0.08) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: var(--accent-blue); border-radius: 3px; }

/* prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`;

fs.writeFileSync(path.join(__dirname, 'src/styles/globals.css'), globalsCss);
fs.writeFileSync(path.join(__dirname, 'src/styles/animations.css'), '');
fs.writeFileSync(path.join(__dirname, 'src/styles/components.css'), '');

const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/globals.css';
import './styles/animations.css';
import './styles/components.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

fs.writeFileSync(path.join(__dirname, 'src/main.jsx'), mainJsx);
console.log('Client structure scaffolded.');
