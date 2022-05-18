import {ICommand} from "./ICommand";
import TelegramBot from "../TelegramBot";
import * as process from "process";
import * as fs from "fs";

const DUMMY_BIRD_DATA = [
    [{text: "ציפור סבכי שחור כיפה"}],
    [{text: "ציפור סבכי שחור ראש"}],
    [{text: "ציפור סבכי אפור"}]
]

class BirdCommand implements ICommand {
    async execute(requestData: any): Promise<void> {
        let messageArray = requestData.message.text.split(" ");

        //get root path of project
        let birdsPath = process.cwd() + '/birds';

        if (messageArray.length === 1) {
            let files = fs.readdirSync(birdsPath)
            let birdsList = BirdCommand.generateBirdList(files, 3);

            await TelegramBot.sendMessage(requestData.message.chat.id, "אנא בחר את אחת מהציפורים כדי לקבל מידע עליה", birdsList);
            return;
        }

        messageArray.shift();

        let birdName = messageArray.join("-");

        let files = fs.readdirSync(birdsPath).filter(file => file.startsWith(birdName)).sort((a, b) => {
            // sort by file name
            return a.localeCompare(b);
        });

        if (files.length === 0) {
            await TelegramBot.sendMessage(requestData.message.chat.id, "הציפור המבוקשת לא נמצאה");
            return;
        }

        if (files.length === 1) {
            // get contents of the file
            let fileContents = fs.readFileSync(birdsPath + '/' + files[0], 'utf8');
            await TelegramBot.sendMessage(requestData.message.chat.id, fileContents);
            return;
        }

        // if there are more than one file, send a list of the files
        const birdsList = BirdCommand.generateBirdList(files, 1);

        await TelegramBot.sendMessage(requestData.message.chat.id, "אנא בחרו באחת מהאפשרויות", birdsList);
        return;
    }

    private static generateBirdList(birdFileNames : string[], itemsInRow : number = 1): any[] {
        let result = [];

        for (let i = 0; i < birdFileNames.length; i++) {
            const fileName = "ציפור " + birdFileNames[i].replace(/-/g, " ").replace('.txt', '');
            if (i % itemsInRow === 0) {
                result.push([{text: fileName}]);
            } else {
                result[result.length - 1].push({text: fileName});
            }
        }

        return result;
    }
}

export default BirdCommand;