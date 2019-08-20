import * as dotenv from 'dotenv';
dotenv.config();

console.log("Loading config");

interface IConfig
{
    commands?: string[];
    prefix?: string;
    token?: string;
    key?: string;
}

const config: IConfig = {
    commands: process.env.COMMANDS
    ? process.env.COMMANDS.split(',') || []
    : [],
    prefix: process.env.PREFIX,
    token: process.env.TOKEN,
    key: process.env.KEY
}

console.log("Loaded: " + JSON.stringify(config));

export default config;