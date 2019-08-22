import {
    DMChannel,
    StreamDispatcher,
    TextChannel,
    VoiceChannel,
    VoiceConnection,
    Channel,
    AudioPlayer,
    PresenceData,
    GuildMember,
} from 'discord.js';
import * as ytdl from 'ytdl-core';
import { isBuffer } from 'util';
import DiscordConnection from '../bot';

interface QItem
{
    voice: VoiceChannel;
    info: ytdl.videoInfo;
    requester: GuildMember;
}

export default class VoiceController
{
    private static _instance: VoiceController = new VoiceController();

    public static get instance()
    {
        return this._instance;
    }


    public queue: QItem[] = [];

    private playing: boolean = false;
    private dispatcher: StreamDispatcher | undefined;
    private voice: VoiceConnection | undefined;
    private volume: number = 0.5;

    private currentSong: QItem | undefined;

    public get getPlayingSong()
    {
        return this.currentSong;
    }

    public get getQueue(){
        return this.queue;
    }

    public Request(voiceChannel: VoiceChannel, info: ytdl.videoInfo, member: GuildMember)
    {
        this.queue.push(<QItem>{ voice: voiceChannel, info: info, requester: member });
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

    public stop()
    {
        this.queue = [];
        if(this.dispatcher && this.playing)
        {
            this.dispatcher.end("forced");
        }
        this.playing = false;
    }

    public togglePause(p: boolean)
    {
        if(!this.dispatcher)
            return;

        if(p)
        {
            this.dispatcher.pause();
        } else {
            this.dispatcher.resume();
        }
    }

    public skip()
    {
        this.nextSong();
    }

    public async nextSong()
    {
        this.currentSong = undefined;
        if(this.dispatcher)
        {
            this.dispatcher.end("forced");
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
        this.dispatcher = await this.voice.playStream(ytdl(next.info.video_url, {filter: "audioonly"}));
        this.dispatcher.setVolume(this.volume);

        this.currentSong = next;

        DiscordConnection.client.user.setPresence(
        {
            status: "online",
            game: {
                name: next.info.title,
                type: 'LISTENING'
            }
        });

        this.dispatcher.on('end', reason => {
            this.dispatcher = undefined;
            this.currentSong = undefined;
            if(reason != "forced") this.nextSong();
        });

        this.dispatcher.on('error', reason => {
            console.error(`VoiceController Error : ${reason.message}`);
            this.dispatcher = undefined;
            this.currentSong = undefined;
            this.nextSong();
        })
    }
}