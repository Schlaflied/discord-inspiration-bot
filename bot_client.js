// 这是一个标准的 Node.js Bot 客户端文件 (适合 Replit/常驻服务器)
// 文件名：bot_client.js
// 作用：运行 Discord Bot，实时监听消息，并调用 Dify Agent API。

// --- 新增依赖：Express，用于创建 keep-alive 服务器 ---
import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import express from 'express';
const app = express();

// -----------------------------------------------------
// 1. 初始化配置和环境变量 (请在 Replit Secrets 中设置)
// -----------------------------------------------------

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; 
const DIFY_API_KEY = process.env.DIFY_API_KEY;           
const DIFY_AGENT_URL = process.env.DIFY_AGENT_URL;       
const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID; 
const PORT = process.env.PORT || 3000;

// 检查是否已存在客户端实例
let client = null; 

// -----------------------------------------------------
// 2. 核心 Bot 逻辑 (封装成函数)
// -----------------------------------------------------
async function startBot() {
    if (client && client.isReady()) {
        console.log("Bot already running, skipping login.");
        return;
    }

    if (!DISCORD_BOT_TOKEN || !DIFY_API_KEY || !DIFY_AGENT_URL || !TARGET_CHANNEL_ID) {
        console.error("❌ 错误：缺少必需的环境变量。请检查 Replit Secrets。");
        console.error("需要的环境变量: DISCORD_BOT_TOKEN, DIFY_API_KEY, DIFY_AGENT_URL, TARGET_CHANNEL_ID");
        return; 
    }

    try {
        client = new Client({ 
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent 
            ] 
        });

        // Bot 准备就绪时触发
        client.once('clientReady', () => {
            console.log(`✅ Bot 已登录为 ${client.user.tag}`);
            console.log(`🎯 正在监听频道 ID: ${TARGET_CHANNEL_ID}`);
        });

        // 监听消息事件
        client.on('messageCreate', async (message) => {
            // 忽略 Bot 自己的消息
            if (message.author.bot) return;

            // 只处理指定频道的消息
            if (message.channel.id !== TARGET_CHANNEL_ID) return;

            console.log(`📩 收到消息: ${message.content}`);

            try {
                // 向 Dify Agent 发送请求
                const response = await fetch(DIFY_AGENT_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${DIFY_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        inputs: {},
                        query: message.content,
                        response_mode: 'blocking',
                        user: message.author.id
                    })
                });

                if (!response.ok) {
                    throw new Error(`Dify API 错误: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                const reply = data.answer || "抱歉，我无法处理这个请求。";

                // 回复到 Discord 频道
                await message.reply(reply);
                console.log(`✅ 已回复: ${reply.substring(0, 50)}...`);

            } catch (error) {
                console.error('❌ 处理消息时出错:', error);
                await message.reply("抱歉，处理您的消息时出现错误。");
            }
        });

        // 登录 Discord
        await client.login(DISCORD_BOT_TOKEN);

    } catch (error) {
        console.error('❌ Bot 启动失败:', error);
    }
}

// -----------------------------------------------------
// 3. Express 服务器 (Keep-Alive)
// -----------------------------------------------------
app.get('/', (req, res) => {
    res.send('Discord Bot is running! 🤖');
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        botReady: client ? client.isReady() : false,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, 'localhost', () => {
    console.log(`🚀 Keep-Alive 服务器运行在端口 ${PORT}`);
    startBot();
});
