require('dotenv').config();

const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const ALLOWED_CHAT_IDS = process.env.ALLOWED_CHAT_IDS.split(',').map(id => Number(id.trim()));

bot.on('chat_join_request', async (ctx) => {
  try {
    const chatId = ctx.chatJoinRequest.chat.id;
    const userId = ctx.chatJoinRequest.from.id;

    if (ALLOWED_CHAT_IDS.includes(chatId)) {
      await ctx.telegram.approveChatJoinRequest(chatId, userId);
      console.log(`Approved join request for user ${userId} in chat ${chatId}`);
    } else {
      console.log(`Ignored join request for user ${userId} in unauthorized chat ${chatId}`);
    }
  } catch (error) {
    console.error('Error approving join request:', error);
  }
});

bot.launch().then(() => {
  console.log('Bot started!');
});
