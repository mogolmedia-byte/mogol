import express from "express";
import crypto from "crypto";

const app = express();

app.use(express.json({ verify: verifySignature }));

const {
  PAGE_ACCESS_TOKEN,
  VERIFY_TOKEN,
  OPENAI_API_KEY,
  OPENAI_MODEL = "gpt-4o-mini",
  BASE_URL
} = process.env;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object !== "page") {
    return res.sendStatus(404);
  }

  try {
    for (const entry of body.entry ?? []) {
      const events = entry.messaging ?? [];
      for (const event of events) {
        if (event.message) {
          await handleMessage(event.sender.id, event.message);
        } else if (event.postback) {
          await sendText(event.sender.id, "Таны постбэк амжилттай хүлээн авлаа.");
        }
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
  }

  return res.sendStatus(200);
});

async function handleMessage(senderId, message) {
  if (message.attachments?.length) {
    return handleAttachment(senderId, message.attachments);
  }

  const text = message.text?.trim();
  if (!text) {
    return sendText(senderId, "Би зөвхөн текст эсвэл медиа ойлгоно.");
  }

  const reply = await buildAiReply(text);
  return sendText(senderId, reply);
}

async function handleAttachment(senderId, attachments) {
  const summary = attachments
    .map((attachment) => attachment.type)
    .join(", ");

  const reply = await buildAiReply(
    `Хэрэглэгч дараах медиа илгээлээ: ${summary}. Энэ медиа дээр үндэслэн нөхөрсөг хариу бич.`
  );

  await sendText(senderId, reply);

  const sampleUrl = BASE_URL
    ? `${BASE_URL}/assets/sample-image.jpg`
    : null;

  if (sampleUrl) {
    await sendImage(senderId, sampleUrl);
    await sendAudio(senderId, `${BASE_URL}/assets/sample-audio.mp3`);
    await sendVideo(senderId, `${BASE_URL}/assets/sample-video.mp4`);
  }
}

async function buildAiReply(prompt) {
  if (!OPENAI_API_KEY) {
    return `Таны мессеж: "${prompt}". (AI түлхүүр тохируулаагүй тул demo хариу.)`;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Та бол Монгол хэрэглэгчидтэй найрсаг, ойлгож мэдэрдэг Facebook Messenger чатбот. Товч, эелдэг, тусламжтай хариул."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("OpenAI error:", text);
    return "Уучлаарай, одоогоор AI хариулахад алдаа гарлаа.";
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "Хариу олдсонгүй.";
}

async function sendText(senderId, text) {
  return callSendApi({
    recipient: { id: senderId },
    message: { text }
  });
}

async function sendImage(senderId, url) {
  return callSendApi({
    recipient: { id: senderId },
    message: {
      attachment: {
        type: "image",
        payload: { url, is_reusable: true }
      }
    }
  });
}

async function sendAudio(senderId, url) {
  return callSendApi({
    recipient: { id: senderId },
    message: {
      attachment: {
        type: "audio",
        payload: { url, is_reusable: true }
      }
    }
  });
}

async function sendVideo(senderId, url) {
  return callSendApi({
    recipient: { id: senderId },
    message: {
      attachment: {
        type: "video",
        payload: { url, is_reusable: true }
      }
    }
  });
}

async function callSendApi(payload) {
  if (!PAGE_ACCESS_TOKEN) {
    console.error("Missing PAGE_ACCESS_TOKEN");
    return;
  }

  const response = await fetch(
    `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("Facebook Send API error:", text);
  }
}

function verifySignature(req, res, buf) {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature || !process.env.APP_SECRET) {
    return;
  }

  const expectedHash =
    "sha256=" +
    crypto
      .createHmac("sha256", process.env.APP_SECRET)
      .update(buf)
      .digest("hex");

  if (signature !== expectedHash) {
    throw new Error("Invalid request signature");
  }
}

app.use("/assets", express.static("assets"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Messenger bot listening on port ${port}`);
});
