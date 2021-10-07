import { Message } from "node-telegram-bot-api";
import { Chat } from "../../../../src/chat/chat";
import { User } from "../../../../src/chat/user/user";
import { ItemProtoType } from "../../item/item-prototype";

export class Cookie extends ItemProtoType {

    constructor(id: number) {
        super(id, "Cookie", 10, 5, "🍪", "The kind you find in a cookie jar, not on a website",
            ["Food"], true, true);
    }

    public override onUse(chat: Chat, user: User, msg: Message, match: string): { msg: string, shouldConsume: boolean } {
        return { msg: `You eat the ${this.prettyName()}. It is quite delicious.`, shouldConsume: true };
    }
}
