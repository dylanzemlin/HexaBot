import { Message, RichEmbed } from "discord.js";
import { ICommand } from '../Interfaces/ICommand'
import { HexaRank } from '../Structures/HexaRank'

export default class Help implements ICommand
{
    prefix?: string  = "!"; 
    triggers?: String[]  = ["help"];
    rank?: HexaRank = HexaRank.Guest;
    help?: string  = "Use !help for more information about the available commands!";
    redacted?: boolean  = false;
    async run(message: Message): Promise<void> {
        const embed = new RichEmbed();
        embed.setTitle("Help Command");
        embed.setColor(0xFF0000);
        embed.setDescription("Created by DylanSMR");
        embed.addField("General", "`!help` -> This!", true);

        await message.delete();
        message.reply(embed);
    }
} 