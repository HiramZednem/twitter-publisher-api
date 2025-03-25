import { Scraper } from "agent-twitter-client";
import { config, TwitterConfig } from "../schemas/config";
import logger from "./loggerService";
import { CacheManager } from "./cacheManager";

export class TwitterClient {
    private static instance: TwitterClient;
    client: Scraper;
    twitterConfig: TwitterConfig;
    cacheManager: CacheManager;

    private constructor() {
        this.client = new Scraper();
        this.twitterConfig = config;
        this.cacheManager = new CacheManager();
    }

    public static getInstance(): TwitterClient {
        if (!TwitterClient.instance) {
            TwitterClient.instance = new TwitterClient();
        }
        return TwitterClient.instance;
    }

    async init() {
        logger.info("Initializing Twitter client");
        const username = this.twitterConfig.TWITTER_USERNAME;
        const password = this.twitterConfig.TWITTER_PASSWORD;
        const email = this.twitterConfig.TWITTER_EMAIL;
        let retries = 3;
        const twitter2faSecret = this.twitterConfig.TWITTER_2FA_SECRET;

        const cookies = await this.cacheManager.get("cookies");
        
        if (Array.isArray(cookies)) {
            logger.info("Using cached cookies");
            await this.setCookiesFromArray(cookies);
        }

        if (!username) {
            throw new Error("Twitter username not configured");
        }

        logger.info("Waiting for Twitter login");
        while (retries > 0) {
            try {
                if (await this.client.isLoggedIn()) {
                    logger.info("Successfully logged in with cookies.");
                    break;
                } else {

                    await this.client.login(
                        username,
                        password,
                        email,
                        twitter2faSecret
                    );
                    if (await this.client.isLoggedIn()) {
                        logger.info("Successfully logged in manually.");
                        logger.info("Caching cookies");

                        await this.parseAndSetCookies(await this.client.getCookies(), "cookies");
                        break;
                    }
                    throw new Error("Twitter login with cookies failed");
                }
            } catch (error) {
                logger.error(`Login attempt failed: ${error}`);
            }

            retries--;
            logger.error(
                `Failed to login to Twitter. Retrying... (${retries} attempts left)`
            );

            if (retries === 0) {
                logger.error(
                    "Max retries reached. Exiting login process."
                );
                throw new Error("Twitter login failed after maximum retries.");
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }

    public async sendTweet(tweet: string, image?: Buffer, mimetype?: string) {
        let response: Response;

        if (image && mimetype) {
            const mediaData = [
                {
                data: image,
                mediaType: mimetype
                }
            ];
            response = await this.client.sendTweet(tweet, undefined, mediaData);
        } else {
            response = await this.client.sendTweet(tweet);
        }

        // response.tweet

        // console.log(response);
        
        return "jala";
    }

    private async setCookiesFromArray(cookiesArray: any[]) {
        const cookieStrings = cookiesArray.map(
            (cookie) =>
                `${cookie.cookie_key}=${cookie.cookie_value}; Domain=${cookie.domain}; Path=${cookie.path}; ${
                    cookie.secure ? "Secure" : ""
                }; ${cookie.httpOnly ? "HttpOnly" : ""}; SameSite=${
                    cookie.sameSite || "Lax"
                }`
        );
        await this.client.setCookies(cookieStrings);
    }

    private async parseAndSetCookies(cookies: any[], username: string) {
        const parsedCookies = cookies.map((cookie) => {
            if (typeof cookie !== 'object' || cookie === null) {
                throw new Error('Cookie is not an object: ' + JSON.stringify(cookie));
            }
    
            const { key, value, domain, path, secure, httpOnly, sameSite } = cookie;
    
            return {
                key: key.trim(),
                value: value.trim(),
                domain: domain || ".twitter.com",  // Default domain if not provided
                path: path || "/",  // Default path if not provided
                secure: secure || false,
                httpOnly: httpOnly || false,
                sameSite: sameSite || "Lax",  // Default SameSite if not provided
            };
        });
    
        await this.cacheManager.set(username, parsedCookies);
    }
}
