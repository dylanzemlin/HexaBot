import { Message, RichEmbed, VoiceConnection, GuildMember } from "discord.js";
import { ICommand } from '../Interfaces/ICommand'
import { HexaRank } from '../Structures/HexaRank'
import config from '../Interfaces/IConfig';
import * as ytdl from 'ytdl-core';
import VoiceController from "../Controllers/VoiceController";
import logger from "../logger";
import YoutubeController from "../Controllers/YoutubeController";

// Todo: Clean this up, put classes in other files, create a youtube search class, etc

export default class PlayCommand implements ICommand
{
    static results: Map<string, RootResponse> = new Map();

    triggers: String[]  = ["play"];
    rank: HexaRank = HexaRank.Regular;
    help: string  = `${config.prefix}play <url:search> (optional)<channel id> | play <search id>`;
    redacted: boolean  = false;

    test: RegExp = new RegExp('^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+'); // The testing regex to see if its a valid youtube url

    async run(message: Message): Promise<void> {
        const args: string[] = message.content.split(/ +/);
        if(args.length <= 1) // 1 for command, 2 for url, 3 for send channel
        {
            message.reply(`Invalid syntax for this command! ${config.prefix}play <url:sarch query>`);
            return;
        }

        let queryString = args.slice(1, args.length).join(" ");
        if(message.member.voiceChannel)
        {
            let match = queryString.match(this.test);
            if(match)
            {
                if(match.length >= 1) // We only have a url
                {
                    const info = await ytdl.getInfo(args[1]);
                    if(info)
                        VoiceController.instance.Request(message.member.voiceChannel, info, message.member);
                    else
                        message.reply("You must provide a valid Youtube URL or search query to use the play command!");

                    return;
                }
            }

            logger.debug(`Search args with ${args.length} of ${JSON.stringify(args)}`);
            if(args.length == 2)
            {
                const num = parseInt(args[1], 10);
                if(num > 0 && num < 6)
                {
                    const results = YoutubeController.instance.resultsFromId(message.member.id);
                    if(results == undefined)
                        await message.reply("You must use the play command first!");
                    else {
                        if(!results.items)
                        {
                            await message.reply("There was an error using your existing search results. Please try to search again");
                        } else {
                            logger.debug("Found " + results.items.length);
                            if(num <= results.items.length && num > 0)
                            {
                                const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${results.items[num - 1].id.videoId}`);
                                VoiceController.instance.Request(message.member.voiceChannel, info, message.member);
                            } else {
                                await message.reply(`You must provide a number 1 through ${results.items.length} to use that command! If you would like to see your results, use the results command!`);
                            }
                        }
                    }

                    return;
                }
            }

            const results = await YoutubeController.instance.GetResults(queryString, message.member);
            if(!results || !results.items)
            {
                await message.reply("There was an error searching youtube for that query! Please try again later");
            } else {
                if(results == 0)
                {
                    await message.reply(`There is nothing on youtube with the query \"${queryString}\"`);
                } else {
                    let response = `Showing ${results.items.length > 5 ? 5 : 1} out of ${results.items.length} results:\n\n`;
                    for(let i = 0; i < results.items.length; i++)
                    {
                        if(i >= 5)
                            break;

                        response += `\`[${i +  1}]\` ***${results.items[i].snippet.title}***\n`;
                    }
                    await message.reply(response);
                }
            }
        }
    }
} 