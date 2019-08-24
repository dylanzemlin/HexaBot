import { Message, RichEmbed } from "discord.js";
import { ICommand } from '../Interfaces/ICommand'
import { HexaRank } from '../Structures/HexaRank'
import config from "../Interfaces/IConfig";
import VoiceController from "../Controllers/VoiceController";

export default class SeekCommand implements ICommand
{
    triggers: String[]  = ["seek"];
    rank: HexaRank = HexaRank.Owner;
    help: string  = `Seeks to a specified time in the currently playing song. ${config.prefix}seek <time:0h,0m,0s format>`;
    redacted: boolean  = false;

    async run(message: Message): Promise<void> {
        let args = message.content.split(/ +/);
        if(args.length != 2)
        {
            await message.delete();
            await message.reply(`To use the seek command, use the following args: ${config.prefix}seek <0h,0m,0s format>`);
        }

        if(VoiceController.instance.getPlayingSong == undefined)
        {
            await message.delete();
            await message.reply(`There is no song currently playing!`);    
        }

        let timeArgs = args[1].split(`,`);
        if(timeArgs.length != 3)
        {
            timeArgs = args[1].split(`:`);
        }
        let hours = parseInt(timeArgs[0].replace("h", ""));
        let minutes = parseInt(timeArgs[1].replace("m", ""));
        let seconds = parseInt(timeArgs[2].replace("s", ""));

        let totalSeconds = ((hours * 60) + minutes) * 60 + seconds;
        VoiceController.instance.seek(totalSeconds);
    }
} 