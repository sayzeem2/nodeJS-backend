import express from "express";
import jwt from "jsonwebtoken";
import Order from "../models/orderModel.js";
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



router.post("/order/create", verifyToken, async (req, res) => {
    try {
        const { user, products, totalAmount, shippingAddress } = req.body;

        if (!user) return res.status(400).json({ message: "User ID is required." });

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "At least one product is required." });
        }

        const parsedAmount = parseFloat(totalAmount);

        if (isNaN(parsedAmount)) {
            return res.status(400).json({ message: "Total amount must be a valid number." });
        }

        const productArray = Array.isArray(products) ? products : [products];
        let existingOrder = await Order.findOne({ user });

        if (!existingOrder) {
            // Create new order
            const newOrder = new Order({
                user,
                products: productArray,
                totalAmount,
                shippingAddress
            });

            const saved = await newOrder.save();
            return res.status(201).json({ message: "Order created successfully", order: saved });
        }


        let updatedProducts = [...existingOrder.products];

        productArray.forEach(newProd => {
            const index = updatedProducts.findIndex(
                p => p.product.toString() === newProd.product
            );

            if (index > -1) {
                // If product exists, update quantity and price
                updatedProducts[index].quantity += newProd.quantity || 1;
            } else {
                updatedProducts.push(newProd);
            }
        });

        // Update total amount
        existingOrder.products = updatedProducts;
        existingOrder.totalAmount += parsedAmount; // or recalculate it dynamically if needed

        const updatedOrder = await existingOrder.save();

        return res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
        // return res.status(200)
    } catch (error) {
        console.error("Error creating/updating order:", error);
        res.status(500).json({ message: "Server error creating/updating order." });
    }
});

router.get("/order", async (req, res) => {
    try {
        const order = await Order.find()
        res.json({ status: "success", data: order })
    } catch (error) {
        res.status(500).json({ status: "failure", message: error.message })
    }
})

router.get("/order/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }
        res.json({ status: "success", data: order })

    } catch (error) {
        res.status(500).json({ status: "failure", message: error.message })
    }
})

router.put("/order/update/:id", async (req, res) => {
    try {
        const { user, products, totalAmount, shippingAddress } = req.body;


        const order = await Order.findById(req.params.id);
        if (!user && !products && !totalAmount && !shippingAddress) {
            return res.status(400).json({ message: "At least one field must be provided to update." });
        }

        if (user) order.user = user;
        if (products) order.products = products;
        if (totalAmount) order.totalAmount = totalAmount;
        if (shippingAddress) order.shippingAddress = shippingAddress;


        const updatedOrder = await order.save();

        res.json({
            _id: updatedOrder._id,
            user: updatedOrder.user,
            products: updatedOrder.products,
            totalAmount: updatedOrder.totalAmount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/order/delete/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        await order.deleteOne();
        return res.status(200).json({ message: "Order Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export default router;