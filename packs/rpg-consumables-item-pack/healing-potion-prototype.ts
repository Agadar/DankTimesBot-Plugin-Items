import { Message } from "node-telegram-bot-api";
import { Chat } from "../../../../src/chat/chat";
import { User } from "../../../../src/chat/user/user";
import { ItemProtoType } from "../../item/item-prototype";

/**
 * A healing potion for releasing a wounded player from the Life plugin's hospital.
 * Can be expanded in the future to be a more generic potion, with the potion specifics
 * determined by the potion's metadata.
 */
export class HealingPotionProtoType extends ItemProtoType {

    constructor(id: number, private readonly potionEffect: (chat: Chat, user: User) => boolean) {
        super(id, "Healing Potion", 50, 0.5, "🧪", "The red liquid glimmers when agitated.", ["Potion"], true, true);
    }

    public override onUse(chat: Chat, user: User, msg: Message, match: string, rank: number): { msg: string, shouldConsume: boolean } {
        if (this.potionEffect(chat, user)) {
            return { msg: `You drink the ${this.prettyName(rank)}. Your wounds are healed almost instantly!`, shouldConsume: true };
        }
        return { msg: `You drink the ${this.prettyName(rank)}. It has no effect as you are in perfect health.`, shouldConsume: true };
    }
}
