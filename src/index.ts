import express, {Express, NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import createHttpError from "http-errors";
import exp from "constants";

dotenv.config();

const app: Express = express();
const port = Number(process.env.PORT)||3000;

// index page
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!<p></p><a href="/home">Home</a>');
});
// static files
let options = {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '7d',
    redirect: false,
    setHeaders: function (res: Response, path: string, stat: any) {
        res.set('x-timestamp', String(Date.now()));
    }
}
app.use(express.static('public',options));
// error handling
app.use((req, res, next) => {
    next(new createHttpError.NotFound());
});
const errorHandler = (err: createHttpError.HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.send({
        status: err.status || 500,
        message: err.message,
    });
}
app.use(errorHandler);
// start the Express server
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
