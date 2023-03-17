import express, {Router} from 'express';
import { productsRouter } from './routes/productsRouter.js';
import { cartsRouter } from './routes/cartsRouter.js';


const PORT = 8080;
const app = express()



app.get('/', (req,res)=>{

res.send(`<h1>Servidor levantado</h1>`)

})


app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)


app.get('/products', (req,res)=>{

res.send(`<h1>Productos</h1>`)

})
app.get('/carts', (req,res)=>{

res.send(`<h1>Carritos</h1>`)

})











const httpServer = app.listen(PORT,()=>{console.log(`Servidor levantado en puerto ${PORT}`);} )