import { networkConfig } from "../config/networkConfig";

export class SubgraphService {
    private static instance: SubgraphService;

    public static getInstance(): SubgraphService {
        if (!SubgraphService.instance) {
            SubgraphService.instance = new SubgraphService();
        }
        return SubgraphService.instance;
    }


    async getSwapTxByNullifiers(chainId: number, aliceNullifier: string, bobNullifier: string): Promise<{ txHash: string, aliceInNote: string }> {
        const query = `
            query findSwapByNullifiers{
                darkSwaps(where: {aliceOutNullifierIn: "${aliceNullifier}", bobOutNullifierIn: "${bobNullifier}"}) {
                    aliceOutNullifierIn
                    bobOutNullifierIn
                    bobInNote
                    aliceInNote
                    transactionHash
                }
            }
        `;

        const response = await fetch(networkConfig[chainId].drakSwapSubgraphUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();

        if (!data || !data.data || !data.data.darkPoolSwaps || data.data.darkPoolSwaps.length === 0) {
            return null;
        }

        return {
            txHash: data.data.darkPoolSwaps[0].transactionHash,
            aliceInNote: data.data.darkPoolSwaps[0].aliceInNote,
        };
    }
}