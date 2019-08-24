import { Message, RichEmbed, VoiceConnection, GuildMember } from "discord.js";
import { ICommand } from '../Interfaces/ICommand'
import { HexaRank } from '../Structures/HexaRank'
import config from '../Interfaces/IConfig';
import * as ytdl from 'ytdl-core';
import VoiceController from "../Controllers/VoiceController";
import * as request from "request-promise-native"
import logger from "../logger";

export default class YoutubeController
{
    private static _instance: YoutubeController = new YoutubeController();

    private results: Map<string, RootResponse> = new Map();

    public static get instance()
    {
        return this._instance;
    }

    public resultsFromId(id: string)
    {
        if(this.results.has(id))
            return this.results.get(id);
        else
            return undefined;
    }

    public async GetResults(query: string, member: GuildMember)
    {
        logger.debug(`Searching for \"${query}\" from member \"${member.displayName}\"`);
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=type&maxResults=5&q=(${query})&key=${config.key}`;
        var options = {uri: searchUrl};
        const result = await request.get(options);

        let parsedResult = <RootResponse>(JSON.parse(result));
        if(!parsedResult.items)
            return undefined;

        if(parsedResult.items.length == 0)
            return 0;

        if(this.results.has(member.id))
            this.results.delete(member.id);
        this.results.set(member.id, parsedResult);

        return parsedResult;
    }
}