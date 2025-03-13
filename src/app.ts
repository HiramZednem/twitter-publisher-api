import { TwitterClient } from './services/twitterClient';
import { Server } from './server';


async function main(){
    const client = TwitterClient.getInstance();
    await client.init();
    const server = new Server();
    server.listen()
}

main().catch(console.error);



