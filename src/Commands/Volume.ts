import { Message, RichEmbed, VoiceConnection } from "discord.js";
import { ICommand } from '../Interfaces/ICommand'
import { HexaRank } from '../Structures/HexaRank'
import VoiceController from "../Controllers/VoiceController";
import config from '../Interfaces/IConfig';

export default class Sound implements ICommand
{
    triggers?: String[]  = ["volume"];
    rank?: HexaRank = HexaRank.Owner;
    help?: string  = `${config.prefix}volume <level from 1-100>`;
    redacted?: boolean  = false;
    async run(message: Message): Promise<void> {
        const args: string[] = message.content.split(/ +/);
        if(args.length != 2)
            return; // throw the prefix later

        let volume: number = parseInt(args[1], 10);

        if(volume < 0)
            volume = 0;
        else if (volume > 100)
            volume = 100;

        VoiceController.instance.setVol(volume / 100.0 / 2.0);
    }
} 