import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import chatRoutes from "./Routes/ChatRoutes.js";
import userRoutes from "./Routes/UserRoutes.js";
import documentRoutes from "./Routes/DocumentRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors({ origin: '*' }));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to the PolicyPal Server!");
});

// --- API Routes ---
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/documents", documentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});