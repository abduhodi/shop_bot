import { Hears, On, Scene } from 'nestjs-telegraf';
import { Keyboard } from '../../enums/keyboard.enums';
import { Context } from 'telegraf';
import { UsersService } from '../../users/user.service';
import { UserStates } from '../user/states/user.state';
import { userHomeButton } from '../user/buttons/user-home.button';

@Scene(UserStates.register)
export class UserRegisterPageStage {
  constructor(private readonly userService: UsersService) {}

  @Hears(Keyboard.register)
  async startRegisterUser(ctx: Context) {
    await ctx.reply('Iltimos telefon raqamingizni contact tarzida yuboring', {
      reply_markup: {
        keyboard: [[{ text: 'Contactni yuborish', request_contact: true }]],
        resize_keyboard: true,
      },
    });
  }

  @On('contact')
  async saveContact(ctx: Context) {
    if ('contact' in ctx.message) {
      const phoneNumber = ctx.message.contact.phone_number;
      const user = ctx.message.from;
      if (ctx.message.contact.user_id !== user.id) {
        await ctx.reply("O'zingizni contactingizni yuboring");
        return;
      }

      await this.userService.createUser({
        userId: user.id,
        isBot: user.is_bot,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        phoneNumber,
      });
      await ctx.reply('✅Saved', userHomeButton);
      //@ts-ignore
      ctx.session.button = userHomeButton;
      //@ts-ignore
      ctx.session.mainPage = UserStates.main;
      //@ts-ignore
      await ctx.scene.enter(UserStates.main);
    }
  }

  @On('message')
  async Message(ctx: any) {}
}
