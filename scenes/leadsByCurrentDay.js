import { Scenes } from "telegraf";

export default function leadsByCurrentDay() {
  const scene = new Scenes.BaseScene("leadsByCurrentDay");

  scene.enter(async (ctx) => {
    try {
      const date = new Date();
      const fd = new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);

      const response = await fetch(
        `${process.env.API_URI}/get-leads-current-day`
      );
      const data = await response.json();

      if (data.records.length) {
        await ctx.replyWithHTML(
          `Общее количество кликов за ${fd} - ${data.count}шт`
        );
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
