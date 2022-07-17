import {ICommand} from "../commands/ICommand";
import BirdCommand from "../commands/BirdCommand";
import HelpCommand from "../commands/HelpCommand";
import TermCommand from "../commands/TermCommand";
import BirdPhotoCommand from "../commands/BirdPhotoCommand";

class CommandFactory {
    static getCommand(commandName: string): ICommand | null {
        switch (commandName) {
            case "טיבוע":
                return null
                // return new TibuaCommand();
            case "ציפור":
                return new BirdCommand();
            case "מונח":
                return new TermCommand();
            case 'birdphoto':
                return new BirdPhotoCommand();
            default:
                return new HelpCommand();
        }
    }
}

export default CommandFactory;