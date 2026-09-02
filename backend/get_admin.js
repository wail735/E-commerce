import mongoose from 'mongoose';

mongoose.connect('mongodb://akramaymen391_db_user:cCKTOcuOw2jF3f1r@ac-jkb0hi6-shard-00-00.ij0nvb5.mongodb.net:27017,ac-jkb0hi6-shard-00-01.ij0nvb5.mongodb.net:27017,ac-jkb0hi6-shard-00-02.ij0nvb5.mongodb.net:27017/moexpress?ssl=true&replicaSet=atlas-c6f2z4-shard-0&authSource=admin');

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'users');

async function getAdminEmail() {
  const admin = await User.findOne({ role: 'superAdmin' });
  console.log("Email Admin:", admin ? admin.email : "Aucun admin trouvé");
  mongoose.connection.close();
}

getAdminEmail();
