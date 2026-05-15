require('dotenv').config();
const mongoose = require('mongoose');
const TeamMember = require('./models/TeamMember');

const FACULTY_PHOTOS = [
  {
    name: 'Dr. Sankita Patel',
    photo: {
      url: 'https://res.cloudinary.com/dgt5pjsvc/image/upload/v1778832799/acm_team_2025/sankita-patel.png',
      cloudinaryId: 'acm_team_2025/sankita-patel',
    },
  },
  {
    name: 'Dr. Balu Parne',
    photo: {
      url: 'https://res.cloudinary.com/dgt5pjsvc/image/upload/v1778832800/acm_team_2025/balu-parne.jpg',
      cloudinaryId: 'acm_team_2025/balu-parne',
    },
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  for (const { name, photo } of FACULTY_PHOTOS) {
    const result = await TeamMember.findOneAndUpdate(
      { name, isFaculty: true },
      { $set: { photo } },
      { new: true }
    );
    if (result) {
      console.log(`✓ Updated photo for ${result.name} → ${photo.url}`);
    } else {
      console.warn(`✗ No faculty member found with name: ${name}`);
    }
  }

  await mongoose.connection.close();
  console.log('Done.');
};

run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
