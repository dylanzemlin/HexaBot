import { Message, RichEmbed } from "discord.js";
import { ICommand } from '../Interfaces/ICommand'
import { HexaRank } from '../Structures/HexaRank'
import { Worker } from 'worker_threads';

export default class Clear implements ICommand
{
    prefix?: string  = "!"; 
    triggers?: String[]  = ["clear"];
    rank?: HexaRank = HexaRank.Owner;
    help?: string  = "Clears the current channel with params: <how many, -1 for all> <time between>";
    redacted?: boolean  = false;
    async run(message: Message): Promise<void> {
        while(true)
        {
            const messages = await message.channel.fetchMessages();
            messages.forEach(async (key, val) => {
                await key.delete();
            });
            if(message.channel.messages.entries.length <= 0)
                break;
        }
    }
} 