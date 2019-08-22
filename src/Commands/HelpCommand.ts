import { Message, RichEmbed } from "discord.js";
import { ICommand } from '../Interfaces/ICommand'
import config from '../Interfaces/IConfig';
import { HexaRank } from '../Structures/HexaRank'

export default class HelpCommand implements ICommand
{
    triggers: String[]  = ["help", "commands", "info"];
    rank: HexaRank = HexaRank.Guest;
    help: string  = `Use ${config.prefix}help for more information about the available commands!`;
    redacted: boolean  = false;
    async run(message: Message): Promise<void> {

    }
} 