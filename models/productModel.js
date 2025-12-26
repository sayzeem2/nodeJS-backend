import mongoose from "mongoose"
import { type } from "os";
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        unique: true
    },
    productBrand: {
        type: String
    },
    productCategory: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number
    },
    // productDesc: {
    //     type : String
    // },
    productDesc: [{
        descLine1: String,
        descLine2: String
    }],
    productStock: {
        type: Number
    },
    productImages: {
        type: String
    },
    productThumbnail: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
})
const Product = mongoose.model("Product", productSchema)
export default Product;