import mongoose from 'mongoose';

mongoose.connect('mongodb://akramaymen391_db_user:cCKTOcuOw2jF3f1r@ac-jkb0hi6-shard-00-00.ij0nvb5.mongodb.net:27017,ac-jkb0hi6-shard-00-01.ij0nvb5.mongodb.net:27017,ac-jkb0hi6-shard-00-02.ij0nvb5.mongodb.net:27017/moexpress?ssl=true&replicaSet=atlas-c6f2z4-shard-0&authSource=admin');

const orderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.model('Order', orderSchema, 'orders');

async function updateOrders() {
  const result = await Order.updateMany({}, { $set: { paymentStatus: 'completed' } });
  console.log("Commandes mises à jour :", result.modifiedCount);
  mongoose.connection.close();
}

updateOrders();
