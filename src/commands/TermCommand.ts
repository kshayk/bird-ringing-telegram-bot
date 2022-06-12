import {ICommand} from "./ICommand";
import TelegramBot from "../TelegramBot";
import * as process from "process";
import * as fs from "fs";
import TextFilesUtil from "../Util/TextFilesUtil";

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

        let files = fs.readdirSync(TermCommand.termsPath).filter(file => file.startsWith(termName)).sort((a, b) => {
            // sort by file name
            return a.localeCompare(b);
        });

        if (files.length === 0) {
            await TelegramBot.sendMessage(requestData.message.chat.id, "המונח המבוקש לא נמצא");
            return;
        }

        if (files.length === 1) {
            // get contents of the file
            let fileContents = fs.readFileSync(TermCommand.termsPath + '/' + files[0], 'utf8');
            await TelegramBot.sendMessage(requestData.message.chat.id, fileContents);
            return;
        }

        await TelegramBot.sendMessage(requestData.message.chat.id, "אנא בחרו באחת מהאפשרויות", TextFilesUtil.generateFilesList(files, 'מונח', 3));
    }

    private static async sendAvailableTerms(requestData: any): Promise<void> {
        let terms = fs.readdirSync(TermCommand.termsPath).sort((a, b) => {
            // sort by file name
            return a.localeCompare(b);
        });

        await TelegramBot.sendMessage(requestData.message.chat.id, "יש לבחור במושג מהרשימה", TextFilesUtil.generateFilesList(terms, 'מושג', 3));
    }
}

export default TermCommand;