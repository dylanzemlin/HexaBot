import { Message, RichEmbed, VoiceConnection } from "discord.js";
import { ICommand } from '../Interfaces/ICommand'
import { HexaRank } from '../Structures/HexaRank'
import VoiceController from "../Controllers/VoiceController";

export default class QueueCommand implements ICommand
{
    triggers: String[]  = ["queue"];
    rank: HexaRank = HexaRank.Owner;
    help: string  = "Lists up to 5 currently queued songs.";
    redacted: boolean  = false;

    private secondsToHms(d: any) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var hDisplay = h > 0 ? h + (h == 1 ? "h, " : "h,") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? "m, " : "m,") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
        return hDisplay + mDisplay + sDisplay; 
    }

    async run(message: Message): Promise<void> {
        const queue = VoiceController.instance.getQueue;
        if(queue.length == 0)
        {
            if(VoiceController.instance.getPlayingSong != undefined)
            {
                await message.channel.sendMessage(`Currently playing **${VoiceController.instance.getPlayingSong.info.title}** requested by **${VoiceController.instance.getPlayingSong.requester.displayName}** \`(${this.secondsToHms(VoiceController.instance.getPlayingSong.info.length_seconds)})\``);
                await message.delete();
            } else {
                await message.channel.sendMessage("There are currently no queued songs! Use !play to add a song :)");
                await message.delete();
            }
        } else {
            let totalTime = 0;
            queue.forEach(x => {
                totalTime += Number(x.info.length_seconds);
            });
            if(VoiceController.instance.getPlayingSong)
                totalTime += Number(VoiceController.instance.getPlayingSong.info.length_seconds);

            let time = this.secondsToHms(totalTime);

            let parsedString = "";
            if(VoiceController.instance.getPlayingSong)
            {
                parsedString += `Currently playing **${VoiceController.instance.getPlayingSong.info.title}** requested by **${VoiceController.instance.getPlayingSong.requester.displayName}** \`(${this.secondsToHms(VoiceController.instance.getPlayingSong.info.length_seconds)})\`\n`;
            }
            let index = 0;
            queue.forEach(x => {
                parsedString += `\n[${index + 1}] **${x.info.title}** requested by **${x.requester.displayName}** \`(${this.secondsToHms(x.info.length_seconds)})\``;
            });
            parsedString += "\n\nRemaining Queue Length: \`(" + time + ")\`";

            if(parsedString.length == 0)
                return;

            await message.reply(parsedString);
            await message.delete();
        }
    }
} 