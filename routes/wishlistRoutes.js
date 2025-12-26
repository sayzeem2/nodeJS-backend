
import express from "express";
import jwt from "jsonwebtoken";
import Wish from "../models/wishlistModel.js";
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

router.post("/wishlist/create", verifyToken, async (req, res) => {
    try {
        const { user, product, action } = req.body;

        if (!user) {
            return res.status(400).json({ message: "User ID is required." });
        }
        if (!product || product.length === 0) {
            return res.status(400).json({ message: "At least one product is required." });
        }

        // Ensure product is an array
        const productArray = Array.isArray(product) ? product : [product];

        // Find user's wishlist
        let wishlist = await Wish.findOne({ user });

        // If no wishlist, create one
        if (!wishlist) {
            wishlist = new Wish({ user, product: productArray });
            await wishlist.save();
            return res
                .status(201)
                .json({ message: "Wishlist created successfully", wishlist });
        }

        // Work with a copy of current products
        let updatedProducts = Array.isArray(wishlist.product)
            ? [...wishlist.product]
            : [wishlist.product];

        if (action === "remove") {
            // Remove all matching products
            updatedProducts = updatedProducts.filter((p) => !productArray.includes(p.toString())
            );
        } else {
            // Add products that don't already exist
            productArray.forEach((prod) => {
                // console.log(prod)
                if (!updatedProducts.some((p) => p.toString() === prod)) {
                    updatedProducts.push(prod);
                }
            });
        }

        wishlist.product = updatedProducts;
        const updatedWishlist = await wishlist.save();

        res
            .status(200)
            .json({ message: "Wishlist updated successfully", wishlist: updatedWishlist });
    } catch (error) {
        console.error("Error creating/updating wishlist:", error);
        res.status(500).json({ message: "Server error creating/updating wishlist." });
    }
});

router.get("/wishlist", async (req, res) => {
    try {
        const wishlist = await Wish.find();
        res.json({ status: "success", data: wishlist })
    } catch (error) {
        res.status(500).json({ status: "failure", message: error.message })
    }
})

router.get("/wishlist/:id", async (req, res) => {
    try {
        const wishlist = await Wish.findById(req.params.id);
        if (!wishlist) {
            return res.status(404).json({ message: "wishlist not found" })
        }
        res.json({ status: "success", data: wishlist })

    } catch (error) {
        res.status(500).json({ status: "failure", message: error.message })
    }
})


router.put("/wishlist/update/:id", async (req, res) => {
    try {
        const { user, product } = req.body;

        // Find wishlist by ID
        const wishlist = await Wish.findById(req.params.id);
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }
        // Update fields if provided
        if (product) wishlist.product = product;

        const updatedWishlist = await wishlist.save();

        // Return response (exclude password)
        res.json({
            _id: updatedWishlist._id,
            product: updatedWishlist.product,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/wishlist/delete/:id", async (req, res) => {
    try {
        const wishlist = await Wish.findById(req.params.id);
        if (!wishlist) {
            return res.status(404).json({ message: "wishlist not found" });
        }
        await wishlist.deleteOne();
        return res.status(200).json({ message: "Wishlist Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


export default router;