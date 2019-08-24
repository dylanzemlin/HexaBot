import * as discord from 'discord.js'
import config from './Interfaces/IConfig';
import manager from './Commands/Manager'
import logger from './logger';

export default class DiscordConnection 
{
    private static _client: discord.Client;

    public static start()
    {
        logger.debug(`Starting HexaBot with protocol: ${config.protocol}`);

        this._client = new discord.Client();

        this._client.on('ready', () => {
            logger.info("HexaBot ready to do hex things!");
            this._client.user.setGame(":pepe:");
        });

        this._client.on('message', (message) => {
           logger.debug(`Handling message with protocol: ${config.protocol}`);
           manager.instance.Handle(message);
        });

        this._client.login(config.token).then(token => logger.debug("Connected to discord")).catch(console.error);
    }

    public static get client(): discord.Client
    {
        return this._client;
    }
}
