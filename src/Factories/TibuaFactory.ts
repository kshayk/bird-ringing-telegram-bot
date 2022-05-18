import TibuaJerusalem from "../Tibua/locations/TibuaJerusalem";
import {ITibua} from "../Tibua/ITibua";

class TibuaFactory {
    static create(tibua: string): ITibua {
        switch (tibua) {
            case 'ירושלים':
                return new TibuaJerusalem();
            default:
                return null;
        }
    }
}

export default TibuaFactory;