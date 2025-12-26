
import express from "express";
import Product from "../models/productModel.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs"
import path from "path"
// import { JsonWebTokenError } from "jsonwebtoken";
const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/products";// this is a local path
        fs.mkdirSync(uploadPath, { recursive: true }); // ✅ creates folder if not exists
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage })

//====register new product
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



router.post("/products/create", verifyToken, upload.fields([
    { name: "productImages", maxCount: 1 },
    { name: "productThumbnail", maxCount: 1 },
]), async (req, res) => {
    try {

        console.log("BODY:", req.body);
        console.log("FILES:", req.files);
        const { productName, productCategory, productPrice, status } = req.body;
        let productDesc = [];
        if (req.body.productDesc) {
            try {
                productDesc = JSON.parse(req.body.productDesc);
            } catch (err) {
                console.error("Invalid JSON in productDesc:", err);
                return res.status(400).json({ message: "Invalid JSON in productDesc" });
            }
        }
        const productExists = await Product.findOne({ productName })
        if (productExists) {
            return res.status(400).json({ message: "Product Already Exist" })
        }
        const productImages = req.files['productImages'] ? req.files["productImages"][0].path : "";
        const productThumbnail = req.files['productThumbnail'] ? req.files["productThumbnail"][0].path : "";
        const product = await Product.create({
            productName, productCategory, productPrice, productDesc, status, productImages, productThumbnail
        })
        res.status(201).json({ message: "Product Created Successfully" })
    }

    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ status: "success", data: products })
    } catch (error) {
        res.status(500).json({ status: "failure", message: error.message })
    }
})

router.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "product not found" })
        }
        res.json({ status: "success", data: product })

    } catch (error) {
        res.status(500).json({ status: "failure", message: error.message })
    }
})


router.put("/products/:id", async (req, res) => {
    try {
        const { productName, productCategory, productPrice, productDesc, status } = req.body;


        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (productName) product.productName = productNamename;
        if (productCategory) product.productCategory = productCategory;
        if (productPrice) product.productPrice = productPrice;
        if (productDesc) product.productDesc = productDesc;
        if (status !== undefined) product.status = status;

        // Save updated user
        const updatedProduct = await product.save();

        // Return response (exclude password)
        res.json({
            _id: updatedProduct._id,
            productName: updatedProductName.productName,
            productCategory: updatedProductCatergory.productCategory,
            productPrice: updatedProductPrice.productPrice,
            productDesc: updatedProductDesc.productDesc,
            status: updatedStatus.status,
            updatedAt: updatedProduct.updatedAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/products/delete/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await product.deleteOne();
        return res.status(200).json({ message: "Product Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export default router;