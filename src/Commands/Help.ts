import { Message, RichEmbed } from "discord.js";
import { ICommand } from '../Interfaces/ICommand'
import config from '../Interfaces/IConfig';
import { HexaRank } from '../Structures/HexaRank'

export default class Help implements ICommand
{
    triggers?: String[]  = ["help", "commands", "info"];
    rank?: HexaRank = HexaRank.Guest;
    help?: string  = `Use ${config.prefix}help for more information about the available commands!`;
    redacted?: boolean  = false;
    async run(message: Message): Promise<void> {
        const embed = new RichEmbed();
        embed.setTitle("Help Command");
        embed.setColor(0xFF0000);
        embed.setDescription("Created by DylanSMR");
        let backer = "";
        for(const cmdName of config.commands || [])
        {
            const cmdClass = require('./' + cmdName).default;
            const cmd = new cmdClass() as ICommand;

            if(cmd.triggers)
            {
                backer += `[${cmd.triggers[0]}] -> ${cmd.help}`;
            }
        }
        embed.addField("General", backer, true);

        await message.delete();
        message.reply(embed);
    }
} 