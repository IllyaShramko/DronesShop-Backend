import express from 'express'
import { ProductRouter } from './Product/product.routes'
import { CategoryRouter } from './Category/category.routes'
import { UserRouter } from './User/user.routes';

const app: express.Express = express()
app.use(express.json()); 
app.use("/products/", ProductRouter)
app.use("/categories/", CategoryRouter)
app.use("/user/", UserRouter)


const PORT = 8000
const HOST = 'localhost'

app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`);
});