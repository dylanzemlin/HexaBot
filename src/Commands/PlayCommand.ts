import { Message, RichEmbed, VoiceConnection, GuildMember } from "discord.js";
import { ICommand } from '../Interfaces/ICommand'
import { HexaRank } from '../Structures/HexaRank'
import config from '../Interfaces/IConfig';
import * as ytdl from 'ytdl-core';
import VoiceController from "../Controllers/VoiceController";
import * as request from "request-promise-native"

// Todo: Clean this up, put classes in other files, create a youtube search class, etc

interface RootResponse
{
    kind?: string;
    etag?: string;
    nextPageToken?: string;
    regionCode ?: string;

    pageInfo?: PageInfo;
    items?: Array<YoutubeItem>;
}

interface PageInfo
{
    totalResults?: number;
    resultsPerPage?: number;
}

interface YoutubeID
{
    kind?: string;
    videoId: string;
}

interface YoutubeSnippet
{
    channelId?: string;
    title?: string;
    description?: string;
    channelTitle?: string;
    liveBroadcastContent?: string;
}

interface YoutubeItem 
{
    kind?: string;
    etag?: string;
    id: YoutubeID;
    snippet: YoutubeSnippet;
}

export default class PlayCommand implements ICommand
{
    static results: Map<string, RootResponse> = new Map();

    triggers: String[]  = ["play"];
    rank: HexaRank = HexaRank.Regular;
    help: string  = `${config.prefix}play <url:search> (optional)<channel id> | play <search id>`;
    redacted: boolean  = false;
    async run(message: Message): Promise<void> {
        const args: string[] = message.content.split(/ +/);
        const untouchedArgs = Object.assign([], args); // Clone the orig
        if(untouchedArgs.length <= 1) // 1 for command, 2 for url, 3 for send channel
        {
            message.reply("Invalid syntax for this command! `!play <url:search> (optional)<channel id>");
            return;
        }
        if(message.member.voiceChannel)
        {
            const test: RegExp = new RegExp('^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+');
            const meme = args.splice(1, args.length).join(" ");
            if(meme.match(test))
            {
                // Play it! We detected a youtube url
                const info = await ytdl.getInfo(args[1]);
                if(info)
                {
                    VoiceController.instance.Request(message.member.voiceChannel, info, message.member);
                    message.reply(`Added ${info.title} to the queue!`);
                } else {
                    message.reply("Invalid youtube url :(");
                }
            } else {
                if(untouchedArgs.length == 2)
                {
                    const num = parseInt(untouchedArgs[1], 10);
                    if(num > 0 && num < 6)
                    {
                        // we got ourselves a play bois
                        if(PlayCommand.results.has(message.member.user.id))
                        {
                            let index = 0;

                            for (let entry of PlayCommand.results.entries()) {
                                console.log(entry[0] + ":" + entry[1]);
                                if(entry[0] == message.member.user.id)
                                {
                                    if(entry[1].items){
                                        for (let x of entry[1].items) {
                                            console.log(x.snippet.title + `[${index}]`);
                                            if(index == num - 1)
                                            {
                                                const info = await ytdl.getInfo(entry[1].items[index].id.videoId);
                                                VoiceController.instance.Request(message.member.voiceChannel, info, message.member);
                                                message.reply(`Added ${info.title} to the queue!`);          
                                                return;                      
                                            } else {
                                                index++;
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        return;
                    }
                }

                console.log("Searching: " + meme);
                const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=type&maxResults=5&q=(${meme})&key=${config.key}`;
                var options = {uri: searchUrl};
                const result = await request.get(options);

                console.log("Youtube Result: ");
                let parsedResult = JSON.parse(result);
                var object = <RootResponse>(parsedResult);

                if(PlayCommand.results.has(message.member.user.id))
                {
                    PlayCommand.results.delete(message.member.user.id);
                }

                PlayCommand.results.set(message.member.user.id,  object);

                if(object.items)
                {
                    const embed = new RichEmbed();
                    embed.setTitle("Youtube Search Results");
                    embed.setColor(0xFF0000);
            
                    let text = "";
                    let index = 0;
                    for(const item of object.items)
                    {
                        index++;
                        text += `[${index}] ${item.snippet.title}\n`;
                    }
                    embed.addField("Songs", text, true);
                    embed.setAuthor("DylaNSMR");
                    await message.delete();
                    message.reply(embed);
                }
            }
        } else {
            message.reply("You must be in or specify a voice channel to use this command! See !help for more info");
        }
    }
} 