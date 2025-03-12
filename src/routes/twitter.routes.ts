import { Router } from 'express';
// import { userController } from '../controllers';
// import { accessTokenAuth } from '../middlewares/jwtAuth';

const router = Router();

router.post('/', (req, res) => {
  res.status(200).json({
    name: 'API'
  });
});


export default router;