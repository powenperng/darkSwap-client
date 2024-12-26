import { DarkPool } from "@thesingularitynetwork/singularity-sdk"
import { Signer } from "ethers"
import { getDarkPool } from "src/utils/darkpool"
import RpcManager from "src/utils/rpcManager"

export class DarkpoolContext {
    chainId: number
    signer: Signer
    walletAddress: string
    darkPool: DarkPool
    signature: string
  
  constructor(chain: number, wallet: string) {
    this.chainId = chain
    this.walletAddress = wallet
    this.signer = RpcManager.getInstance().getSigner(wallet, chain)
    this.darkPool = getDarkPool(chain, this.signer)
  }
} 