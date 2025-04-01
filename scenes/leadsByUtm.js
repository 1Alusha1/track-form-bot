import { Scenes } from "telegraf";

export default function leadsByUtm() {
  const scene = new Scenes.BaseScene("leadsByUtm");

  scene.enter(async (ctx) => {
    try {
      const response = await fetch(`${process.env.API_URI}/get-leads-by-utm`);

      const data = await response.json();

      if (data.records.length) {
        let sum = data.records.reduce((acc, item) => {
          acc += item.count;
          return acc;
        }, 0);

        const display = data.records.reduce((acc, lead) => {
          acc += `
<b>Общее количество кликов, на рекламы</b>
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
