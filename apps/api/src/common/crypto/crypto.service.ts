import { Injectable, Inject } from '@nestjs/common';
import * as sodium from 'libsodium-wrappers';
import { createHash, createHmac, randomBytes } from 'crypto';
import { AppConfig } from '@crypto-casino/config';

@Injectable()
export class CryptoService {
  private encryptionKey: Buffer;

  constructor(@Inject('CONFIG') private config: AppConfig) {
    this.encryptionKey = Buffer.from(config.security.encryptionKey, 'hex');
  }

  async onModuleInit() {
    await sodium.ready;
  }

  encrypt(data: string): string {
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    const ciphertext = sodium.crypto_secretbox_easy(data, nonce, this.encryptionKey);
    
    return Buffer.concat([
      nonce,
      ciphertext
    ]).toString('base64');
  }

  decrypt(encryptedData: string): string {
    const data = Buffer.from(encryptedData, 'base64');
    const nonce = data.slice(0, sodium.crypto_secretbox_NONCEBYTES);
    const ciphertext = data.slice(sodium.crypto_secretbox_NONCEBYTES);
    
    const decrypted = sodium.crypto_secretbox_open_easy(ciphertext, nonce, this.encryptionKey);
    return Buffer.from(decrypted).toString();
  }

  hashWithSalt(data: string): { hash: string; salt: string } {
    const salt = randomBytes(32).toString('hex');
    const hash = createHash('sha256').update(data + salt).digest('hex');
    
    return { hash, salt };
  }

  verifyHash(data: string, hash: string, salt: string): boolean {
    const computedHash = createHash('sha256').update(data + salt).digest('hex');
    return computedHash === hash;
  }

  generateProvablyFairResult(serverSeed: string, clientSeed: string, nonce: number): string {
    const message = `${clientSeed}:${nonce}`;
    return createHmac('sha256', serverSeed).update(message).digest('hex');
  }

  generateServerSeed(): string {
    return randomBytes(32).toString('hex');
  }

  hashServerSeed(serverSeed: string): string {
    return createHash('sha256').update(serverSeed).digest('hex');
  }

  verifyProvablyFairResult(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    expectedResult: string
  ): boolean {
    const computedResult = this.generateProvablyFairResult(serverSeed, clientSeed, nonce);
    return computedResult === expectedResult;
  }

  convertHexToDecimal(hex: string, decimals: number = 8): number {
    // Take first 8 characters for precision
    const slice = hex.slice(0, decimals);
    const decimal = parseInt(slice, 16);
    const max = Math.pow(16, decimals);
    
    return decimal / max;
  }

  generateClientSeed(): string {
    return randomBytes(16).toString('hex');
  }
}