import {ICommand} from "./ICommand";
import TelegramBot from "../TelegramBot";
import * as process from "process";
import * as fs from "fs";
import TextFilesUtil from "../Util/TextFilesUtil";
import FireStoreConnection from "../DB/FireStoreConnection";
import textFilesUtil from "../Util/TextFilesUtil";

class BirdCommand implements ICommand {
    private static letterSegments = [
        {'start': 'א', 'end': 'י'},
        {'start': 'כ', 'end': 'ע'},
        {'start': 'פ', 'end': 'ת'},
    ];

    private static birdsPath = process.cwd() + '/birds';

    async execute(requestData: any): Promise<void> {
        let messageArray = requestData.message.text.split(" ");

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
                let birdsList = TextFilesUtil.generateFilesList(segmentedFiles[messageArray[2] - 1], 'ציפור', 3);
                await TelegramBot.sendMessage(requestData.message.chat.id, "יש לבחור את הציפור המבוקשת מבין הרשימה.", birdsList);
                return;
            }

            await TelegramBot.sendMessage(requestData.message.chat.id, "מספר הרשימה שנבחר לא קיים.");
            return;
        }

        messageArray.shift();

        let birdName = messageArray.join("-");

        let files = textFilesUtil.getBirdFiles(birdName);

        if (files.length === 0) {
            await TelegramBot.sendMessage(requestData.message.chat.id, "הציפור המבוקשת לא נמצאה");
            return;
        }

        if (files.length === 1) {
            const fileHash = TextFilesUtil.hashFileName(files[0]);
            const connection = FireStoreConnection.getInstance();
            const birdData = await connection.getData('birds', 'bird_' + fileHash);

            let inlineKeyboard = null;
            if (birdData) {
                let birdTitles = birdData.data.map(bird => {
                    return {title: bird.title, hash: fileHash}
                });

                if (birdTitles.length > 0) {
                    inlineKeyboard = [];
                    for (let birdTitle of birdTitles) {
                        inlineKeyboard.push([{text: birdTitle.title, callback_data: `birdphoto ${birdTitle.hash}  ${birdTitle.title}`}]);
                    }
                }
            }

            let fileContents = fs.readFileSync(BirdCommand.birdsPath + '/' + files[0], 'utf8');
            await TelegramBot.sendMessage(requestData.message.chat.id, fileContents, null, inlineKeyboard);
            return;
        }

        // if there are more than one file, send a list of the files
        const birdsList = TextFilesUtil.generateFilesList(files, 'ציפור',1);

        await TelegramBot.sendMessage(requestData.message.chat.id, "אנא בחרו באחת מהאפשרויות", birdsList);
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

    private static async sendFullBirdListOptions(requestData: any) : Promise<void> {
        let message = "יש לבחור באפשרות מבין הרשימות - ";

        let list = [];
        for (let i = 0; i < this.letterSegments.length; i++) {
            message += "רשימה " + (i + 1) + ": *" + this.letterSegments[i].start + "-" + this.letterSegments[i].end + "*, ";

            list.push([{text: "ציפור רשימה " + (i + 1)}]);
        }

        await TelegramBot.sendMessage(requestData.message.chat.id, message.substring(0, message.length - 2), list);
    }

    private static getSegmentedFiles() : any[] {
        let files = fs.readdirSync(this.birdsPath)
        return BirdCommand.breakListIntoSegments(files);
    }
}

export default BirdCommand;