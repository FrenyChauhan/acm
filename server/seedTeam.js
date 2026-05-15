require('dotenv').config();
const mongoose = require('mongoose');
const TeamMember = require('./models/TeamMember');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const members = [
  // Faculty
  { name: 'Dr. Sankita Patel', role: 'Faculty Chairperson', department: 'Department of Computer Science & Engineering · NIT Surat', category: 'faculty', isFaculty: true, year: '2025' },
  { name: 'Dr. Balu Parne', role: 'Faculty Co-Chairperson', department: 'Department of Computer Science & Engineering · NIT Surat', category: 'faculty', isFaculty: true, year: '2025' },

  // Leadership
  { name: 'Smit Marakna', role: 'Chairperson', category: 'leadership', email: 'smitmarakna1709@gmail.com', linkedin: 'https://www.linkedin.com/in/smit-marakna-185456291', github: 'https://github.com/smitmarakna/', year: '2025' },
  { name: 'Chetan Kalsariya', role: 'Vice-Chairperson', category: 'leadership', linkedin: 'https://www.linkedin.com/in/chetan-kalsariya', github: 'https://github.com/lost-alchemist', year: '2025' },
  { name: 'Jay Pipaliya', role: 'Secretary', category: 'leadership', email: 'jaypipaliya0101@gmail.com', linkedin: 'https://www.linkedin.com/in/jay-pipaliya-117369326', github: 'https://github.com/jayp927', year: '2025' },
  { name: 'Archit Savaliya', role: 'Secretary', category: 'leadership', email: 'architsavaliya175@gmail.com', linkedin: 'https://www.linkedin.com/in/architsavaliya', github: 'https://github.com/Archit-175', year: '2025' },
  { name: 'Dhruv Patel', role: 'Treasurer', category: 'leadership', email: 'dhruvap2005@gmail.com', linkedin: 'https://www.linkedin.com/in/dhruv-patel-15a9082a9/', github: 'https://github.com/Cosmic717', year: '2025' },
  { name: 'Anand Tiwari', role: 'Treasurer', category: 'leadership', email: 'anandgtiwari2005@gmail.com', linkedin: 'https://www.linkedin.com/in/anand-tiwari-271078235/', github: 'https://github.com/Anand-Tiwari2404', year: '2025' },

  // Others
  { name: 'Foram Gandhi', role: 'Community Head', category: 'core', email: 'gandhiforam91@gmail.com', linkedin: 'https://www.linkedin.com/in/foram-gandhi-85a045326', year: '2025' },
  { name: 'Miten Gandhi', role: 'Developer', category: 'developer', email: 'mjgandhi2305@gmail.com', linkedin: 'https://www.linkedin.com/in/miten-j-gandhi', github: 'https://github.com/mjgandhi2305', year: '2025' },
  { name: 'Purv Kabaria', role: 'Developer', category: 'developer', twitter: 'https://x.com/purvdev', email: 'purvkabaria@gmail.com', linkedin: 'https://www.linkedin.com/in/purv-kabaria/', github: 'https://github.com/Purv-Kabaria', year: '2025' },
  { name: 'Om Satodiya', role: 'Developer', category: 'developer', email: 'omsatodiya96@gmail.com', linkedin: 'https://www.linkedin.com/in/om-satodiya9609', github: 'https://github.com/omsatodiya', year: '2025' },
  { name: 'Vanshik Godeshwar', role: 'Problem Setter', category: 'problem-setter', email: 'vanshikgodeshwar@gmail.com', linkedin: 'https://www.linkedin.com/in/vanshikgodeshwar/', github: 'https://github.com/vanshik79godeshwar', year: '2025' },
  { name: 'Deepak Challa', role: 'Problem Setter', category: 'problem-setter', email: 'challadeepaksai55@gmail.com', linkedin: 'https://www.linkedin.com/in/deepak-sai-challa-7a2240331', year: '2025' },
  { name: 'Anshul Reddy', role: 'Problem Setter', category: 'problem-setter', email: 'kanshulreddy93@gmail.com', linkedin: 'https://www.linkedin.com/in/anshul-reddy-kotha/', year: '2025' },
  { name: 'Angela Dutta', role: 'Designer', category: 'designer', email: 'duttaangela28@gmail.com', linkedin: 'https://www.linkedin.com/in/angela-dutta/', github: 'https://github.com/ang-dutta', year: '2025' },
  { name: 'Vanishka Karkera', role: 'Designer', category: 'designer', email: 'vanishka.sk@gmail.com', linkedin: 'https://www.linkedin.com/in/vanishka-k-853593287/', year: '2025' },
  { name: 'Harshil Andhariya', role: 'Core Member', category: 'core', email: 'harshilandhariya.2507@gmail.com', linkedin: 'https://www.linkedin.com/in/harshilpf2507', github: 'https://github.com/harshil-2507', year: '2025' },
  { name: 'Manthan Chauhan', role: 'Core Member', category: 'core', email: 'manthansvnit9868@gmail.com', linkedin: 'https://www.linkedin.com/in/manthan-chauhan-373a5a2a8/', year: '2025' },
  { name: 'Govind', role: 'Core Member', category: 'core', email: 'realgovindkrishna@gmail.com', linkedin: 'https://www.linkedin.com/in/govindkrishna2005', github: 'https://github.com/govind2005', year: '2025' }
];

const seedTeam = async () => {
  await connectDB();
  try {
    await TeamMember.deleteMany();
    await TeamMember.insertMany(members);
    console.log('Team Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedTeam();
