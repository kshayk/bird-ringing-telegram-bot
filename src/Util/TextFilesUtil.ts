import * as fs from "fs";
import * as crypto from "crypto";
import process from "process";

class TextFilesUtil {
    public static generateFilesList(fileNames : string[], prefix : string = "", itemsInRow : number = 1): any[] {
        let result = [];

        for (let i = 0; i < fileNames.length; i++) {
            const fileName = `${prefix} ` + fileNames[i].replace(/-/g, " ").replace('.txt', '');
            if (i % itemsInRow === 0) {
                result.push([{text: fileName}]);
            } else {
                result[result.length - 1].push({text: fileName});
            }
        }

        return result;
    }

    public static hashFileName(fileName : string) : string {
        return crypto.createHash('md5').update(fileName).digest('hex');
    }

    public static getBirdFiles(keyword: string) : string[] {
        return TextFilesUtil.getFiles('birds', keyword);
    }

    public static getTermFiles(keyword: string) : string[] {
        return TextFilesUtil.getFiles('terms', keyword);
    }

    private static getFiles(path: string, keyword: string) : string[] {
        return fs.readdirSync(`${process.cwd()}/${path}`).filter(file => file.startsWith(keyword)).sort((a, b) => {
            // sort by file name
            return a.localeCompare(b);
        });
    }
}

export default TextFilesUtil;