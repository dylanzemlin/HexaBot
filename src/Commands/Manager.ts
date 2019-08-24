import * as discord from 'discord.js'
import config from '../Interfaces/IConfig';
import { ICommand } from '../Interfaces/ICommand'
import Clear from './SkipCommand';
import ClearCommand from './ClearCommand';
import HelpCommand from './HelpCommand';
import PlayCommand from './PlayCommand';
import SkipCommand from './SkipCommand';
import VolumeCommand from './VolumeCommand';
import QueueCommand from './QueueCommand';
import SeekCommand from './SeekCommand';

export default class MessageManager
{
    private static _instance: MessageManager = new MessageManager();
    private commands: ICommand[] = [];

    constructor()
    {
        switch(config.protocol)
        {
            case "text":
                this.commands.push(new ClearCommand());
                this.commands.push(new HelpCommand());
            break;

            case "voice":
                this.commands.push(new PlayCommand());
                this.commands.push(new SkipCommand());
                this.commands.push(new VolumeCommand());
                this.commands.push(new SeekCommand());
            break;

            case "multi": // Used for my window ubuntu system
                this.commands.push(new ClearCommand());
                this.commands.push(new HelpCommand());
                this.commands.push(new PlayCommand());
                this.commands.push(new SkipCommand());
                this.commands.push(new VolumeCommand());
                this.commands.push(new QueueCommand());
                this.commands.push(new SeekCommand());
            break;
        }
    }

    public static get instance(): MessageManager
    {
        return this._instance;
    }

    public Handle(message: discord.Message) // Store the commands in a list later to just refer to like a dictionary?
    {
        if(message.author.id == message.client.user.id)
            return;

        const splitter = message.cleanContent.toLocaleLowerCase().split(/ +/);
        const command = splitter[0];

        for(const cmd of this.commands)
        {
            for(const trigger of cmd.triggers)
            {
                if(config.prefix && (config.prefix + trigger).toLocaleLowerCase() == command.toLocaleLowerCase())
                {
                    // Check our users level and crap
                    cmd.run(message);
                    return;
                }
            }
        }
    }
}