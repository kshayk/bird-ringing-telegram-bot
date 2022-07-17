import {ICommand} from "./ICommand";
import TelegramBot from "../TelegramBot";
import * as process from "process";
import * as fs from "fs";
import TextFilesUtil from "../Util/TextFilesUtil";
import TermRepository from "../Repositories/TermRepository";

class TermCommand implements ICommand {
    private static termsPath = process.cwd() + '/terms';

    async execute(requestData: any): Promise<void> {
        let messageArray = requestData.message.text.split(" ");

        if (messageArray.length === 1) {
            await TermCommand.sendAvailableTerms(requestData);
            return;
        }

        messageArray.shift();

        let termName = messageArray.join("-");

        let files = TextFilesUtil.getTermFiles(termName);

        if (files.length === 0) {
            await TelegramBot.sendMessage(requestData.message.chat.id, "המונח המבוקש לא נמצא");
            return;
        }

        if (files.length === 1) {
            const fileHash = TextFilesUtil.hashFileName(files[0]);
            const termData = await TermRepository.getData('terms', 'term_' + fileHash);

            let fileContents = fs.readFileSync(TermCommand.termsPath + '/' + files[0], 'utf8');

            let inlineKeyboard = null;
            if (termData) {
                let termExtras = termData.extras.map(extra => {
                    return {title: extra.title, hash: fileHash}
                });

                if (termExtras.length > 0) {
                    inlineKeyboard = [];
                    for (let termExtra of termExtras) {
                        inlineKeyboard.push([{text: termExtras.title, callback_data: `termextra ${termExtra.hash}  ${termExtra.title}`}]);
                    }
                }

                // if there are multiple photos, use the sendMessage for the content and sendMediaGroup for the photos
                if (termData.photos.length > 0) {
                    await TelegramBot.sendMessage(requestData.message.chat.id, fileContents, inlineKeyboard);

                    let inputMediaPhotos = [];
                    for (let termPhoto of termData.photos) {
                        inputMediaPhotos.push({
                            type: "photo",
                            media: termPhoto.url,
                        });
                    }

                    await TelegramBot.sendMediaGroup(requestData.message.chat.id, inputMediaPhotos);
                    return;
                }
            }
            0
            await TelegramBot.sendMessage(requestData.message.chat.id, fileContents, inlineKeyboard);
            return;
        }

        await TelegramBot.sendMessage(requestData.message.chat.id, "אנא בחרו באחת מהאפשרויות", TextFilesUtil.generateFilesList(files, 'מונח', 3));
    }

    private static async sendAvailableTerms(requestData: any): Promise<void> {
        let terms = fs.readdirSync(TermCommand.termsPath).sort((a, b) => {
            // sort by file name
            return a.localeCompare(b);
        });

        await TelegramBot.sendMessage(requestData.message.chat.id, "יש לבחור במונח מהרשימה", TextFilesUtil.generateFilesList(terms, 'מונח', 3));
    }
}

export default TermCommand;