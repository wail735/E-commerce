import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du produit est obligatoire"],
      trim: true,
      minlength: [3, "Le nom du produit doit contenir au moins 3 caractères"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "La description du produit est obligatoire"],
    },
    price: {
      type: Number,
      required: [true, "Le prix est obligatoire"],
      min: [0, "Le prix ne peut pas être négatif"],
    },
    comparePrice: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: [true, "La quantité en stock est obligatoire"],
      min: [0, "La quantité ne peut pas être négative"],
      default: 1,
    },
    category: {
      type: String,
      required: [true, "La catégorie est obligatoire"],
      index: true,
    },
    subCategory: String,
    // Marque du produit
    brand: {
      type: String,
      default: "Générique",
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        isMain: { type: Boolean, default: false },
      },
    ],
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({
  name: "text",
  description: "text",
  category: "text",
  brand: "text",
});

export const Product = mongoose.model("Product", productSchema);

export default Product;
