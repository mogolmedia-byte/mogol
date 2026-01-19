# Facebook Messenger AI чатбот (Node.js)

Энэ төсөл нь Facebook Messenger Platform (Page inbox)‑д зориулсан AI чатботын суурь жишээ юм. Бот нь:

- Webhook баталгаажуулалт
- Текст мессежийг AI‑д дамжуулах
- Зураг/видео/дууны мессеж илгээх

## Шаардлага

- Node.js 18+
- Facebook Page Access Token
- Facebook App Secret
- Нийтийн HTTPS домэйн (Webhook тохируулахад)

## Тохиргоо

`.env.example`‑ийг `.env` болгон хуулж бөглөнө.

```bash
cp .env.example .env
```

## Асаах

```bash
npm install
npm start
```

## Webhook тохиргоо

Facebook Developer Console‑оос Webhook URL болон Verify Token‑оо тохируулна.
- Webhook URL: `https://your-domain.com/webhook`
- Verify Token: `.env` доторх `VERIFY_TOKEN`

## Медиа илгээх

`BASE_URL` нь таны серверийн нийтийн URL байна. Жишээ нь `https://your-domain.com`. 
`assets` хавтсанд `sample-image.jpg`, `sample-audio.mp3`, `sample-video.mp4` байршуулна.

## Анхаарах зүйлс

- `OPENAI_API_KEY` тохируулснаар AI хариу ажиллана.
- Түлхүүргүй үед demo хариу буцаана.

## Хөгжүүлэлт

Шаардлагатай бол логикыг өөрийн хэрэгцээнд тохируулж болно.
