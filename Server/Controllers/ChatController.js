import Chat from "../Models/ChatModels.js";

function simulatedLLMResponse(messageText) {
  return `You said: ${messageText}. Our System will now check your eligibility.`;
}

export async function handleAsk(req, res) {
  const { sessionId, message } = req.body;

  if (
    !sessionId ||
    !message ||
    !Array.isArray(message) ||
    message.length === 0
  ) {
    return res.status(400).json({ error: "Invalid Input" });
  }

  const userMessage = message[message.length - 1];

  try {
    let chat = await Chat.findOne({ sessionId });
    if (!chat) {
      chat = new Chat({ sessionId, messages: [] });
    }

    chat.messages.push({
      role: "user",
      text: userMessage.text,
    });

    const botReply = simulatedLLMResponse(userMessage.text);

    chat.messages.push({
      role: "bot",
      text: botReply,
    });

    await chat.save();

    return res.json({ reply: botReply, sessionId: chat.sessionId });
  } catch (error) {
    console.error("Error in handleAsk:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
