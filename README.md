# ⛵ Discord Inspiration Bot / Discord 灵感机器人

这是一个基于 Node.js 和 Discord.js 开发的机器人，旨在为用户提供即时的鼓舞人心的名言和积极反馈，帮助提高社区的士气。

This is a Discord bot developed using Node.js and Discord.js, designed to provide instant inspirational quotes and positive feedback to boost community morale.

## 核心功能 / Core Features

* **情绪检测与激励 / Mood Detection & Inspiration:** 机器人能够监听消息内容，并在检测到用户表达“悲伤”、“沮丧”或“不开心”等负面情绪时，自动回复一条随机的名言以提供安慰。/ The bot listens for messages and automatically responds with a random quote when it detects negative feelings like "sad," "depressed," or "unhappy."
* **命令触发 / Command Trigger:** 用户可以使用特定命令 (`$inspire`) 随时手动请求一条励志名言。/ Users can manually request an inspirational quote at any time using the specific command (`$inspire`).
* **外部 API 集成 / External API Integration:** 通过 `node-fetch` 从外部数据源（如 `zenquotes.io`）获取高质量的英文名言。/ Integrates with an external data source to fetch high-quality English quotes using `node-fetch`.
* **保持在线机制 / Keep-Alive Mechanism:** 集成了 Express Web 服务器，用于创建健康检查端点，确保在 Replit 等平台上持续运行。/ Includes an Express web server to create a health check endpoint, ensuring continuous operation on platforms like Replit.

## 技术栈 / Tech Stack

| 模块 / Module | 组件 / Component | 描述 / Description |
| :--- | :--- | :--- |
| **平台 / Platform** | Node.js | 核心运行时环境。/ Core runtime environment. |
| **框架 / Framework** | Discord.js | 用于与 Discord API 交互的主库。/ Main library for interacting with the Discord API. |
| **持久运行 / Persistence** | Express | 用于创建 Web 服务器，保持机器人进程活跃。/ Used to create a web server and keep the bot process alive. |
| **配置 / Configuration** | `dotenv` | 用于安全管理敏感信息（如 Bot Token）的环境变量。/ Used for securely managing sensitive environment variables (like the Bot Token). |

## 部署与运行 / Deployment and Usage

1.  **设置密钥 / Set up Secrets:**
    * 将您的 Discord Bot Token 保存为名为 `TOKEN` 的环境变量（例如在 `.env` 文件中或部署平台的 Secrets 中）。/ Save your Discord Bot Token as an environment variable named `TOKEN`.
2.  **安装依赖 / Install Dependencies:**
    ```bash
    npm install
    ```
3.  **启动机器人 / Start the Bot:**
    ```bash
    npm start
    ```
4.  **保持活跃 (Replit 优化) / Keep Alive (Replit Optimized):**
    * 机器人会自动启动一个 Express 服务器来响应外部请求，确保服务不会休眠。/ The bot automatically starts an Express server to keep the service from sleeping.
