import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@Req() req: any) {
    return this.usersService.getUserProfile(req.user.id);
  }

  @Get('balances')
  @ApiOperation({ summary: 'Get user balances' })
  @ApiResponse({ status: 200, description: 'User balances retrieved successfully' })
  async getBalances(@Req() req: any) {
    return this.usersService.getUserBalances(req.user.id);
  }
}