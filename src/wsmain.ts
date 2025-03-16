import { WebSocket } from 'ws';
import { ConfigLoader } from './utils/configUtil';
import { SettlementService } from './settlement/settlement.service';
import { AssetPairService } from './common/assetPair.service';
import { OrderService } from './orders/order.service';


enum EventType {
    OrderMatched = 1,
    OrderConfirmed = 2,
    OrderSettled = 3,
    AssetPairCreated = 4,
    orderCancelled = 5,
    Unknown = 0
}

export function startWebSocket() {
    const booknodeUrl = ConfigLoader.getInstance().getConfig().bookNodeSocketUrl;

    if (!booknodeUrl) {
        throw new Error('BOOKNODE_URL is not set');
    }

    let ws: WebSocket;

    const connect = () => {
        ws = new WebSocket(booknodeUrl);

        ws.on('open', () => {
            console.log('Connected to BookNode server');
            const authMessage = JSON.stringify({
                type: 'auth',
                token: ConfigLoader.getInstance().getConfig().bookNodeApiKey
            });

            ws.send(authMessage);
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
            reconnect();
        });

        ws.on('close', () => {
            console.log('Disconnected from BookNode server');
            reconnect();
        });

        ws.on('message', async (data) => {
            try {
                const settlementService = SettlementService.getInstance();
                const assetPairService = AssetPairService.getInstance();
                const notificationEvent = JSON.parse(data.toString());
                const orderService = OrderService.getInstance();

                switch (notificationEvent.eventType) {
                    case EventType.OrderMatched:
                        console.log('Event for order matched: ', notificationEvent.orderId);
                        await settlementService.takerConfirm(notificationEvent.orderId);
                        break;
                    case EventType.OrderConfirmed:
                        console.log('Event for order confirmed: ', notificationEvent.orderId);
                        await settlementService.makerSwap(notificationEvent.orderId);
                        break;
                    case EventType.OrderSettled:
                        console.log('Event for order settled: ', notificationEvent.orderId);
                        await settlementService.takerPostSettlement(notificationEvent.orderId, notificationEvent.txHash || '');
                        break;
                    case EventType.AssetPairCreated:
                        await assetPairService.syncAssetPair(notificationEvent.assetPairId, notificationEvent.chainId);
                        break;
                    case EventType.orderCancelled:
                        await orderService.cancelOrderByNotificaion(notificationEvent.orderId);
                        break;
                    default:
                        console.log('Unknown event:', notificationEvent);
                        break;
                }
            } catch (error) {
                console.log(error.stack, error.message);
                console.error('Invalid message:', data.toString());
            }
        });
    };

    const reconnect = () => {
        console.log('Attempting to reconnect...');
        setTimeout(connect, 10000);
    };

    connect();
}