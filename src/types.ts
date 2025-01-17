import { DarkPool } from "@thesingularitynetwork/singularity-sdk"
import { Signer } from "ethers"

export enum ChainId {
    HARDHAT = 31337,
    HARDHAT_ARBITRUM = 31338,
    HARDHAT_BASE = 31339,
    MAINNET = 1,
    SEPOLIA = 11155111,
    ARBITRUM_ONE = 42161,
    BASE = 8453,
    BounceBit = 6001,
    BounceBitTestnet = 6000,
    EMCTestnet = 99876,
}

export type HexData = `0x${string}`



export type NetworkConfig = {
    priceOracle: HexData
    ethAddress: HexData
    nativeWrapper: HexData
    complianceManager: HexData
    merkleTreeOperator: HexData
    darkpoolAssetManager: HexData
    nftAssetManager: HexData
    drakpoolSubgraphUrl: string
    stakingOperator: HexData
    stakingAssetManager: HexData
    sablierDynamicAssetManager: HexData
    sablierLinearAssetManager: HexData
    oTCSwapAssetManager: HexData
    batchJoinSplitAssetManager: HexData
    darkPoolSwapAssetManager: HexData

    explorerUrl: {
        tx: string
        address: string
        block: string
    }
}

export type RelayerInfo = {
    relayerName: string
    relayerAddress: HexData
    hostUrl: string
}


export enum OrderDirection {
    BUY = 0,
    SELL = 1
}

export enum NoteStatus {
    ACTIVE = 0,
    CREATED = 3,
    SPENT = 4,
    LOCKED = 5,
}