import { Message } from "node-telegram-bot-api";
import { Chat } from "../../../../src/chat/chat";
import { User } from "../../../../src/chat/user/user";
import { ItemProtoType } from "../../item/item-prototype";
import { ALL_EMOJIS } from "../../../../src/util/emojis";

export class Avatar extends ItemProtoType {

    private readonly avatarNamePattern = new RegExp("^[aA][vV][aA][tT][aA][rR] '(.*)'$");

    constructor(id: number) {
        super(id, "Avatar", 200, 0.5, "👤", "Dab on the haters with this custom emoji in front of your name", ["Avatar"],
            true, true, [], true, false, 1);
    }

    public override getPrettyPrintsOfMatchingNames(input: string, chatModifier: number): string[] {
        const match = input.match(this.avatarNamePattern);

        if (!match || !match[1] || !ALL_EMOJIS.find((e) => e.includes(match[1]))) {
            return [];
        }
        return [this.prettyPrint(chatModifier, 1, match[1])];
    }

    public override nameForRank(rank?: number, metaData?: any): string {
        return `${this.baseName(metaData)} '${metaData}'`;
    }

    public override onUse(chat: Chat, user: User, msg: Message, match: string, rank: number, metaData?: any): { msg: string, shouldConsume: boolean } {
        if (user.availableAvatars.indexOf(metaData) !== -1) {
            return { msg: "😮 You already have this avatar available!", shouldConsume: false };
        }
        user.availableAvatars.push(metaData);
        return { msg: "😄 Added the avatar to your collection!", shouldConsume: true };
    }
}
