

import { PersistentSystem } from './PersistentSystem';
import { PersistentFileSystem } from './PersistentFileSystem';
import { VocabularyCollection, Vocabulary } from '../types/Types';


import * as express from 'express';

import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';


const whiteListDomain = ['http://localhost:8080', 'http://localhost:4200', 'http://koserver.childs', 'http://koserver.parents'];

class DataBaseServer {

    expressApp: Express.Application;
    persistentSystem: PersistentSystem;

    constructor(dir: string) {

        this.persistentSystem = new PersistentFileSystem(dir);

        const app = express();
        app.use(
            bodyParser.json({ limit: '50mb' }),
            cors({
                origin: function (origin, callback) {
                    // allow requests with no origin 
                    // (like mobile apps or curl requests)
                    if (!origin) return callback(null, true);
                    if (whiteListDomain.indexOf(origin) === -1) {
                        const msg = 'The CORS policy for this site does not ' +
                            'allow access from the specified Origin.';
                        return callback(new Error(msg), false);
                    }
                    return callback(null, true);
                }
            }));


        this.expressApp = app;

        // Initialize Rest interface
        this.initRest(app);

    }


    initRest(app: express.Application): void {

        //show all vocabularies
        app.get('/api/vocabularies/chapter/:id', (req: Request, res: Response) => {
            const vocabularies = this.persistentSystem.getVocabulariesOfChapter(req.params.id);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": vocabularies }));
        });

        //show all vocabularies
        app.get('/api/vocabularies/lesson/:user/:lesson', (req: Request, res: Response) => {
            const vocabularies = this.persistentSystem.getVocabulariesOfLesson(req.params.user, req.params.lesson, -1);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": vocabularies }));
        });

        //show all vocabularies
        app.get('/api/vocabularies/lesson/:user/:lesson/:number', (req: Request, res: Response) => {
            const vocabularies = this.persistentSystem.getVocabulariesOfLesson(req.params.user, req.params.lesson, parseInt(req.params.number));
            res.send(JSON.stringify({ "status": 200, "error": null, "response": vocabularies }));
        });

        //get vocabularies of lesson with highest prio
        app.post('/api/tests/lesson/:user/:lesson/:number', (req: Request, res: Response) => {
            const tests = this.persistentSystem.getTests(req.params.user, req.params.lesson, parseInt(req.params.number), req.body.wrapUpMode as boolean, req.body.startTime as number);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": tests }));
        });


        //update lessons
        app.post('/api/vocabularies/lesson/:user/:lesson', (req: Request, res: Response) => {
            const vocabularies = this.persistentSystem.updateVocabulariesOfLesson(req.params.user, req.params.lesson, req.body.vocabularies);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": vocabularies }));
        });

        //show all chapters
        app.get('/api/chapters', (req: Request, res: Response) => {
            const chapters = this.persistentSystem.getChapters();
            res.send(JSON.stringify({ "status": 200, "error": null, "response": chapters }));
        });

        //show all lessons (per user)
        app.get('/api/lessons/:user', (req: Request, res: Response) => {
            const lessons = this.persistentSystem.getLessons(req.params.user);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": lessons }));
        });


        //show all users
        app.get('/api/users', (req: Request, res: Response) => {
            const users = this.persistentSystem.getUsers();
            res.send(JSON.stringify({ "status": 200, "error": null, "response": users }));
        });

        //show all usersname
        app.get('/api/usersname', (req: Request, res: Response) => {
            const usersName = this.persistentSystem.getUsersName();
            res.send(JSON.stringify({ "status": 200, "error": null, "response": usersName }));
        });

        //show single product
        app.get('/api/user/:id', (req, res) => {
            const user = this.persistentSystem.getUser(req.params.id);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));

        });

        //add new vocabularies
        app.post('/api/vocabularies', (req: Request, res: Response) => {


            const vocabularies = this.persistentSystem.addVocabularies(req.body.vocabularies);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": vocabularies }));
        });

        //update test
        app.put('/api/test/result/wrong/:user', (req: Request, res: Response) => {
            const test = this.persistentSystem.updateTest(req.params.user, req.body.test, false);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": test }));
        });

        app.put('/api/test/result/ok/:user', (req: Request, res: Response) => {
            const test = this.persistentSystem.updateTest(req.params.user, req.body.test, true);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": test }));
        });


        app.put('/api/test/result/cheated/:user', (req: Request, res: Response) => {
            const test = this.persistentSystem.updateTest(req.params.user, req.body.test, null);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": test }));
        });

        //update user
        app.put('/api/user', (req, res) => {
            const user = this.persistentSystem.updateUser(req.body.user);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));
        });

        //Delete product
        app.delete('/api/products/:id', (req, res) => {
            this.persistentSystem.deRegister(req.body.vocabulary, req.params.id);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": null }));
        });

        //Server listening
        const server = app.listen(9530, () => {
            const host = server.address();
            const port = server.address();
            console.log("Example app listening at http://%s:%s", host, port)
        });

        //delete training day
        app.put('/api/test/result/delete/:user', (req: Request, res: Response) => {
            const vocabularies = this.persistentSystem.deleteTrainingDay(req.params.user, req.body.dayToDelete);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": vocabularies }));
        });

        //clean up database
        app.put('/api/database/cleanup', (req: Request, res: Response) => {
            const vocabularies = this.persistentSystem.cleanUpDatabase();
            res.send(JSON.stringify({ "status": 200, "error": null, "response": vocabularies }));
        });

        //delete chapter from database
        app.put('/api/database/deletechapter', (req: Request, res: Response) => {
            const vocabularies = this.persistentSystem.deleteChapter(req.body.chapter);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": vocabularies }));
        });

        //make git commit
        app.put('/api/database/gitCommit', (req: Request, res: Response) => {
            this.persistentSystem.commitGit();
            res.send(JSON.stringify({ "status": 200, "error": null, "response": {} }));
        });
    }

}


export { DataBaseServer };

