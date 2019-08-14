import DiscordConnection from './bot'

async function yeet()
{
    try  
    {
        DiscordConnection.start();
    } catch (error)
    {
        // welp its all over now
        console.error(error);
        process.exit(1);
    }
}

if(require.main == module)
{
    yeet();
}
// bop