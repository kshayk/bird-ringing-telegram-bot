import {ICommand} from "./ICommand";
import TelegramBot from "../TelegramBot";
import * as process from "process";
import * as fs from "fs";

class HelpCommand implements ICommand {
    async execute(requestData: any): Promise<void> {
        let helpPath = process.cwd() + '/help/help.txt';

        let fileContents = fs.readFileSync(helpPath, 'utf8');
        await TelegramBot.sendMessage(requestData.message.chat.id, fileContents);
    }
}

export default HelpCommand;