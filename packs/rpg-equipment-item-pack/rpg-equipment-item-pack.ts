import { AlterUserScoreArgs } from "../../../../src/chat/alter-user-score-args";
import { AbstractItemPack } from "../../abstract-item-pack";
import { ChatItemsData } from "../../chat/chat-items-data";
import { EquipmentSlot } from "../../item/equipment-slot";
import { Item } from "../../item/item";
import { ItemProtoType } from "../../item/item-prototype";
import { RpgEquipment } from "./rpg-equipment";

// TODO: Clean some of the mess up.
export class RPGEquipmentItemPack extends AbstractItemPack {

    private readonly pricemodifier = 200;

    private readonly oneHandedItemProtoTypes = new Array<ItemProtoType>();
    private readonly twoHandedItemProtoTypes = new Array<ItemProtoType>();
    private readonly offHandItemProtoTypes = new Array<ItemProtoType>();

    private readonly oneHandedWeapons = [
        { icon: "🗡️", name: "Longsword" },
        { icon: "🔪", name: "Dagger" },
        { icon: "🔨", name: "Mace" },
        { icon: "🪓", name: "Handaxe" },
        { icon: "⛏️", name: "Warpick" },
        { icon: "🔫", name: "Blunderbuss" },
        { icon: "🪃", name: "Boomerang" },
        { icon: "🪄", name: "Wand" },
    ];

    private readonly twoHandedWeapons = [
        { icon: "🗡️", name: "Greatsword" },
        { icon: "🏹", name: "Shortbow" },
        { icon: "🏹", name: "Longbow" },
        { icon: "🔨", name: "Maul" },
        { icon: "🪓", name: "Greataxe" },
        { icon: "⚔️", name: "Twin Blades" },
        { icon: "🔫", name: "Musket" },
    ];

    private readonly offHandItems = [
        { icon: "🔮", name: "Crystal Ball" },
        { icon: "🛡️", name: "Shield" },
        { icon: "📯", name: "Warhorn" },
    ];

    private readonly effects = [
        {
            name: "Devout", plugin: AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
            reason: AlterUserScoreArgs.NORMAL_DANKTIME_REASON, modifier: 0.05,
            description: "Increases normal dank time points received by",
        },

        {
            name: "Sentinel", plugin: AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
            reason: AlterUserScoreArgs.RANDOM_DANKTIME_REASON, modifier: 0.05,
            description: "Increases random dank time points received by",
        },

        {
            name: "Eternal", plugin: AlterUserScoreArgs.DANKTIMESBOT_ORIGIN_NAME,
            reason: AlterUserScoreArgs.HARDCOREMODE_PUNISHMENT_REASON, modifier: -0.125,
            description: "Reduces hardcore mode punishment severity by",
        },

        {
            name: "Pious", plugin: "Life", reason: "workCompleted", modifier: 0.05,
            description: "Increases points gained from working by",
        },

        {
            name: "Mastermind", plugin: "Life", reason: "crimeCommitted", modifier: 0.05,
            description: "Increases points gained from committing crimes by",
        },

        {
            name: "Succubus", plugin: "Life", reason: "bribe", modifier: -0.1,
            description: "Reduces the cost of bribes by",
        },

        {
            name: "Liberator", plugin: "Life", reason: "breakoutSucceeded", modifier: 0.1,
            description: "Increases points gained from breaking out players by",
        },

        {
            name: "Oracle", plugin: "Blackjack", reason: "winner.reward", modifier: 0.01,
            description: "Increases points gained from winning blackjack by",
        },

        {
            name: "Immortal", plugin: "Russian Roulette", reason: "bullet.in.cylinder", modifier: -0.05,
            description: "Reduces points lost from losing russian roulette by",
        },

        {
            name: "Fool-Hearted", plugin: "Russian Roulette", reason: "no.bullet.in.cylinder", modifier: 0.05,
            description: "Increases points gained from winning russian roulette by",
        },
    ];

