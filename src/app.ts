import express, {Express, Request, Response} from 'express'

const app: Express = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Tsena')
})

export default app