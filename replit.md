# Discord Bot with Dify Agent Integration

## Overview
This is a Discord bot that listens to messages in a specific Discord channel and responds using a Dify Agent API. The bot runs continuously on Replit with a keep-alive Express server.

## Purpose
- Monitor a specific Discord channel for user messages
- Forward messages to a Dify Agent API for processing
- Reply with AI-generated responses back to Discord

## Current State
- Project setup completed for Replit environment
- All dependencies installed (discord.js, express, node-fetch)
- Bot code is complete and ready to run
- Requires environment variables to be configured

## Recent Changes
- 2025-11-02: Completed incomplete bot_client.js file with full Discord bot logic
- 2025-11-02: Created index.js entry point
- 2025-11-02: Added .gitignore for Node.js project
- 2025-11-02: Set up project documentation

## Required Environment Variables
The following secrets must be configured in Replit Secrets:

1. **DISCORD_BOT_TOKEN** - Your Discord bot token from Discord Developer Portal
2. **DIFY_API_KEY** - API key for your Dify Agent
3. **DIFY_AGENT_URL** - The endpoint URL for your Dify Agent API
4. **TARGET_CHANNEL_ID** - The Discord channel ID where the bot should listen for messages

## Project Architecture

### Structure
```
.
├── index.js          # Entry point (imports bot_client.js)
├── bot_client.js     # Main bot logic with Discord and Dify integration
├── package.json      # Dependencies and scripts
└── replit.md         # This documentation file
```

### Key Components
1. **Discord Client**: Uses discord.js v14 with necessary intents for message monitoring
2. **Dify Integration**: Sends messages to Dify Agent API and receives AI responses
3. **Express Server**: Runs on port 3000 for keep-alive functionality
4. **Environment Validation**: Checks for required secrets before starting

### How It Works
1. Bot starts and logs into Discord using the provided token
2. Express server starts on port 3000 (localhost) for monitoring/health checks
3. Bot listens for messages in the specified Discord channel
4. When a message is received (not from a bot), it's sent to Dify Agent API
5. The AI response is posted back to the Discord channel as a reply

## API Endpoints
- `GET /` - Status page showing bot is running
- `GET /health` - Health check endpoint with bot status

## Dependencies
- **discord.js** (^14.15.3) - Discord API wrapper
- **node-fetch** (^3.3.2) - HTTP requests to Dify API
- **express** - Web server for keep-alive

## Notes
- Bot runs on localhost:3000 for the keep-alive server (backend only)
- This is a backend service with no frontend component
- The bot will not start if any required environment variables are missing
