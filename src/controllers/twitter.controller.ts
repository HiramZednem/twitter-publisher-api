import { Request, Response } from 'express';
import { TwitterClient } from '../services/twitterClient';

export class TwitterController {
    private twitterService: TwitterClient;

    constructor(twitterService: TwitterClient = new TwitterClient()) {
        this.twitterService = twitterService;
        this.twitterService.init();
    }

    public async postTweet(req: Request, res: Response) {
        const { tweet } = req.body;
        console.log(tweet);
        try {
            await this.twitterService.sendTweet(tweet);
            res.status(200).send('tweet posted');
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error, status: false });
        }
    }

}