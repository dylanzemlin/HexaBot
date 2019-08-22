import { Message, RichEmbed, VoiceConnection } from "discord.js";
import { ICommand } from '../Interfaces/ICommand'
import { HexaRank } from '../Structures/HexaRank'
import VoiceController from "../Controllers/VoiceController";

export default class SkipCommand implements ICommand
{
    triggers: String[]  = ["skip"];
    rank: HexaRank = HexaRank.Owner;
    help: string  = "Skips the current song";
    redacted: boolean  = false;
    async run(message: Message): Promise<void> {
        VoiceController.instance.skip();
    }
} 