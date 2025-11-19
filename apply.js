// api/apply.js
// Serverless-функция для Vercel: принимает отклик с сайта и отправляет его в Telegram.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};

    const {
      firstName,
      lastName,
      phone,
      birthday,
      platform,
      telegram,
      comment,
      trackCode,
      page,
    } = body;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("No TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
      return res
        .status(500)
        .json({ ok: false, error: "Server is not configured" });
    }

    const lines = [
      "🆕 *Новый отклик на вакансию*",
      "",
      `👤 Имя: *${firstName || "-"}*`,
      `👤 Фамилия: *${lastName || "-"}*`,
      `📱 Телефон: \`${phone || "-"}\``,
      `🎂 Дата рождения: *${birthday || "-"}*`,
      `📲 Платформа: *${platform || "-"}*`,
      `✈️ Telegram: \`${telegram || "-"}\``,
      "",
      `🧾 Трек-код: *${trackCode || "-"}*`,
      page ? `🌐 Страница: ${page}` : "",
      "",
      comment ? `💬 Комментарий:\n${comment}` : "",
    ].filter(Boolean);

    const text = lines.join("\n");

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const tgRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      console.error("Telegram error:", tgData);
      return res
        .status(500)
        .json({ ok: false, error: "Telegram error", detail: tgData });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Handler error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Internal server error" });
  }
}
