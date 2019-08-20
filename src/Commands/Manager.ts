import * as discord from 'discord.js'
import config from '../Interfaces/IConfig';
import { ICommand } from '../Interfaces/ICommand'

export default class MessageManager
{
    public static Handle(message: discord.Message) // Store the commands in a list later to just refer to like a dictionary?
    {
        if(message.author.id == message.client.user.id)
            return;

        const splitter = message.cleanContent.toLocaleLowerCase().split(/ +/);
        const command = splitter[0];
        for(const cmdName of config.commands || [])
        {
            const cmdClass = require('./' + cmdName).default;
            const cmd = new cmdClass() as ICommand;

            if(cmd.triggers)
            {
                for(const beep of cmd.triggers)
                {
                    if(config.prefix && (config.prefix + beep).toLocaleLowerCase() == command.toLocaleLowerCase())
                    {
                        cmd.run(message);
                    }
                }
            }
        }
    }
}