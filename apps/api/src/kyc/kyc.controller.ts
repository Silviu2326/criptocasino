import { Controller, Get, Post, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KycService } from './kyc.service';

@ApiTags('KYC')
@Controller('kyc')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get KYC status' })
  @ApiResponse({ status: 200, description: 'KYC status retrieved successfully' })
  async getStatus(@Req() req: any) {
    return this.kycService.getKycStatus(req.user.id);
  }

  @Post('submit')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Submit KYC document' })
  @ApiResponse({ status: 201, description: 'Document submitted successfully' })
  async submitDocument(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.kycService.submitDocument(req.user.id, 'PASSPORT', file);
  }
}