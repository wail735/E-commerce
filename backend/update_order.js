import mongoose from 'mongoose';

mongoose.connect('mongodb://akramaymen391_db_user:cCKTOcuOw2jF3f1r@ac-jkb0hi6-shard-00-00.ij0nvb5.mongodb.net:27017,ac-jkb0hi6-shard-00-01.ij0nvb5.mongodb.net:27017,ac-jkb0hi6-shard-00-02.ij0nvb5.mongodb.net:27017/moexpress?ssl=true&replicaSet=atlas-c6f2z4-shard-0&authSource=admin');

const orderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.model('Order', orderSchema, 'orders');

async function updateOrders() {
  await Order.updateMany({ status: 'processing' }, { $set: { status: 'delivered' } });
  await Order.updateMany({ status: 'pending' }, { $set: { status: 'delivered' } });
  console.log("Toutes les commandes en attente/préparation sont passées à 'Livrée' !");
  mongoose.connection.close();
}

updateOrders();
