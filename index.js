import express from "express";
import { Telegraf } from "telegraf";
import { config } from "dotenv";
import UserSchema from "./models/User.js";
import db from "./db.js";
config();

// Инициализируем Express
const app = express();

// Инициализируем Telegraf
const bot = new Telegraf(process.env.TOKEN);

// Подключаемся к базе данных
db().catch((err) => console.log(err));

// Обработчик команды /start
bot.start(async (ctx) => {
  const userId = ctx.message.from.id;
  const first_name = ctx.message.from.first_name;
  const username = ctx.message.from.username;

  try {
    const user = await UserSchema.findOne({ userId });

    if (user) {
      return await ctx.reply("You've already registered");
    }

    await new UserSchema({ userId, first_name, username }).save();
    await ctx.reply("You're successfully registered");
  } catch (err) {
    console.log(err);
    return await ctx.reply("Error while registering user");
  }
});

// Настройка вебхука для Telegram
app.post("/webhook", express.json(), (req, res) => {
  bot.handleUpdate(req.body, res); // Обрабатываем обновления от Telegram
  res.send("OK");
});

// Простой health check для Cloud Run
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Настроим прослушку порта, который нужен для Cloud Run
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  bot.launch(); // Запуск бота
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
