import { ChatItemsData } from "./chat/chat-items-data";
import { ItemProtoType } from "./item/item-prototype";

/**
 * The interface to which item packs should adhere.
 */
export abstract class AbstractItemPack {

    /**
     * Constructor.
     * @param name The name of this item pack.
     */
    constructor(public name: string) {}

    /**
     * The item prototypes this pack wants to add to the plugin.
     */
    public itemProtoTypes(): ItemProtoType[] {
        return [];
    }

    /**
     * What to do during chat initialisation. Allows this pack to for example add
     * initial items to the shop.
     */
    public onChatInitialisation(chatItemsData: ChatItemsData): void {
        // No behavior by default.
    }

    /**
     * What to do on the hourly tick. Allows this pack to for example alter the
     * items in the shop or players' inventories.
     */
    public OnHourlyTick(chatItemsData: ChatItemsData): void {
        // No behavior by default.
    }

    /**
     * What to do on the nightly update. Allows this pack to for example alter the
     * items in the shop or players' inventories.
     */
    public OnNightlyUpdate(chatItemsData: ChatItemsData): void {
        // No behavior by default.
    }
}
