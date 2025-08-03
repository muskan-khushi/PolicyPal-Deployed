import Chat from "../Models/ChatModels.js";
import fetch from "node-fetch";

export async function handleAsk(req, res) {
  const userId = req.user._id;
  const { message } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!message || !Array.isArray(message) || message.length === 0) {
    return res.status(400).json({ error: "Invalid Input" });
  }

  const userMessage = message[message.length - 1];

  try {
    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    chat.messages.push({
      role: "user",
      text: userMessage.text,
    });

    // const aiResponse = await fetch("http://localhost:8000/api/policy-check", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ query: userMessage.text }),
    // });

    const queryParam = encodeURIComponent(userMessage.text);
    const aiResponse = await fetch(
      `http://localhost:8000/ask?query=${queryParam}`
    );
    const aiResult = await aiResponse.json();

    let botReply;

    if (aiResult.reply) {
      botReply = aiResult.reply;
    } else if (aiResult.status && aiResult.reason) {
      // fallback if API changes later
      botReply = `${aiResult.status}: ${aiResult.reason}`;
    } else if (aiResult.error) {
      botReply = `Error from AI service: ${aiResult.error}`;
    } else {
      botReply = "Sorry, something went wrong processing your request.";
    }

    chat.messages.push({
      role: "bot",
      text: botReply,
    });

    await chat.save();

    return res.json({ reply: botReply });
  } catch (error) {
    console.error("Error in handleAsk:", error.message, error.stack);

    return res.status(500).json({ error: "Internal Server Error" });
  }
}
