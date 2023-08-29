import { Ctx, Help, Start, Update } from 'nestjs-telegraf';
import { AdminsService } from '../../admins/admins.service';
import { Context } from 'telegraf';
import { UsersService } from '../../users/user.service';

@Update()
export class CommandHandlers {
  constructor(
    private adminService: AdminsService,
    private userService: UsersService,
  ) {}

  @Start()
  start(@Ctx() ctx: Context) {
    //@ts-ignore
    ctx.session.user = ctx.from.id;
    if (ctx.from.id === +process.env.BOT_ADMIN_1) {
      return this.adminService.start(ctx);
    }
    return this.userService.start(ctx);
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.reply('help command');
  }
}
