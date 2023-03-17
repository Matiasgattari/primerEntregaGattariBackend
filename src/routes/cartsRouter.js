import express, {
    json,
    Router
} from 'express';
import {
    CartManager,
    Product,
    ProductManager
} from '../../public/productManajer.js';
import {
    randomUUID
} from 'crypto'


export const cartsRouter = Router()
cartsRouter.use(express.json())
cartsRouter.use(express.urlencoded({
    extended: true
}))


const productManager = new ProductManager('./productos.txt');
const cartManager = new CartManager('./carrito.txt')

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const id = req.params.cid
        const carritoID = await cartManager.getCartById(id)

        res.json(carritoID)
    } catch (error) {
        throw new Error("id de carrito no encontrado ")
    }

})


cartsRouter.get('/', async (req, res) => {

    res.send(await cartManager.getCarts())
})



cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid

        // const productos = await productManager.getProducts()
        // const carritos = await cartManager.getCarts()
// const producto = await productManager.getProductById(pid)
        // const actualizado = await cartManager.agregarProductoAlCarrito(cid,pid)
        // const carritoActualizado = await cartManager.getCartById(cid)
        // const prodAct = await cartManager.getCartById(cid)
    // res.json({"message": "producto cargado correctamente"})
const bla = await cartManager.agregarProductoAlCarrito(cid,pid)


    res.json(bla)
    } catch (error) {
        throw new Error('id no encontrado')
    }
})