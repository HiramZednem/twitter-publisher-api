import { Router } from 'express';
import { TwitterController } from '../controllers';
import multer from 'multer';

const router = Router();
const twitterController = new TwitterController();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('file'), twitterController.postTweet.bind(twitterController));

export default router;