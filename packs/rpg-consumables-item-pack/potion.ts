import { Message } from "node-telegram-bot-api";
import { Chat } from "../../../../src/chat/chat";
import { User } from "../../../../src/chat/user/user";
import { ItemProtoType } from "../../item/item-prototype";

export class Potion extends ItemProtoType {

    constructor(id: number) {
        super(id, "Potion", 10, 0.5, "🧪", "The kind you find in a cookie jar, not on a website",
            ["Potion"], true, true);
    }

    public override onUse(chat: Chat, user: User, msg: Message, match: string, rank: number): { msg: string, shouldConsume: boolean } {
        return { msg: `You drink the ${this.prettyName(rank)}. It is quite awful.`, shouldConsume: true };
    }
}
