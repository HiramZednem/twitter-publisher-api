// import express from 'express';
// import cors from 'cors';
// import morgan from 'morgan';
// import { TwitterClient } from './services/twitterClient';
// import { config } from './schemas/config';
// import multer from 'multer';



// const app = express();
// const port = 8080;




// async function main(){
//     const client = new TwitterClient(config);
//     await client.init();
// }


// // client.client.sendTweet('Hello world');
// // middlewares
// app.use(express.json());
// app.use(cors({ origin: true }));;
// app.use(morgan('dev'));
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // routes
// app.get('/', (req, res) => {
//     res.send('Scrapper app working');
// });

// app.post('/tweet', upload.single('image'), async (req, res) => {
//     const { tweet } = req.body;
//     const image = req.file;

// });


// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// })

// main().catch(console.error);

import { Server } from './server';

const server = new Server();

server.listen()