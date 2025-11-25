import express from 'express'

const app: express.Express = express()

const PORT = 8000
const HOST = 'localhost'

app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`);
});