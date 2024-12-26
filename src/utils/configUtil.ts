import path from "path";
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { z } from 'zod';

import { ConfigSchema, Config } from './configValidator';

export class ConfigLoader {
    private config: Config;
    private static instance: ConfigLoader;


    private loadConfig() {
        try {
            const configPath = process.env.CONFIG_PATH ||
                path.join(process.cwd(), 'config', 'config.yaml');

            const fileContent = fs.readFileSync(configPath, 'utf8');
            this.config = yaml.load(fileContent);

            const parsedConfig = ConfigSchema.parse(this.config);
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

    public reloadConfig() {
        this.loadConfig();
    }
}