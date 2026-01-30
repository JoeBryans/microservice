import { subscribeAuthEvents } from "./auth.subscrib";
import { subscribeShopEvents } from "./shop.subscrib";

export const EventSubscriber = async () => {
    await subscribeAuthEvents();
    await subscribeShopEvents();
}