import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    userCart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
});

const Cart = mongoose.model("Cart", cartItemSchema);
export default Cart;
