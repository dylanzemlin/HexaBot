import { GuildMember, Message } from "discord.js";
import { HexaRank } from '../Structures/HexaRank'

export interface ICommand
{
    triggers?: Array<String>;
    rank?: HexaRank;
    help?: string;
    redacted?: boolean;

    run(message: Message): void;
}