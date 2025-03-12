
import { TwitterClient } from './services/twitterClient';
import { Server } from './server';



async function main(){
    const client = TwitterClient.getInstance();
    await client.init();
    const server = new Server();
    server.listen()
}


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

main().catch(console.error);



