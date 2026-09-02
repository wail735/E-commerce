import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/moexpress")
  .then(async () => {
    const User = mongoose.connection.db.collection('users');
    const result = await User.updateMany({}, { $set: { role: 'superAdmin' } });
    console.log('Updated ALL users to superAdmin:', result.modifiedCount);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
