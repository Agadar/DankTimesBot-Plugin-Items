import { ChatEquipmentManager } from "./chat/chat-equipment-manager";
import { ChatInventoryManager } from "./chat/chat-inventory-manager";
import { ChatItemsData } from "./chat/chat-items-data";
import { Item } from "./item/item";

export class FileIOHelper {

    private static readonly ITEMS_CHATS_DATA_FILE = "items-chats-data.json";

    constructor(
        private readonly loadDataFromFile: (fileName: string) => any,
        private readonly saveDataToFile: (fileName: string, data: any) => void) { }

    public loadData(): Map<number, ChatItemsData> {
        const rawChatsItemsData: any[] = this.loadDataFromFile(FileIOHelper.ITEMS_CHATS_DATA_FILE);
        const chatsItemsData = new Map<number, ChatItemsData>();

        if (!rawChatsItemsData) {
            console.log(`No ${FileIOHelper.ITEMS_CHATS_DATA_FILE} loaded, starting fresh`);
        } else {
            rawChatsItemsData.forEach(raw => {
                const shopInventory = this.parseRawItems(raw.shopInventory);
                const inventoryManager = this.parseRawInventoryManager(raw.inventoryManager);
                const equipmentManager = this.parseRawEquipmentManager(raw.equipmentManager);
                const data = new ChatItemsData(raw.chatId, inventoryManager, equipmentManager, shopInventory, raw.scoreMedian);
                chatsItemsData.set(data.chatId, data);
            });
        }
        return chatsItemsData;
    }

    public persistData(chatsItemsData: Map<number, ChatItemsData>): void {
        this.saveDataToFile(FileIOHelper.ITEMS_CHATS_DATA_FILE, chatsItemsData);
    }

    private parseRawItems(rawItems?: any): Item[] {
        return rawItems?.map((raw) => new Item(raw.prototypeId, raw.stackSize)) ?? [];
    }

    private parseRawInventoryManager(inventoryManager?: any): ChatInventoryManager {
        const inventories = new Map<number, Item[]>();
        inventoryManager?.forEach(raw => {
            const items = this.parseRawItems(raw.inventory);
            inventories.set(raw.userId, items);
        });
        return new ChatInventoryManager(inventories);
    }

    private parseRawEquipmentManager(equipmentManager?: any): ChatEquipmentManager {
        const equipments = new Map<number, Item[]>();
        equipmentManager?.forEach(raw => {
            const items = this.parseRawItems(raw.equipment);
            equipments.set(raw.userId, items);
        });
        return new ChatEquipmentManager(equipments);
    }
}