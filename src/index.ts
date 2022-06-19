import * as process from "process";
import TelegramBot from "./TelegramBot";
import CommandFactory from "./Factories/CommandFactory";

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const {TOKEN} = process.env;
const TELEGRAM_URI = `/webhook/${TOKEN}`;

const app = express();
app.use(bodyParser.json());

app.get('/test', (req, res) => {
    res.send('Hello World!');
});

app.post(TELEGRAM_URI, async (req, res) => {
    const text = getCommandText(req.body);
    if (!text) {
        return res.send('ok');
    }

    const messageArray = text.split(' ');

    const command = CommandFactory.getCommand(messageArray[0].toLowerCase());

    if (command) {
        await command.execute(req.body);
    }

    return res.send('ok');
});

function getCommandText(requestData: any): string|null {
    if (requestData.message && requestData.message.text) {
        return requestData.message.text;
    }

    if (requestData.callback_query.data) {
        return requestData.callback_query.data;
    }

    return null;
}

app.listen(process.env.PORT || 3000, async () => {
    await TelegramBot.init();
    console.log("App running on port 3000");
});

