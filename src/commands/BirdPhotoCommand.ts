import {ICommand} from "./ICommand";
import FireStoreConnection from "../DB/FireStoreConnection";
import telegramBot from "../TelegramBot";

class BirdPhotoCommand implements ICommand{
    async execute(requestData: any) : Promise<void> {
        let messageArray = requestData.callback_query.data.split(" ");

        let birdHash = messageArray[1];

        //from index 2 onwards is the bird name
        let birdName = messageArray.slice(2).join(" ").trim();

        const connection = FireStoreConnection.getInstance();
        const birdsData = await connection.getData('birds', 'bird_' + birdHash);

        if (!birdsData) {
            throw new Error("Bird data not found for hash: " + birdHash);
        }

        let inputMediaPhotos = [];
        let description = null;
        for (let birdData of birdsData.data) {
            if (birdData.title === birdName) {
                description = birdData.description ?? null;
                for (let birdImage of birdData.images) {
                    inputMediaPhotos.push({
                        type: "photo",
                        media: birdImage,
                    });
                }
            }
        }

        await telegramBot.sendMediaGroup(requestData.callback_query.message.chat.id, inputMediaPhotos);

        if (description) {
            await telegramBot.sendMessage(requestData.callback_query.message.chat.id, description);
        }
    }
}

export default BirdPhotoCommand;