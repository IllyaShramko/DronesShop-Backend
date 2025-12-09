import express from 'express'
import { ProductRouter } from './Product/product.routes'
import { CategoryRouter } from './Category/category.routes'

const app: express.Express = express()
app.use(express.json()); 
app.use("/products/", ProductRouter)
app.use("/categories/", CategoryRouter)


const PORT = 8000
const HOST = 'localhost'

app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`);
});