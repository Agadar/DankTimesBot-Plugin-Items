import { Chat } from "../../src/chat/chat";
import { Item } from "./item";

export class ChatShop {

    public readonly inventory: Item[] = new Array<Item>();

    private lastMedian: number;

    constructor(private readonly chat: Chat) {
        
    }

    public updatePrices(): void {
        
    }
}
