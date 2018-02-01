const Telegraf = require("telegraf");
const {getLeavesStats, getMeme, wiriteLeave} = require('./leaves');

const token = process.env.TOKEN;
const host = process.env.HOST;
const port = process.env.PORT || 8443;

const bot = new Telegraf(token);

bot.on('left_chat_member', async (ctx) => {
  const chatId = ctx.chat.id;

  await wiriteLeave(chatId);

  ctx.replyWithPhoto({
    source: getMeme()
  })
});

bot.hears(/\/leave_stats(@\w+)?/, async (ctx) => {
  const chatId = ctx.chat.id;
  const date = await getLeavesStats(chatId);
  const daysWithoutLeaves = parseInt((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 *24));

  ctx.reply(`Days without leaves: ${daysWithoutLeaves}`);
});

bot.telegram.setWebhook(host);
bot.startWebhook("/", null, port);