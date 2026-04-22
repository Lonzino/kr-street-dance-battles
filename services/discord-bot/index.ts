/**
 * Discord 봇 — #배틀제보 채널 메시지를 자동 ingest.
 *
 * 별도 프로세스로 돌아야 함 (Vercel 같은 서버리스로는 못 돌림).
 * 추천 호스트: Railway, Fly.io, Render, 또는 본인 서버.
 *
 * 환경변수:
 * - DISCORD_BOT_TOKEN: Discord Developer Portal에서 발급
 * - DISCORD_INGEST_CHANNEL_ID: 모니터할 채널 ID
 * - INGEST_API_URL: Vercel 배포한 사이트의 ingest endpoint
 *   예: https://your-site.vercel.app/api/admin/ingest
 * - INGEST_TOKEN: Vercel과 동일한 INGEST_TOKEN
 *
 * 실행:
 *   npm install discord.js   # 봇 의존성
 *   tsx services/discord-bot/index.ts
 */
import { Client, Events, GatewayIntentBits } from "discord.js";

const REQUIRED = [
  "DISCORD_BOT_TOKEN",
  "DISCORD_INGEST_CHANNEL_ID",
  "INGEST_API_URL",
  "INGEST_TOKEN",
];

for (const k of REQUIRED) {
  if (!process.env[k]) {
    console.error(`[bot] missing env: ${k}`);
    process.exit(1);
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(`[bot] ready as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (msg) => {
  if (msg.author.bot) return;
  if (msg.channelId !== process.env.DISCORD_INGEST_CHANNEL_ID) return;

  const input = msg.content.trim();
  if (!input) return;

  await msg.react("⏳");

  try {
    const res = await fetch(process.env.INGEST_API_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Ingest-Token": process.env.INGEST_TOKEN as string,
      },
      body: JSON.stringify({ input }),
    });

    if (!res.ok) {
      const detail = await res.text();
      await msg.reply(`❌ 수집 실패 (${res.status}): \`\`\`${detail.slice(0, 500)}\`\`\``);
      await msg.reactions.removeAll();
      await msg.react("❌");
      return;
    }

    const data = await res.json();
    await msg.reactions.removeAll();
    await msg.react("✅");
    await msg.reply(
      `✓ 검토 큐에 추가됨 (confidence ${(data.confidence * 100).toFixed(0)}%). 운영자 검토 후 공개됩니다.`,
    );
  } catch (e) {
    console.error("[bot] error:", e);
    await msg.reply(`❌ 봇 오류: ${e instanceof Error ? e.message : String(e)}`);
    await msg.reactions.removeAll();
    await msg.react("❌");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
