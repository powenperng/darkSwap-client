import { Injectable } from '@nestjs/common';
import * as ethers from 'ethers';

@Injectable()
export class WalletService {
  private wallets: { [key: string]: string };

  constructor() {
    this.wallets = this.loadWallets();
  }

  private loadWallets(): { [key: string]: string } {
    const walletsConfig = process.env.WALLETS || '';
    const walletsArray = walletsConfig.split(',').map(wallet => wallet.trim());
    const wallets: { [key: string]: string } = {};

    walletsArray.forEach(privateKey => {
      const wallet = new ethers.Wallet(privateKey);
      const address = wallet.address;
      wallets[address] = privateKey;
    });

    return wallets;
  }

  getPrivateKey(walletAddress: string): string {
    return this.wallets[walletAddress];
  }
}