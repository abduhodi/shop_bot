export const logger = (ctx: any, next: any) => {
  console.log(ctx);
  next();
};

export const skipUpdates = (ctx: any, next: any) => {
  if (+(new Date().getTime() / 1000).toFixed(0) - 3 > ctx.update.message.date)
    return;
  next();
};
