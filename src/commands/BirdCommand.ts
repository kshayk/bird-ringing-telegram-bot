import {ICommand} from "./ICommand";
import TelegramBot from "../TelegramBot";
import * as process from "process";
import * as fs from "fs";

class BirdCommand implements ICommand {
    private static letterSegments = [
        {'start': 'א', 'end': 'י'},
        {'start': 'כ', 'end': 'ע'},
        {'start': 'פ', 'end': 'ת'},
    ];

    private static birdsPath = process.cwd() + '/birds';

    async execute(requestData: any): Promise<void> {
        let messageArray = requestData.message.text.split(" ");

        //get root path of project
        let birdsPath = process.cwd() + '/birds';

        if (messageArray.length === 1) {
            await BirdCommand.sendFullBirdListOptions(requestData);
            return;
        }

        if (messageArray[1] === "רשימה") {
            if (!messageArray[2]) {
                await BirdCommand.sendFullBirdListOptions(requestData);
                return;
            }

            let segmentedFiles = BirdCommand.getSegmentedFiles();

            if (segmentedFiles[+messageArray[2] - 1]) {
                let birdsList = BirdCommand.generateBirdList(segmentedFiles[messageArray[2] - 1], 3);
                await TelegramBot.sendMessage(requestData.message.chat.id, "יש לבחור את הציפור המבוקשת מבין הרשימה.", birdsList);
                return;
            }

            await TelegramBot.sendMessage(requestData.message.chat.id, "מספר הרשימה שנבחר לא קיים.");
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

    private static breakListIntoSegments(birdFileNames : string[]) : any[] {
        let segments = [];

        for (let letterSegment of this.letterSegments) {
            segments.push(birdFileNames.filter(file => {
                return file.charAt(0) >= letterSegment.start && file.charAt(0) <= letterSegment.end;
            }));
        }

        return segments;
    }

    private static async sendFullBirdListOptions(requestData: any) {
        let message = "יש לבחור באפשרות מבין הרשימות - ";

        let list = [];
        for (let i = 0; i < this.letterSegments.length; i++) {
            message += "רשימה " + (i + 1) + ": " + this.letterSegments[i].start + "-" + this.letterSegments[i].end + " ";

            list.push([{text: "רשימה " + (i + 1)}]);
        }

        await TelegramBot.sendMessage(requestData.message.chat.id, message, list);
        return
    }

    private static getSegmentedFiles() : any[] {
        let files = fs.readdirSync(this.birdsPath)
        return BirdCommand.breakListIntoSegments(files);
    }
}

export default BirdCommand;