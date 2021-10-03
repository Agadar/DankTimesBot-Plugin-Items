import { AlterUserScoreArgs } from "../../../../src/chat/alter-user-score-args";
import { AbstractItemPack } from "../../abstract-item-pack";
import { ChatItemsData } from "../../chat/chat-items-data";
import { Item } from "../../item/item";
import { ItemProtoType } from "../../item/item-prototype";
import { RpgEquipment } from "./rpg-equipment";

export class RPGEquipmentItemPack extends AbstractItemPack {

    private readonly numberOfItemsInShop = 5;

    private readonly relentlessLongsword = new RpgEquipment(1000, "Longsword", 0.25, 0.125, "🗡️",
        "Increases normal dank time points", ["Main Hand"], AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
        AlterUserScoreArgs.NORMAL_DANKTIME_REASON, 1.1);

    private readonly protoTypes = [ this.relentlessLongsword ];

    constructor() {
        super("RpgEquipmentItemPack");
    }

    /**
     * From AbstractItemPack.
     */
    public itemProtoTypes(): ItemProtoType[] {
        return this.protoTypes;
    }

    /**
     * From AbstractItemPack.
     */
    public onChatInitialisation(chatItemsData: ChatItemsData): void {
        const swords = new Item(this.relentlessLongsword.id, 2);
        chatItemsData.shopInventory.push(swords);
    }

    /**
     * From AbstractItemPack.
     */
    public OnNightlyUpdate(chatItemsData: ChatItemsData): void {
        // TODO.
     }
}
