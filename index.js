// 这是一个 Node.js Bot Client 文件。
// 文件名：index.js (Replit 默认启动文件)
// 作用：运行 Discord Bot，实时监听消息，并调用 Dify Agent API。

import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import http from 'http';

// -----------------------------------------------------
// 1. 初始化配置和环境变量 (请在 Replit Secrets 中设置)
// -----------------------------------------------------

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; 
const DIFY_API_KEY = process.env.DIFY_API_KEY;           
const DIFY_AGENT_URL = process.env.DIFY_AGENT_URL;       
const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID; 

// -----------------------------------------------------
// 2. Bot 客户端初始化
// -----------------------------------------------------

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent 
    ] 
});

// -----------------------------------------------------
// 3. 核心：Bot 事件监听逻辑
// -----------------------------------------------------

client.once('clientReady', () => {
    console.log(`✅ Bot is Ready! Logged in as ${client.user.tag}`);
    console.log(`正在监听频道 ID: ${TARGET_CHANNEL_ID}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || message.channelId !== TARGET_CHANNEL_ID || !message.content) {
        return; 
    }

    const messageContent = message.content;
    console.log(`收到消息: ${messageContent.substring(0, 50)}...`);

    // --- 最终修正后的 Dify Agent API 调用 ---
    try {
        const DIFY_USER_ID = message.author.id;
        
        // **最终修正 Payload 结构：添加空的 inputs 对象**
        const difyPayload = {
            query: messageContent, 
            response_mode: 'blocking',
            user: DIFY_USER_ID,
            inputs: {} // 明确添加 inputs 字段，防止 Dify 认为缺少必要参数
        };

        console.log("正在调用 Dify Agent...");

        const response = await fetch(DIFY_AGENT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DIFY_API_KEY}`,
            },
            body: JSON.stringify(difyPayload),
        });

        // 成功状态码：200
        if (response.ok) {
            console.log(`✅ Dify 评估成功，Notion Writer (Function B) 已被调用。`);
            // 可选：Bot 可以回复一条确认消息
            // message.react('💡'); 
        } else {
            const errorText = await response.text();
            console.error('❌ Dify API 出错:', response.status, errorText);
        }
    } catch (error) {
        console.error('❌ Dify API Call Error:', error);
    }
});

// -----------------------------------------------------
// 4. Keep-Alive Server (常驻运行机制)
// -----------------------------------------------------

// 启动 Bot 客户端
client.login(DISCORD_BOT_TOKEN)
    .then(() => console.log('Bot 登录成功，开始监听 Discord 事件。'))
    .catch(err => console.error('Bot 登录失败:', err));

// 启动 Keep-Alive Server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running and staying awake.\n');
});

server.listen(3000, () => {
    console.log('Keep-Alive 服务器运行在端口 3000。');
});
