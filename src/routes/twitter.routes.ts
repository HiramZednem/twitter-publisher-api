import { Router } from 'express';
import { TwitterController } from '../controllers';

const router = Router();
const twitterController = new TwitterController();

router.post('/',  twitterController.postTweet.bind(twitterController));


export default router;