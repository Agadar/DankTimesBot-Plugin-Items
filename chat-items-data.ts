import { ChatInventoryManager } from "./chat-inventory-manager";
import { Item } from "./item";

export class ChatItemsData {

    constructor(
        public readonly chatId: number,
        public readonly inventoryManager = new ChatInventoryManager(),
        public readonly shopInventory = new Array<Item>(),
        public scoreMedian = 0) { }
}