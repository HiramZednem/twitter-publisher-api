import { Request, Response } from 'express';
import { TwitterClient } from '../services/twitterClient';

export class TwitterController {
  private twitterService: TwitterClient;

  constructor(twitterService: TwitterClient = TwitterClient.getInstance()) {
    this.twitterService = twitterService;
  }

  public async postTweet(req: Request, res: Response) {
    try {
      const { text } = req.body;

      if (!text) {
        res.status(400).json({ error: "No text provided", status: false });
        return;
      }

       if (req.file) {
        const { buffer, mimetype } = req.file;

        const supportedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'video/mp4'
        ];

        if (!supportedTypes.includes(mimetype)) {
          res.status(400).json({ error: "Unsupported file type. Only .jpg, .jpeg, .png, .gif and .mp4 formats are allowed.", status: false });
          return;
        }

        const media = await this.twitterService.sendTweet(
          text,
          buffer,
          mimetype
        );
        res.status(200).json({ media: media });
      } else {
        const tweet = await this.twitterService.sendTweet(text);
        res.status(200).json({ tweet: tweet });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error, status: false });
    }
  }
}