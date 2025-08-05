import express from "express";
import { handleAsk } from "../Controllers/ChatController.js";
import { authMiddleWare } from "../Middlewares/authMiddleware.js";
const router = express.Router();

router.post("/ask", authMiddleWare, handleAsk);

export default router;
