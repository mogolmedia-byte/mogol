const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const clearBtn = document.getElementById("clearBtn");

const greeting = {
  text: "Hi! I'm Hiimeer, your friendly AI buddy. Ask me anything or type 'help' for ideas.",
  time: new Date(),
};

const responses = [
  {
    keywords: ["hello", "hi", "hey", "namaste", "hola"],
    reply: "Hello! I'm here and ready to help. What's on your mind?",
  },
  {
    keywords: ["help", "support", "idea", "suggest"],
    reply:
      "Try asking: \"Plan my day\", \"Give me a study tip\", or \"Write a short poem\".",
  },
  {
    keywords: ["plan", "day", "schedule"],
    reply:
      "Here's a quick plan: 1) Pick top 3 priorities, 2) Focus block of 60-90 mins, 3) Short break, 4) Repeat, 5) Wrap-up review.",
  },
  {
    keywords: ["study", "learn", "exam"],
    reply:
      "Study tip: use 25-minute focus sprints, then a 5-minute break. Summarize what you learned aloud.",
  },
  {
    keywords: ["poem", "write", "creative"],
    reply:
      "A tiny poem: \nMoonlight on the windowpane,\nDreams arrive like gentle rain.",
  },
  {
    keywords: ["bye", "goodbye", "see you"],
    reply: "Take care! Come back anytime you want to chat.",
  },
];

const defaultReplies = [
  "That's interesting! Tell me a bit more.",
  "Got it. What outcome are you hoping for?",
  "I'm listening—share any details you'd like.",
  "Thanks for sharing. Want a quick suggestion?",
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.innerHTML = `${text}<small>${formatTime(new Date())}</small>`;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addBotReply(userText) {
  const lowerText = userText.toLowerCase();
  const match = responses.find((response) =>
    response.keywords.some((keyword) => lowerText.includes(keyword))
  );

  if (match) {
    addMessage(match.reply.replace(/\n/g, "<br />"), "bot");
    return;
  }

  const randomReply =
    defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
  addMessage(randomReply, "bot");
}

function handleSubmit(event) {
  event.preventDefault();
  const text = userInput.value.trim();
  if (!text) {
    return;
  }

  addMessage(text, "user");
  userInput.value = "";
  setTimeout(() => addBotReply(text), 400);
}

function clearChat() {
  chatWindow.innerHTML = "";
  addMessage(greeting.text, "bot");
}

chatForm.addEventListener("submit", handleSubmit);
clearBtn.addEventListener("click", clearChat);

clearChat();
