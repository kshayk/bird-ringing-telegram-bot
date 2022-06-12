import * as fs from "fs";

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
}

export default TextFilesUtil;