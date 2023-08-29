import { Markup } from 'telegraf';
import { Keyboard } from '../../../enums/keyboard.enums';

export const adminHomeButton = {
  parse_mode: 'HTML',
  ...Markup.keyboard([
    [Markup.button.text(Keyboard.addProduct)],
    [Markup.button.text(Keyboard.seeProducts)],
  ])
    .oneTime()
    .resize(),
};
