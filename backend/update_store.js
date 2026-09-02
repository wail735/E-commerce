import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/moexpress")
  .then(async () => {
    const User = mongoose.connection.db.collection('users');
    const result = await User.updateMany(
      { storeName: 'Fashion Boutique' },
      { $set: { storeName: 'Boutique de Wail' } }
    );
    console.log('Updated users:', result.modifiedCount);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
