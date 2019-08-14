import * as discord from 'discord.js'
import config from './Interfaces/IConfig';
import manager from './Commands/Manager'

export default class DiscordConnection 
{
    private static _client: discord.Client;

    public static start()
    {
        this._client = new discord.Client();

        this._client.on('ready', () => {
            console.log("Hexabot ready to hex!");
            this._client.user.setGame("Pepe Hands");
        });

        this._client.on('message', (message) => {
           console.log(message.content);
           manager.Handle(message);
        });

        this._client.login(config.token).then(token => console.log("Logged Into Discord")).catch(console.error);
    }

    public static get client(): discord.Client
    {
        return this._client;
    }
}
