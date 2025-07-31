import express from "express";
import { handleAsk } from "../Controllers/ChatController.js";
const router = express.Router();

router.post("/ask", handleAsk);

export default router;
