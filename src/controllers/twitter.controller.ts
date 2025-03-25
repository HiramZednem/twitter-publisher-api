import { Request, Response } from 'express';
import { TwitterClient } from '../services/twitterClient';
import logger from '../services/loggerService';

export class TwitterController {
  private twitterService: TwitterClient;

  constructor(twitterService: TwitterClient = TwitterClient.getInstance()) {
    this.twitterService = twitterService;
  }

  public async postTweet(req: Request, res: Response) {
    try {
      const { text } = req.body;

      if (!text) {
        res.status(400).json({ error: "No text provided", success: false });
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
          res.status(400).json({ error: "Unsupported file type. Only .jpg, .jpeg, .png, .gif and .mp4 formats are allowed.", success: false });
          return;
        }

        const media = await this.twitterService.sendTweet(
          text,
          buffer,
          mimetype
        );
        res.status(200).json({
          success: true,
          message: "Tweet enviado con éxito",
        });
      } else {
        const tweet = await this.twitterService.sendTweet(text);
        res.status(200).json({
          success: true,
          message: "Tweet enviado con éxito",
        });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: error, success: false });
    }
  }
}