import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class KycService {
  constructor(private prisma: PrismaService) {}

  async getKycStatus(userId: string): Promise<any> {
    const kycCase = await this.prisma.kycCase.findUnique({
      where: { userId },
      include: { documents: true },
    });

    return kycCase || { status: 'UNVERIFIED', documents: [] };
  }

  async submitDocument(userId: string, documentType: string, file: any): Promise<any> {
    // Mock implementation
    const document = await this.prisma.kycDocument.create({
      data: {
        userId,
        type: documentType as any,
        filename: file.filename || 'mock-file.jpg',
        originalName: file.originalname || 'document.jpg',
        mimeType: file.mimetype || 'image/jpeg',
        size: file.size || 1024,
        s3Key: `kyc/${userId}/${Date.now()}-${file.filename}`,
        status: 'PENDING',
      },
    });

    return {
      id: document.id,
      type: document.type,
      status: document.status,
      uploadedAt: document.uploadedAt.toISOString(),
    };
  }
}