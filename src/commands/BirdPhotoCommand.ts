import {ICommand} from "./ICommand";
import telegramBot from "../TelegramBot";
import BirdRepository from "../Repositories/BirdRepository";

class BirdPhotoCommand implements ICommand{
    async execute(requestData: any) : Promise<void> {
        let messageArray = requestData.callback_query.data.split(" ");

        let birdHash = messageArray[1];

        //from index 2 onwards is the bird name
        let birdName = messageArray.slice(2).join(" ").trim();

        let birdsData = await BirdRepository.getData('birds', 'bird_' + birdHash);

        if (!birdsData) {
            throw new Error("Bird data not found for hash: " + birdHash);
        }

        let inputMediaPhotos = [];
        let description = null;
        for (let birdData of birdsData) {
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