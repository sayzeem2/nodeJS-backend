import express from "express";
import mongoose from "mongoose"
// const cors = require('cors');
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import wishlistRoutes from "./routes/wishlistRoutes.js"
// const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// MongoDB connection with Mongoose
const uri = 'mongodb+srv://sayzee2607:wjBv96VQtLNJwyY9@cluster0.eqkiiro.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected with Mongoose"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", wishlistRoutes);

// Test routes
app.get('/', (req, res) => {
    res.send('Hello Express');
});

app.listen(3000, () => {
    console.log('🚀 Server Running on port 3000');
});
