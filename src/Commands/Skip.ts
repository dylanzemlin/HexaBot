import { Message, RichEmbed, VoiceConnection } from "discord.js";
import { ICommand } from '../Interfaces/ICommand'
import { HexaRank } from '../Structures/HexaRank'
import VoiceController from "../Controllers/VoiceController";

export default class Clear implements ICommand
{
    prefix?: string  = "!"; 
    triggers?: String[]  = ["clear"];
    rank?: HexaRank = HexaRank.Owner;
    help?: string  = "Clears the current channel with params: <how many, -1 for all> <time between>";
    redacted?: boolean  = false;
    async run(message: Message): Promise<void> {
        VoiceController.instance.skip();
    }
} 