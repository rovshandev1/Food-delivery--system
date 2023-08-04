const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/food_delivery_system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDBga muvaffaqiyatli ulanildi');
  } catch (error) {
    console.error('MongoDBga ulanishda xatolik:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
