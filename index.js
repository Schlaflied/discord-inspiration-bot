// index.js - 最终简洁稳定版本：Discord -> Notion (无 Dify)

import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";
import http from "http";

// -----------------------------------------------------
// 1. 初始化配置和环境变量
// -----------------------------------------------------

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID;
const NOTION_TOKEN = process.env.NOTION_TOKEN; // Notion 集成 Token
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID; // Notion Database ID

// -----------------------------------------------------
// 2. Bot 客户端初始化
// -----------------------------------------------------

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once("clientReady", () => {
    console.log(`✅ Bot is Ready! Logged in as ${client.user.tag}`);
});

// -----------------------------------------------------
// 3. 核心逻辑：创建 Page (Discord 消息处理)
// -----------------------------------------------------

client.on("messageCreate", async (message) => {
    // 过滤条件
    if (
        message.author.bot ||
        message.channelId !== TARGET_CHANNEL_ID ||
        !message.content
    ) {
        return;
    }

    if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
        console.error("❌ ERROR: NOTION_TOKEN 或 NOTION_DATABASE_ID 未设置！");
        await message
            .reply("❌ Bot 配置错误：缺少 Notion Secret。")
            .catch(console.error);
        return;
    }

    const messageContent = message.content;
    const timestamp = message.createdAt.toISOString();

    // --- Notion API 调用 ---
    try {
        console.log(`正在写入 Notion: ${messageContent.substring(0, 50)}...`);

        const NOTION_API_URL = "https://api.notion.com/v1/pages";

        // 使用已验证成功的中文属性名
        const notionPayload = {
            parent: { database_id: NOTION_DATABASE_ID },
            properties: {
                // 1. 标题列: '灵感主题'
                灵感主题: {
                    title: [
                        {
                            text: {
                                content: messageContent.substring(0, 2000),
                            },
                        },
                    ],
                },
                // 2. 灵感内容 (Rich Text)
                灵感内容: {
                    rich_text: [{ text: { content: messageContent } }],
                },
                // 3. 创建日期 (Date Property)
                创建日期: {
                    date: { start: timestamp },
                },
                // 4. 状态 (Status Property): 设为 '待处理'
                状态: {
                    status: { name: "待处理" },
                },
            },
        };

        const response = await fetch(NOTION_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${NOTION_TOKEN}`,
                "Notion-Version": "2022-06-28",
            },
            body: JSON.stringify(notionPayload),
        });

        if (response.ok) {
            console.log("✅ 成功写入 Notion！");
            await message.react("📝").catch(console.error);

            // --- 发送个性化回复 ---
            const finalMessage = `
**Idea successfully captured!** 📝
Your note has been securely synchronized to the Notion '**灵感记录库**'.

Have a productive day!✨
チェックしてみてね (Chekku shite mite ne)!
`;
            await message.channel.send(finalMessage).catch(console.error);
            // ---------------------
        } else {
            const errorText = await response.text();
            console.error("❌ Notion API 错误:", response.status, errorText);
            await message
                .reply(
                    `❌ 写入 Notion 失败: 状态码 ${response.status}。请检查权限。`,
                )
                .catch(console.error);
        }
    } catch (error) {
        console.error("❌ Notion API Call Error:", error);
        await message
            .reply(`❌ 发生网络错误，无法连接到 Notion API。`)
            .catch(console.error);
    }
});

// -----------------------------------------------------
// 4. Keep-Alive Server (常驻运行机制) (不变)
// -----------------------------------------------------

client
    .login(DISCORD_BOT_TOKEN)
    .then(() => console.log("Bot 登录成功，开始监听 Discord 事件。"))
    .catch((err) => console.error("Bot 登录失败:", err));

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot is running and staying awake.\n");
});

server.listen(3000, () => {
    console.log("Keep-Alive 服务器运行在端口 3000。");
});
