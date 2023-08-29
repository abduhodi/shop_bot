import { Module } from '@nestjs/common';
import { CommandHandlers } from './command.handler';
import { AdminsModule } from '../../admins/admins.module';
import { UsersModule } from '../../users/user.module';

@Module({
  imports: [AdminsModule, UsersModule],
  providers: [CommandHandlers],
  exports: [],
})
export class HandlersModule {}
