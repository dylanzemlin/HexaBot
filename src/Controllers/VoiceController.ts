import {
    DMChannel,
    StreamDispatcher,
    TextChannel,
    VoiceChannel,
    VoiceConnection,
    Channel,
    AudioPlayer,
    PresenceData,
} from 'discord.js';
import * as ytdl from 'ytdl-core';
import { isBuffer } from 'util';
import DiscordConnection from '../bot';

interface QItem
{
    voice: VoiceChannel;
    info: ytdl.videoInfo;
}

export default class VoiceController
{
    private static _instance: VoiceController = new VoiceController();

    public static get instance()
    {
        return this._instance;
    }

    private queue: QItem[] = [];

    private playing: boolean = false;
    private dispatcher: StreamDispatcher | undefined;
    private voice: VoiceConnection | undefined;
    private volume: number = 0.5;

    public Request(voiceChannel: VoiceChannel, info: ytdl.videoInfo)
    {
        this.queue.push(<QItem>{ voice: voiceChannel, info: info });
        if(!this.playing)
            this.nextSong();
    }

    public setVol(vol: number)
    {
        if(this.dispatcher)
        {
            this.dispatcher.setVolume(vol);
        }
    }

    public skip()
    {
        if(this.dispatcher)
        {
            if(this.queue.length == 0)
            {
                if(this.dispatcher)
                {
                    this.dispatcher.end();
                    this.dispatcher = undefined;
                }
            } else {
                this.nextSong();
            }
        }
    }

    public async nextSong()
    {
        if(this.dispatcher)
        {
            this.dispatcher.end();
            this.dispatcher.destroyed = true;
            this.dispatcher = undefined;
        }

        if(this.queue.length == 0)
        {
            this.playing = false;
            DiscordConnection.client.user.setPresence(<PresenceData>{status: "online"});
            return;
        }

        const next = this.queue.shift();

        if(!next)
            return;

        if(this.voice && this.voice.channel.id !== next.voice.id)
        {
            this.voice.disconnect();
            this.voice = await next.voice.join();
        } else if (!this.voice)
        {
            this.voice = await next.voice.join();
        }

        this.playing = true;



        const ytdl = require('ytdl-core');
        this.dispatcher = this.voice.playStream(ytdl(next.info.video_url, {filter: "audioonly"}));
        this.dispatcher.setVolume(this.volume);

        DiscordConnection.client.user.setPresence(
        {
            status: "online",
            game: {
                name: next.info.title,
                type: 'LISTENING'
            }
        });

        this.dispatcher.on('finish', () => {
            this.nextSong();
        });
    }
}