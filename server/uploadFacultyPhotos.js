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

const fileMap = {
  'sankita-patel.png': 'Dr.Sankita Patel',
  'balu-parne.jfif': 'Dr.Balu Parne',
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
        public_id: filename.replace(/\.(jpg|jpeg|png|jfif|webp)$/i, '')
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
