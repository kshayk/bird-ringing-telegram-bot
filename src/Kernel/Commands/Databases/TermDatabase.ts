import FireStoreConnection from "../../../DB/FireStoreConnection";
import process from "process";
import TextFilesUtil from "../../../Util/TextFilesUtil";

interface ITermExtraData {
    description: string;
    images: string[];
    title: string;
}

interface ItermPhotosData {
    url: string;
    title: string;
}

interface ITermData {
    termName: string;
    photos: ItermPhotosData[];
    extras: ITermExtraData[];
}

class TermDatabase {
    termsPath: string;
    fileHash: string;
    dbConnection: FireStoreConnection;

    constructor(termKeyword : string) {
        this.dbConnection = FireStoreConnection.getInstance();
        this.termsPath = process.cwd() + '/terms';

        let files = TextFilesUtil.getTermFiles(termKeyword);

        if (files.length > 1 || files.length === 0) {
            throw new Error(`Error: more than one file or no files found. Files found: ${files.length}`);
        }

        this.fileHash = TextFilesUtil.hashFileName(files[0]);
    }

    addNewTerm(termData: ITermData) {
        this.dbConnection.setData('terms', 'term_' + this.fileHash, termData).then(() => {
            console.log(`Successfully added term ${termData.termName}`);
        }).catch(err => {
            console.log(`Error adding term ${termData.termName}: ${err}`);
        });
    }

    // any key that is passed will replace the current bird data and will be added to the database
    updateTerm(data: object) {
        this.dbConnection.getData('terms', 'term_' + this.fileHash).then(termData => {
            if (!termData) {
                console.log(`Error: term was not found in database with hash ${this.fileHash}`);
                return;
            }

            this.dbConnection.setData('terms', 'term_' + this.fileHash, {
                ...termData,
                ...data
            }).then(() => {
                console.log(`Successfully updated term`);
            }).catch(err => {
                console.log(`Error updating term: ${err}`);
            });
        });
    }
}

export default TermDatabase;