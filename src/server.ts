import express, { Express } from 'express';
import morgan from 'morgan';
import { routes } from './routes/index'
import cors from 'cors';


export class Server {
  private app: Express;

  constructor(){
    this.app = express();
    this.configuration();
    this.middlewares();
    this.routes();
  }

  configuration(){
    this.app.set('port', 8080);
  }

  middlewares(){
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes(){
    this.app.get('/', (req, res)=>{
      res.status(200).json({
        name:'API TWITTER PUBLISHER',
        status:  true
      })
    });

    this.app.use('/api/v1/tweet', routes.twitterRoutes);

  }

  listen(){
    this.app.listen(this.app.get('port'), ()=>{
      console.log(`Server running on port ${this.app.get('port')}`);      
    })
  }

}