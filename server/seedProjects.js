require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const projects = [
  {
    name: 'ACM NIT Surat Website',
    slug: 'acm-nit-surat-website',
    number: '01',
    description: 'The official web presence for the ACM NIT Surat student chapter — completely revamped by the 2023–24 core team. A sleek, animated hub for upcoming events, ongoing projects, blogs, and chapter resources. Built with a performance-first mindset and a cinematic UI.',
    techStack: ['HTML / CSS / JS', 'GSAP', 'Vercel', 'Web'],
    liveUrl: 'https://acm-website.vercel.app/',
    githubUrl: '#',
    featured: true,
    status: 'Active',
    year: 2024
  },
  {
    name: 'ButterFlask-UI',
    slug: 'butterflask-ui',
    number: '02',
    description: 'A modern, lightweight Python framework for building responsive web UIs using a Flutter-inspired widget model. Abstracts away the pain of API handling with AJAX, and lets developers compose elegant interfaces from reusable widgets — dramatically reducing boilerplate.',
    longDesc: 'Widget-based composition — write less, ship more. Effortless AJAX request handling on the frontend. Plug-in to Flask or Django projects with zero friction.',
    techStack: ['Python', 'Flask', 'AJAX', 'Framework'],
    githubUrl: 'https://github.com/Shubhgajj2004/ButterFlaskUI',
    featured: false,
    status: 'Active',
    year: 2023
  }
];

const seedProjects = async () => {
  await connectDB();
  try {
    await Project.deleteMany();
    await Project.insertMany(projects);
    console.log('Projects Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedProjects();
