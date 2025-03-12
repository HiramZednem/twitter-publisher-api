import { Scraper } from "agent-twitter-client";
import { config, TwitterConfig } from "../schemas/config";

export class TwitterClient {
    private static instance: TwitterClient;
    twitterClient: Scraper;
    twitterConfig: TwitterConfig;

    private constructor() {
        this.twitterClient = new Scraper();
        this.twitterConfig = config;
    }

    public static getInstance(): TwitterClient {
        if (!TwitterClient.instance) {
            TwitterClient.instance = new TwitterClient();
        }
        return TwitterClient.instance;
    }

    async init() {
        const username = this.twitterConfig.TWITTER_USERNAME;
        const password = this.twitterConfig.TWITTER_PASSWORD;
        const email = this.twitterConfig.TWITTER_EMAIL;
        let retries = 3;
        const twitter2faSecret = this.twitterConfig.TWITTER_2FA_SECRET;

        if (!username) {
            throw new Error("Twitter username not configured");
        }

        console.log("Waiting for Twitter login");
        while (retries > 0) {
            try {
                if (await this.twitterClient.isLoggedIn()) {
                    console.info("Successfully logged in.");
                    break;
                } else {
                    await this.twitterClient.login(
                        username,
                        password,
                        email,
                        twitter2faSecret
                    );
                    if (await this.twitterClient.isLoggedIn()) {
                        console.info("Successfully logged in.");
                        console.info("Caching cookies");
                        break;
                    }
                }
            } catch (error) {
                console.error(`Login attempt failed: ${error}`);
            }

            retries--;
            console.error(
                `Failed to login to Twitter. Retrying... (${retries} attempts left)`
            );

            if (retries === 0) {
                console.error(
                    "Max retries reached. Exiting login process."
                );
                throw new Error("Twitter login failed after maximum retries.");
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }

    async sendTweet(tweet: string, image?: Buffer) {
        const mediaData = [
            {
              data: image,
              mediaType: 'image/jpeg'
            }
        ];

        const response = await this.twitterClient.sendTweet(tweet);
        console.log(response);
    }
}
