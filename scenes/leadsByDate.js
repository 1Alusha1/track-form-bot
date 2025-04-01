import { Scenes } from "telegraf";

export default function leadsByDate() {
  const scene = new Scenes.BaseScene("leadsByDate");

  scene.enter(async (ctx) => {
    await ctx.reply("Enter date");
  });

  scene.on("text", async (ctx) => {
    const date = String(ctx.message.text);

    try {
      const response = await fetch(`${process.env.API_URI}/get-leads-by-date`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ date }),
      });

      const { records, count } = await response.json();

      if (records.length) {
        

        await ctx.reply(`Общее количество кликов за ${date} - ${count}шт`);
        await ctx.scene.leave();
      } else {
        await ctx.reply(count);
        await ctx.scene.leave();
      }
    } catch (err) {
      await ctx.reply("not ok");
      await ctx.scene.leave();
    }
  });

  return scene;
}
