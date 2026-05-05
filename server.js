const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE;

const startServer = async () => {
  // Fix: Use Google DNS to resolve MongoDB Atlas SRV records
  require('dns').setServers(['8.8.8.8']);

  await mongoose.connect(DB);
  console.log('✅ MongoDB connection successful!');

  const port = process.env.PORT;
  const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });

  process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    console.log('unhadledRejection')
    server.close(() => {
      process.exit(1)
    })
  })
};

startServer();