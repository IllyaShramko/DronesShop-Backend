import express from 'express'
import { ProductRouter } from './Product/product.routes'

const app: express.Express = express()
app.use(express.json()); 
app.use("/products/", ProductRouter)


const PORT = 8000
const HOST = 'localhost'

app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`);
});