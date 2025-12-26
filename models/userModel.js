import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },
    address: [

        {
            addressLine1: String,
            addressLine2: String,
            street: String,
            city: String,
            state: String,
            postalCode: String,
            Country: String,
        }
    ],
    //shopping fields
    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    //shopping fields
    wishlist: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
        }
    ],
    orders: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order"
            },
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
})
const User = mongoose.model("User", userSchema)
export default User;