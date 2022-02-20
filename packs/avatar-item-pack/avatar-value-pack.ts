import { Message } from "node-telegram-bot-api";
import { Chat } from "../../../../src/chat/chat";
import { User } from "../../../../src/chat/user/user";
import { ItemProtoType } from "../../item/item-prototype";
import { emojiList } from "./emojis";


export class AvatarValuePack extends ItemProtoType {

    constructor(id: number) {
        super(id, "Avatar Value Pack", 500, 0.5, "👤", "Value pack containing 3 avatars", ["Avatar"],
            true, true, [], true, false, 1);
    }

    public override onUse(chat: Chat, user: User, msg: Message, match: string, rank: number, metaData: any = null): { msg: string, shouldConsume: boolean } {
        const noncollectedAvatars = emojiList.filter(emoji => !user.availableAvatars.includes(emoji));

        if (noncollectedAvatars.length < 1) {
            return { msg: "😮 You already have all avatars available!", shouldConsume: false };
        }
        const avatarsToCollect = new Array<string>();

        for (let i = 0; i < 3 && noncollectedAvatars.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * noncollectedAvatars.length);
            const randomAvatar = noncollectedAvatars[randomIndex];
            avatarsToCollect.push(randomAvatar);
            noncollectedAvatars.splice(randomIndex);
            user.availableAvatars.push(randomAvatar);
        }
        return { msg: `Added the following avatars to your collection: ${avatarsToCollect.join(" ")}!`, shouldConsume: true };
    }
}