    constructor() {
        super("RpgEquipmentItemPack");

        let oneHandedId = 1000;
        let twoHandedId = 1100;
        let offHandId = 1200;

        this.effects.forEach((effect) => {
            this.oneHandedWeapons.forEach((item) => {
                const weapon = this.createWeapon(1.25, effect, item, oneHandedId++, ["Main Hand"], [EquipmentSlot.MainHand]);
                this.oneHandedItemProtoTypes.push(weapon);
            });
            this.twoHandedWeapons.forEach((item) => {
                const weapon = this.createWeapon(2, effect, item, twoHandedId++, ["Two-Handed"], [EquipmentSlot.MainHand, EquipmentSlot.OffHand]);
                this.twoHandedItemProtoTypes.push(weapon);
            });
            this.offHandItems.forEach((item) => {
                const weapon = this.createWeapon(0.75, effect, item, offHandId++, ["Off-Hand"], [EquipmentSlot.OffHand]);
                this.offHandItemProtoTypes.push(weapon);
            });
        });
    }

    /**
     * From AbstractItemPack.
     */
    public itemProtoTypes(): ItemProtoType[] {
        return this.oneHandedItemProtoTypes.concat(this.twoHandedItemProtoTypes).concat(this.offHandItemProtoTypes);
    }

    /**
     * From AbstractItemPack.
     */
    public onChatInitialisation(chatItemsData: ChatItemsData): void {
        const prototypes = this.itemProtoTypes();

        // Remove existing equipment in shop
        for (let i = 0; i < chatItemsData.shopInventory.length; i++) {
            const item = chatItemsData.shopInventory[i];

            if (prototypes.find((prototype) => prototype.id === item.prototypeId)) {
                chatItemsData.shopInventory.splice(i, 1);
                i--;
            }
        }

        // Add equipment to shop, one of each type and one random extra
        this.addRandomEquipment(this.oneHandedItemProtoTypes, chatItemsData);
        this.addRandomEquipment(this.twoHandedItemProtoTypes, chatItemsData);
        this.addRandomEquipment(this.offHandItemProtoTypes, chatItemsData);
        const random = Math.random();

        if (random < 1 / 3) {
            this.addRandomEquipment(this.oneHandedItemProtoTypes, chatItemsData);
        } else if (random < 2 / 3) {
            this.addRandomEquipment(this.twoHandedItemProtoTypes, chatItemsData);
        } else {
            this.addRandomEquipment(this.offHandItemProtoTypes, chatItemsData);
        }
    }

    /**
     * From AbstractItemPack.
     */
    public OnNightlyUpdate(chatItemsData: ChatItemsData): void {
        this.onChatInitialisation(chatItemsData);
    }

    // TODO: Cleanup.
    private createWeapon(modifier: number, effect: { name: string; plugin: string; reason: string; modifier: number; description: string; },
                         item: { icon: string; name: string; }, id: number, tags: string[], slots: EquipmentSlot[]) {

        let effectModifier = Math.round(modifier * effect.modifier * 100);
        const description = `${effect.description} ${Math.abs(effectModifier)}%`;
        effectModifier = (effectModifier / 100) + 1;

        const buyPriceMod = this.pricemodifier * modifier;
        const sellPriceMod = buyPriceMod / 2;

        const name = `${item.name} of the ${effect.name}`;

        const weapon = new RpgEquipment(id, name, buyPriceMod, sellPriceMod, item.icon, description,
            tags, slots, effect.plugin, effect.reason, effectModifier);
        return weapon;
    }

    private addRandomEquipment(prototypes: ItemProtoType[], chatItemsData: ChatItemsData): void {
        const randomIndex = Math.floor(Math.random() * prototypes.length);
        const prototype = prototypes[randomIndex];
        const item = new Item(prototype.id, 1);
        chatItemsData.addToInventory(chatItemsData.shopInventory, item);
    }
}
