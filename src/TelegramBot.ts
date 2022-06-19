import axios from "axios";

class TelegramBot {
    static async sendMessage(chatId: number, text: string, keyboard?: {text: string}[][], inlineKeyboard?: {text: string, callback_data: string}[][]) {
        const {TOKEN} = process.env;
        const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

        let messageData = {
            chat_id: chatId,
            text,
            parse_mode: "markdown",
        }

        if (keyboard) {
            messageData["reply_markup"] = {
                keyboard,
                one_time_keyboard: true
            }
        } else if (inlineKeyboard) {
            messageData["reply_markup"] = {
                inline_keyboard: inlineKeyboard
            }
        }

        await axios.post(`${TELEGRAM_API}/sendMessage`, messageData);
    }

    static async sendMediaGroup(chatId: number, media: {type: string, media: string}[]) {
        const {TOKEN} = process.env;
        const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

        let messageData = {
            chat_id: chatId,
            media,
        }

        await axios.post(`${TELEGRAM_API}/sendMediaGroup`, messageData);
    }

    static async init() {
        const {TOKEN, PUBLIC_URL} = process.env;
        const TELEGRAM_URI = `/webhook/${TOKEN}`;
        const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

        const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${PUBLIC_URL}${TELEGRAM_URI}`);
        console.log(res.data);
    }
}

export default TelegramBot;