import { Scraper } from "agent-twitter-client";
import { config, TwitterConfig } from "../schemas/config";

export class TwitterClient {
    twitterClient: Scraper;
    twitterConfig: TwitterConfig;


    constructor() {
        this.twitterClient = new Scraper();
        this.twitterConfig = config;
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

        // const cachedCookies = await this.getCachedCookies(username);

        // if (cachedCookies) {
        //     console.info("Using cached cookies");
        //     await this.setCookiesFromArray(cachedCookies);
        // }
        console.log("Waiting for Twitter login");
        while (retries > 0) {
            try {
                if (await this.twitterClient.isLoggedIn()) {
                    // cookies are valid, no login required
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
                        // fresh login, store new cookies
                        console.info("Successfully logged in.");
                        console.info("Caching cookies");
                        // await this.cacheCookies(
                        //     username,
                        //     await this.twitterClient.getCookies()
                        // );
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
          

        const response = await this.twitterClient.sendTweet(tweet );
        console.log(response);
    }


    // private async setCookiesFromArray(cookiesArray: any[]) {
    //     const cookieStrings = cookiesArray.map(
    //         (cookie) =>
    //             `${cookie.key}=${cookie.value}; Domain=${cookie.domain}; Path=${cookie.path}; ${
    //                 cookie.secure ? "Secure" : ""
    //             }; ${cookie.httpOnly ? "HttpOnly" : ""}; SameSite=${
    //                 cookie.sameSite || "Lax"
    //             }`
    //     );
    //     await this.twitterClient.setCookies(cookieStrings);
    // }

    // private  async getCachedCookies(username: string) {
    //     return await this.runtime.cacheManager.get<any[]>(
    //         `twitter/${username}/cookies`
    //     );
    // }

    // private async cacheCookies(username: string, cookies: any[]) {
    //     await this.runtime.cacheManager.set(
    //         `twitter/${username}/cookies`,
    //         cookies
    //     );
    // }

}