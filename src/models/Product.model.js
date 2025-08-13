import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: { type: String, unique: true },
  price: Number,
  status: { type: Boolean, default: true },
  stock: Number,
  category: String,
  thumbnails: [String]
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;
