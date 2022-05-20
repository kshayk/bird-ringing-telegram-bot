import {ICommand} from "../commands/ICommand";
import BirdCommand from "../commands/BirdCommand";
import HelpCommand from "../commands/HelpCommand";

class CommandFactory {
    static getCommand(commandName: string): ICommand | null {
        switch (commandName) {
            case "טיבוע":
                return null
                // return new TibuaCommand();
            case "ציפור":
                return new BirdCommand();
            default:
                return new HelpCommand();
        }
    }
}

export default CommandFactory;