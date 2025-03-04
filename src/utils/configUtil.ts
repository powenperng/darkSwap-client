import { join } from "path";
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { z } from 'zod';

import { ConfigSchema, Config } from './configValidator';
import { ethers } from "ethers";

export class ConfigLoader {
    private config: Config;
    private static instance: ConfigLoader;

    constructor() {
        this.loadConfig();
    }

    private loadConfig() {
        try {
            const configPath = process.env.NODE_ENV === 'dev' ? './config.yaml' : '/data/config.yaml';

            const fileContent = fs.readFileSync(configPath, 'utf8');
            this.config = yaml.load(fileContent);

            const parsedConfig = ConfigSchema.parse(this.config);

            if (parsedConfig.userSwapRelayerPrivateKey) {
                if (!parsedConfig.userSwapRelayerAddress || !ethers.isAddress(parsedConfig.userSwapRelayerAddress)) {
                    throw new Error("User swap relayer address and privatekey is not valid");
                }

                const wallet = new ethers.Wallet(parsedConfig.userSwapRelayerPrivateKey);
                if (wallet.address.toLowerCase() != parsedConfig.userSwapRelayerAddress.toLowerCase()) {
                    throw new Error("User swap relayer address is not aligned with privatekey");
                }
            }

            this.config = parsedConfig;

        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Failed to validate configuration:', error.errors);
            } else {
                console.error('Failed to load configuration:', error);
            }
            process.exit(1);
        }
    }

    public static getInstance(): ConfigLoader {
        if (!ConfigLoader.instance) {
            ConfigLoader.instance = new ConfigLoader();
        }
        return ConfigLoader.instance;
    }

    public getConfig() {
        return this.config;
    }

    public getWallets() {
        return this.config.wallets || [];
    }
}