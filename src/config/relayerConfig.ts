import { ChainId, HexData, RelayerInfo } from "../types";
import { ConfigLoader } from "../utils/configUtil";

const parseEnvRelayerConfig = () => {
  const customConfig: { [chainId: number]: RelayerInfo[] } = {};
  
  const relayers = ConfigLoader.getInstance().getConfig().singularityRelayers;

  relayers.forEach((relayer: { chainId: number, relayerName: string, relayerAddress: string, hostUrl: string }) => {
    if (!customConfig[relayer.chainId]) {
      customConfig[relayer.chainId] = [];
    }
    customConfig[relayer.chainId].push({
      relayerName: relayer.relayerName,
      relayerAddress: relayer.relayerAddress as HexData,
      hostUrl: relayer.hostUrl,
    });
  });

  return customConfig;
};

const defaultConfig: { [chainId: number]: RelayerInfo[] } = {
    [ChainId.MAINNET]: [
        {
            relayerName: 'Singularity Prod Relayer Mainnet 1',
            relayerAddress: '0x5cCc2130e77aE3a3211740C2e897bFBB5D70aA54',
            hostUrl: 'https://eth.rlb.thesingularity.network',
        },
    ],
    [ChainId.ARBITRUM_ONE]: [
        {
            relayerName: 'Singularity Prod Relayer Arbitrum 1',
            relayerAddress: '0x5cCc2130e77aE3a3211740C2e897bFBB5D70aA54',
            hostUrl: 'https://arb.rlb.thesingularity.network',
        },
    ],
    [ChainId.BounceBit]: [
        {
            relayerName: 'Singularity Prod Relayer BounceBit 1',
            relayerAddress: '0x5cCc2130e77aE3a3211740C2e897bFBB5D70aA54',
            hostUrl: 'https://bb.rlb.thesingularity.network',
        },
    ],
    [ChainId.BASE]: [
        {
            relayerName: 'Singularity Prod Relayer Base 1',
            relayerAddress: '0x5cCc2130e77aE3a3211740C2e897bFBB5D70aA54',
            hostUrl: 'https://base.rlb.thesingularity.network',
        },
    ],
    [ChainId.SEPOLIA]: [
        {
            relayerName: 'Singularity Prod Relayer Sepolia 1',
            relayerAddress: '0x0A20B38894799fD27837aF3Ed8929E7b8d1dDDe7',
            hostUrl: 'https://sepolia.rlb.thesingularity.network',
        },
    ],
    [ChainId.HARDHAT]: [
        {
            relayerName: 'Hardhat Relayer',
            relayerAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            hostUrl: 'https://app.dev.portalgate.me:18000',
        },
    ],
    [ChainId.HARDHAT_ARBITRUM]: [
        {
            relayerName: 'Hardhat Arbitrum Relayer',
            relayerAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            hostUrl: 'https://app.dev.portalgate.me:38000',
        },
    ]
}

export const relayerConfig: { [chainId: number]: RelayerInfo[] } = {
  ...defaultConfig,
  ...parseEnvRelayerConfig()
};