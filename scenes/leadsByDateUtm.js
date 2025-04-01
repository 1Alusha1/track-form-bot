import { Scenes } from "telegraf";

export default function leadsByDateUtm() {
  const scene = new Scenes.BaseScene("leadsByDateUtm");

  scene.enter(async (ctx) => {
    await ctx.reply("Enter date");
  });

  scene.on("text", async (ctx) => {
    const date = String(ctx.message.text);

    console.log(date);

    try {
      const response = await fetch(
        `${process.env.API_URI}/get-leads-by-date-utm`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ date }),
        }
      );

      const data = await response.json();

      if (data.records.length) {
        let sum = data.records.reduce((acc, item) => {
          acc += item.count;
          return acc;
        }, 0);

        const display = data.records.reduce((acc, lead) => {
          acc += `
<b>Название рекламы</b>: ${lead.name}. <b>Количество кликов</b>: ${lead.count}
          `;
          return acc;
        }, "");

        await ctx.replyWithHTML(`
${display}\n
<b>Сумма кликов</b>: ${sum}
            `);
        await ctx.scene.leave();
      } else {
        await ctx.scene.leave();
      }
    } catch (err) {
      await ctx.reply("not ok");
      await ctx.scene.leave();
    }
  });

  return scene;
}
