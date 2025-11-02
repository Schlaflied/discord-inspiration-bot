// 这是一个标准的 Node.js Bot 客户端文件 (适合 Replit/常驻服务器)
// 文件名：bot_client.js
// 作用：运行 Discord Bot，实时监听消息，并调用 Dify Agent API。

// --- 新增依赖：Express，用于创建 keep-alive 服务器 ---
import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import express from 'express'; // <--- 新增
const app = express(); // <--- 新增

// -----------------------------------------------------
// 1. 初始化配置和环境变量 (请在 Replit Secrets 中设置)
// -----------------------------------------------------

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; 
const DIFY_API_KEY = process.env.DIFY_API_KEY;           
const DIFY_AGENT_URL = process.env.DIFY_AGENT_URL;       
const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID; 
const PORT = process.env.PORT || 3000; // Replit 默认端口

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
        // 尝试登录会失败，但 Keep-Alive 服务器仍会运行
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
