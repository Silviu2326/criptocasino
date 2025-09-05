import { Injectable, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AppConfig } from '@crypto-casino/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(@Inject('CONFIG') private config: AppConfig) {
    this.transporter = nodemailer.createTransporter({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: config.email.auth,
    });
  }

  async sendMagicLinkEmail(to: string, magicLink: string): Promise<void> {
    const mailOptions = {
      from: this.config.email.from,
      to,
      subject: 'Your Magic Link - Crypto Casino',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to Crypto Casino</h1>
          <p>Click the button below to sign in to your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Sign In
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 15 minutes for security reasons.
            If you didn't request this email, please ignore it.
          </p>
          <p style="color: #666; font-size: 14px;">
            You can also copy and paste this URL into your browser:<br>
            ${magicLink}
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendKycStatusEmail(to: string, status: string, reason?: string): Promise<void> {
    const subject = status === 'VERIFIED' 
      ? 'KYC Verification Approved' 
      : 'KYC Verification Update';
    
    const statusMessage = status === 'VERIFIED'
      ? 'Your identity verification has been approved!'
      : status === 'REJECTED'
      ? 'Your identity verification requires attention.'
      : 'Your identity verification is being reviewed.';

    const mailOptions = {
      from: this.config.email.from,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">KYC Status Update</h1>
          <p>${statusMessage}</p>
          ${reason ? `<p><strong>Details:</strong> ${reason}</p>` : ''}
          <p>
            <a href="${this.config.frontendUrl}/profile" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              View Profile
            </a>
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWithdrawalNotification(to: string, amount: string, currency: string, status: string): Promise<void> {
    const subject = `Withdrawal ${status} - ${amount} ${currency}`;
    
    const mailOptions = {
      from: this.config.email.from,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Withdrawal Update</h1>
          <p>Your withdrawal request for <strong>${amount} ${currency}</strong> has been <strong>${status.toLowerCase()}</strong>.</p>
          <p>
            <a href="${this.config.frontendUrl}/transactions" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              View Transactions
            </a>
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}