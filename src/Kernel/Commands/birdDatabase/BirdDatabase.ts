import FireStoreConnection from "../../../DB/FireStoreConnection";
import process from "process";
import TextFilesUtil from "../../../Util/TextFilesUtil";

interface IBirdCategoryData {
    description: string;
    images: string[];
    title: string;
}

interface IBirdData {
    birdName: string;
    birdNameEn: string;
    data: IBirdCategoryData[];
}

class BirdDatabase {
    birdsPath: string;
    fileHash: string;
    dbConnection: FireStoreConnection;

    constructor(birdKeyword : string) {
        this.dbConnection = FireStoreConnection.getInstance();
        this.birdsPath = process.cwd() + '/birds';

        let files = TextFilesUtil.getBirdFiles(birdKeyword);

        if (files.length > 1 || files.length === 0) {
            throw new Error(`Error: more than one file or no files found. Files found: ${files.length}`);
        }

        this.fileHash = TextFilesUtil.hashFileName(files[0]);
    }

    addNewBird(birdData: IBirdData) {
        this.dbConnection.setData('birds', 'bird_' + this.fileHash, birdData).then(() => {
            console.log(`Successfully added bird ${birdData.birdNameEn}`);
        }).catch(err => {
            console.log(`Error adding bird ${birdData.birdNameEn}: ${err}`);
        });
    }

    // any key that is passed will replace the current bird data and will be added to the database
    updateBird(data: object) {
        this.dbConnection.getData('birds', 'bird_' + this.fileHash).then(birdData => {
            if (!birdData) {
                console.log(`Error: bird was not found in database with hash ${this.fileHash}`);
                return;
            }

            this.dbConnection.setData('birds', 'bird_' + this.fileHash, {
                ...birdData,
                ...data
            }).then(() => {
                console.log(`Successfully updated bird`);
            }).catch(err => {
                console.log(`Error updating bird: ${err}`);
            });
        });
    }
}

export default BirdDatabase;