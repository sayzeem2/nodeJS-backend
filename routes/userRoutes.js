
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import User from "../models/userModel.js";

dotenv.config();
const router = express.Router()

//====register new user


router.get("/user/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Username Or Password" })
        }
        const token = jwt.sign({ id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" })
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
            },
        });

    } catch (error) {

    }
})

router.post("/user/create", async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User Already Exist" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name, email, password: hashedPassword, mobile
        })
        const token = jwt.sign(
            {
                email: email,
                password: password
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        )
        res.status(201).json({ message: "User Created Successfully", jwtToken: token })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ status: "success", data: users })
    } catch (error) {
        res.status(500).json({ status: "failure", message: error.message })
    }
})

router.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        res.json({ status: "success", data: user })

    } catch (error) {
        res.status(500).json({ status: "failure", message: error.message })
    }
})


router.put("/users/update/:id", async (req, res) => {
    try {
        const { name, email, password, mobile, address, role, isActive } = req.body;

        // Find user by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (mobile) user.mobile = mobile;
        if (address) user.address = address;
        if (role) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;

        // Handle password update (hash if provided)
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Save updated user
        const updatedUser = await user.save();

        // Return response (exclude password)
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            role: updatedUser.role,
            address: updatedUser.address,
            isActive: updatedUser.isActive,
            updatedAt: updatedUser.updatedAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/users/delete/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.deleteOne();
        return res.status(200).json({ message: "User Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


export default router;