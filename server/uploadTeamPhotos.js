require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('./config/cloudinary');
const TeamMember = require('./models/TeamMember');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Mapping exact filenames from the public folder to the names in the database
const fileMap = {
  'sankita-patel.jpg': 'Dr.Sankita Patel',
  'balu-parne.jpg': 'Dr.Balu Parne',
  'anand-tiwari.jpg': 'Anand Tiwari',
  'angela-dutta.jpg': 'Angela Dutta',
  'anshul-reddy.jpg': 'Anshul Reddy',
  'archit-savaliya.jpg': 'Archit Savaliya',
  'chetan-kalsariya.jpg': 'Chetan Kalsariya',
  'deepak-challa.jpg': 'Deepak Challa',
  'dhruv-patel.jpg': 'Dhruv Patel',
  'foram-gandhi.jpg': 'Foram Gandhi',
  'govind.jpg': 'Govind',
  'harshil-andhariya.jpg': 'Harshil Andhariya',
  'jay-pipaliya.jpg': 'Jay Pipaliya',
  'manthan-chauhan.jpg': 'Manthan Chauhan',
  'miten-gandhi.jpg': 'Miten Gandhi',
  'on-satodiya.jpg': 'Om Satodiya', // Handling typo in filename
  'purv-kabaria.jpg': 'Purv Kabaria',
  'smit-makarna.jpg': 'Smit Marakna', // Handling typo in filename
  'vanshik-godkeshwar.jpg': 'Vanshik Godeshwar', // Handling typo in filename
  'vanshika-karkera.jpg': 'Vanishka Karkera' // Handling typo in filename
};

const uploadPhotos = async () => {
  await connectDB();
  
  const publicDir = path.join(__dirname, '../client/public');
  
  for (const [filename, memberName] of Object.entries(fileMap)) {
    const filePath = path.join(publicDir, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping: ${filename} (file not found)`);
      continue;
    }
    
    try {
      console.log(`Uploading ${filename} for ${memberName}...`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'acm_team_2025',
        public_id: filename.replace('.jpg', '')
      });
      
      const updated = await TeamMember.findOneAndUpdate(
        { name: memberName },
        {
          photo: {
            url: result.secure_url,
            cloudinaryId: result.public_id
          }
        },
        { new: true }
      );
      
      if (updated) {
        console.log(`✅ Successfully updated ${memberName}`);
      } else {
        console.log(`⚠️ WARNING: DB record for ${memberName} not found.`);
      }
      
    } catch (err) {
      console.error(`❌ Failed to upload ${filename}:`, err.message);
    }
  }
  
  console.log('Upload process completed.');
  process.exit(0);
};

uploadPhotos();
