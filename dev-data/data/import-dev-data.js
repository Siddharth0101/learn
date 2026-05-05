const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

// 1) Load env variables
// The path depends on where you run this script from. 
// Assuming you run it from the root directory: `node dev-data/data/import-dev-data.js`
dotenv.config({ path: './config.env' });

// 2) Connect to Database
const DB = process.env.DATABASE;

// 3) Read JSON File
// Using __dirname so it always resolves correctly relative to this file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// 4) Import data into database
const importData = async () => {
  await Tour.create(tours);
  console.log('👍 Data successfully loaded!');
};

// 5) Delete all existing data from collection
const deleteData = async () => {
  await Tour.deleteMany();
  console.log('🗑️ Data successfully deleted!');
};

// 6) Main function to manage DB connection and script action
const manageData = async () => {
  try {
    // Use Google DNS to consistently resolve MongoDB Atlas SRV records
    require('dns').setServers(['8.8.8.8']);

    // Connect to the database FIRST with await
    await mongoose.connect(DB);
    console.log('✅ DB connection successful!');

    // Check terminal arguments to decide action
    if (process.argv[2] === '--import') {
      await importData();
    } else if (process.argv[2] === '--delete') {
      await deleteData();
    } else {
      console.log('Please pass --import or --delete as an argument.');
    }
  } catch (error) {
    console.log('💥 Error:', error);
  } finally {
    process.exit();  // Centralized exit: stops the script safely after everything is complete or fails
  }
};

manageData();
