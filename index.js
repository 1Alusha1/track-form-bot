import { Telegraf, Scenes, session } from "telegraf";
import { config } from "dotenv";
import commands from "./commands.js";
import leadsByDate from "./scenes/leadsByDate.js";
import leadsByDateUtm from "./scenes/leadsByDateUtm.js";
import leadsByCurrentDay from "./scenes/leadsByCurrentDay.js";
import leadsByUtm from "./scenes/leadsByUtm.js";
config();

const stage = new Scenes.Stage([
  leadsByDate(),
  leadsByDateUtm(),
  leadsByCurrentDay(),
  leadsByUtm(),
]);

const bot = new Telegraf(process.env.TOKEN);

bot.use(session());
bot.use(stage.middleware());

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
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ userId, first_name, username }),
    });
    const createData = await createResponse.json();

    if (createData.message === "User record has got successfully created") {
      return await ctx.reply("You're successfully registered");
    }
  } catch (err) {
    console.log(err);
    return await ctx.reply("Error while registering user");
  }
});

bot.help(async (ctx) => {
  ctx.replyWithHTML(`
      <b>Available comands:</b>
${commands.join("\n")}
    `);
});

bot.command("leadsByDate", async (ctx) => await ctx.scene.enter("leadsByDate"));
bot.command(
  "leadsByDateUtm",
  async (ctx) => await ctx.scene.enter("leadsByDateUtm")
);
bot.command(
  "leadsByDateUtm",
  async (ctx) => await ctx.scene.enter("leadsByDateUtm")
);
bot.command(
  "leadsByCurrentDay",
  async (ctx) => await ctx.scene.enter("leadsByCurrentDay")
);

bot.command("leadsByUtm", async (ctx) => await ctx.scene.enter("leadsByUtm"));

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
