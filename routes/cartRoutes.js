
import express from "express";

import jwt from "jsonwebtoken";
import Cart from "../models/cartModel.js";
const router = express.Router()

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(403).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
}

router.post("/cart/create", verifyToken, async (req, res) => {
    try {
        const { userCart, product, quantity } = req.body;

        if (!userCart || !product) {
            return res.status(400).json({ message: "User and Product are required" })
        }
        const cartExists = await Cart.findOne({ userCart, product })
        if (cartExists) {

            cartExists.quantity += quantity || 1
            const updatedItem = await cartExists.save()
            return res.status(400).json({ message: "Cart Item Quantity Updated", cart: updatedItem })
        }

        const newCartItem = new Cart({ userCart, product, quantity })
        const saveItem = await newCartItem.save()
        // const cart = await Cart.create({
        //     userCart, product, quantity
        // })
        res.status(201).json({ message: "Item Added To Cart", cart: saveItem })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get("/cart", async (req, res) => {
    try {
        const cart = await Cart.find()
        res.json({ status: "success", data: cart })
    } catch (error) {
        res.status(500).json({ status: "failure", message: error.message })
    }
})

router.get("/cart/:id", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: "cart not found" })
        }
        res.json({ status: "success", data: cart })

    } catch (error) {
        res.status(500).json({ status: "failure", message: error.message })
    }
})


router.put("/cart/update/:id", async (req, res) => {
    try {
        const { userCart, product, quantity } = req.body;


        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        if (product) cart.product = product;
        if (quantity) cart.quantity = quantity;



        const updatedCart = await cart.save();

        res.json({
            _id: updatedCart._id,
            userCart: updatedCart.userCart,
            product: updatedCart.product,
            quantity: updatedCart.quantity
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/cart/delete/:id", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        await cart.deleteOne();
        return res.status(200).json({ message: "Cart Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


export default router;