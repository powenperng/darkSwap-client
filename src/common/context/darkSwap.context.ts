import { DarkSwap } from "@thesingularitynetwork/darkswap-sdk"
import { getAddress, Signer } from "ethers"
import { getDarkSwap } from "../../utils/darkSwap"
import RpcManager from "../../utils/rpcManager"

export class DarkSwapContext {
    chainId: number
    signer: Signer
    walletAddress: string
    publicKey: string
    darkSwap: DarkSwap
    relayerDarkSwap: DarkSwap
    relayerAddress: string
    signature: string

    private constructor(chain: number, wallet: string, signer: Signer, pubKey: string, darkSwap: DarkSwap, relayerDarkSwap: DarkSwap, relayerAddress: string, signature: string) {
        this.chainId = chain
        this.walletAddress = wallet
        this.signer = signer
        this.publicKey = pubKey
        this.darkSwap = darkSwap
        this.relayerDarkSwap = relayerDarkSwap
        this.relayerAddress = relayerAddress
        this.signature = signature
    }

    static async createDarkSwapContext(chain: number, walletIn: string) {
        const wallet = getAddress(walletIn.toLowerCase());
        const [signer, pubKey] = RpcManager.getInstance().getSignerAndPublicKey(wallet, chain)
        const relayerSigner = RpcManager.getInstance().getSignerForUserSwapRelayer(chain)
        const relayerAddress = relayerSigner ? await relayerSigner.getAddress() : wallet

        const darkSwap = getDarkSwap(chain, signer)
        const relayerDarkSwap = relayerSigner ? getDarkSwap(chain, relayerSigner) : darkSwap

        const domain = {
            name: "SingularityDarkSwapClientServer",
            version: "1",
        };

        const types = {
            Message: [
                { name: "wallet", type: "string" },
                { name: "content", type: "string" },
            ],
        };

        const value = {
            wallet: wallet,
            content: "Please sign this message to create your own Zero Knowledge proof key-pair. This doesn't cost you anything and is free of any gas fees.",
        };

        const signature = await signer.signTypedData(domain, types, value);
        return new DarkSwapContext(chain, wallet, signer, pubKey, darkSwap, relayerDarkSwap, relayerAddress.toLowerCase(), signature)
    }
} 