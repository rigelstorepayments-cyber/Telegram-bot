const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on('chat_join_request', async (ctx) => {
  try {
    const chatId = ctx.chatJoinRequest.chat.id;
    const userId = ctx.chatJoinRequest.from.id;

    await ctx.telegram.approveChatJoinRequest(chatId, userId);

    console.log(`Approved join request for user ${userId} in chat ${chatId}`);
  } catch (error) {
    console.error('Error approving join request:', error);
  }
});

bot.launch().then(() => {
  console.log('Bot started!');
});
