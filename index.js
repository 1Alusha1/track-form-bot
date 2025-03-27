import express from 'express';
import { Telegraf } from 'telegraf';
import { config } from 'dotenv';
config();

const app = express();

const bot = new Telegraf(process.env.TOKEN);

bot.start(async (ctx) => {
  const userId = ctx.message.from.id;
  const first_name = ctx.message.from.first_name;
  const username = ctx.message.from.username;

  try {
    const getResponse = await fetch(
      `${process.env.API_URI}/get-user/${userId}`
    );
    const getData = await getResponse.json();
    
    if (getData.record) {
      return await ctx.reply("You've already registered");
    }

    const createResponse = await fetch(`${process.env.API_URI}/register-user`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ userId, first_name, username }),
    });
    const createData = await createResponse.json();

    if (createData.message === 'User record has got successfully created') {
      return await ctx.reply("You're successfully registered");
    }
  } catch (err) {
    console.log(err);
    return await ctx.reply('Error while registering user');
  }
});

app.post('/webhook', express.json(), (req, res) => {
  bot.handleUpdate(req.body, res);
  res.send('OK');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  bot.launch();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
