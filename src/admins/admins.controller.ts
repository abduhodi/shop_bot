import { Controller, Get } from '@nestjs/common';
import { AdminsService } from './admins.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminsService) {}

  @Get('dashboard')
  async renderAdminDashboard() {}
}
