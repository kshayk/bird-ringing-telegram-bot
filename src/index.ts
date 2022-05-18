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

app.post(TELEGRAM_URI, async (req, res) => {
    console.log('body', req.body);

    const {message} = req.body;
    if (typeof message === 'undefined') {
        return res.send('ok');
    }

    const {text} = message;

    const messageArray = text.split(' ');

    const command = CommandFactory.getCommand(messageArray[0].toLowerCase());

    if (command) {
        await command.execute(req.body);
    }

    return res.send('ok');
});

app.listen(process.env.PORT || 5000, async () => {
    await TelegramBot.init();
    console.log("App running on port 5000");
});

