import {
    randomUUID
} from 'crypto'
import fs from 'fs/promises'

//constructor para creacion de productos nuevos
export class Product {
    constructor({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category
    }) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.id = randomUUID();
    }
}



export class ProductManager {

    constructor(path) {
        this.products;
        this.path = path;
    }


    async readProducts() {
        const data = await fs.readFile(this.path, "utf-8");
        this.products = JSON.parse(data);
    }

    async getProducts() {
        await this.readProducts();
        return this.products;
    }



    async addProduct(title, description, price, thumbnail, stock, code, category) {



        try {
            await this.getProducts()

            const productFind = this.products.find((product) => product.title === title)
            if (productFind) {
                console.log('Ya existe un producto con ese titulo');
            }

            if (title !== undefined && description !== undefined && price !== undefined && stock !== undefined && code !== undefined && category !== undefined) {
                const product = new Product({
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    stock: stock,
                    code: code,
                    category: category
                })

                this.products.push(product)
                const jsonProducts = JSON.stringify(this.products, null, 2)
                await fs.writeFile(this.path, jsonProducts)

            }

        } catch (error) {
            throw new Error("Los campos no pueden estar vacios")
        }

    }


    async getProductById(id) {

        const jsonProducts = await fs.readFile(this.path, 'utf-8')
        this.products = JSON.parse(jsonProducts)

        const productFind = this.products.find((product) => product.id === id)
        if (productFind === undefined) {
            throw new Error("producto no encontrado o ID invalido")
        } else {

            return productFind
        }

    }

    async updateProduct(id, prodModificado) {

        const jsonProducts = await fs.readFile(this.path, 'utf-8')
        this.products = JSON.parse(jsonProducts)

        const product = this.products.find((prod) => prod.id === id);
        const indice = this.products.findIndex(p => p.id === id)

        if (!product) {
            throw new Error("El id no existe");
        }

        const nuevoProducto = new Product({
            ...product,
            ...prodModificado
        })
        nuevoProducto.id = id
        this.products[indice] = nuevoProducto

        const jsonProductsModif = JSON.stringify(this.products, null, 2)

        console.log("El producto se actualizo con exito", nuevoProducto);
        await fs.writeFile(this.path, jsonProductsModif)
    }



    async deleteProduct(id) {
        const jsonProducts = await fs.readFile(this.path, 'utf-8')
        this.products = JSON.parse(jsonProducts)

        const productFindIndex = this.products.findIndex((product) => product.id === id)

        if (productFindIndex === -1) {
            throw new Error("Product Not found");
        } else {
            this.products.splice(productFindIndex, 1)
            console.log('Product deleted');

            const jsonProducts = JSON.stringify(this.products, null, 2)
            await fs.writeFile(this.path, jsonProducts)
        }

    }
}


// const prod1 = productManager.addProduct(    "tv12",   "descripcion prod 3",    4000,    "url imagen",     45,     "televisor");

// const prod2 = productManager.addProduct("tv2", "descripcion prod 2", 2500, "url imagen", 45);
// const prod3 = productManager.addProduct("tv3", "descripcion prod 3", 3500, "url imagen", 45);
// const prod4 = productManager.addProduct("tv4", "descripcion prod 3", 3500, "url imagen", 45);
// const prod5 = productManager.addProduct("tv5", "descripcion prod 3", 3500, "url imagen", 45);

// productManager.deleteProduct('6c80a977-dfa6-489a-a8a6-51d6861c26fd')

// console.log('console log de get products',await productManager.getProducts());

// console.log("producto filtrado por ID", productManager.getProductById('6c80a977-dfa6-489a-a8a6-51d6861c26fd'));


export class CartManager {


    constructor(path) {
        this.carts;
        this.path = path;
        this.products = [];
    }
    async readCarts() {
        const data = await fs.readFile(this.path, "utf-8");
        this.carts = JSON.parse(data);
    }

    async getCarts() {
        await this.readCarts();
        return this.carts;
    }

    async crearCarrito() {

        await this.getCarts()
        const cart = {
            "id": randomUUID(),
            "quantity": 0,
            "products": []
        }
        this.carts.push(cart)

        const jsonCarts = JSON.stringify(this.carts, null, 2)
        await fs.writeFile(this.path, jsonCarts)

    }
    // 
    async agregarProductoAlCarrito(cid, pid) {
        try {
            //instancio productManager
            const productManager = new ProductManager('./productos.txt');

            //ubico producto por pid
            const productos = await productManager.getProducts()
            const productoIndex = productos.findIndex(prod => prod.id == pid)
            const productoFiltrado = productos[productoIndex]

            //ubico carrito por cid
            const carritos = await this.getCarts()
            const carritoIndex = carritos.findIndex(carrito => carrito.id == cid)
            const carritoFiltrado = carritos[carritoIndex]

            //formato de producto a pushear al array de productos del carrito
            let cant = 1
            const produID = {
                "id": `${productoFiltrado.id}`,
                "quantity": `${cant}`
            };

            //array con todos los IDs de los productos del carrito
            const idsDentroDelCarrito = [];
            const carritoProductos = carritoFiltrado.products
            carritoProductos.forEach(element => {
                idsDentroDelCarrito.push(element.id)
            });

            //utilizo array de ids para saber si incluye PID. modifico cantidades o creo nuevo objeto
            if (idsDentroDelCarrito.includes(pid)) {
                const productoDentroDelCarrito = carritoProductos.find(element => element.id == pid)
                productoDentroDelCarrito.quantity++;
                carritoFiltrado.quantity++;
                await this.saveCart()
            } else {
                const push = carritoProductos.push(produID)
                carritoFiltrado.quantity++;
                this.carts[carritoIndex].products = carritoProductos
                await this.saveCart()
            }

            //Persistencia de archivos
            await this.saveCart()

             return { "message": "producto cargado correctamente"  }
        } catch (error) {
            return error.message
        }
    }


    async saveCart() {

        const jsonCarts = JSON.stringify(this.carts, null, 2)
        await fs.writeFile(this.path, jsonCarts)
    }
    async getCartById(id) {

        const carritos = await this.getCarts()

        const carritoIndex = carritos.findIndex(carrito => carrito.id == id)
        const carritoFiltrado = carritos[carritoIndex]

        return carritoFiltrado

    }

}
// const carrito = new CartManager('../carrito.txt')
// await carrito.agregarProductoAlCarrito('a6cd0621-fe82-4374-99ea-f78f1e50c998', '44820200-b24d-478f-84e9-e69c4f8cf650')

// const product = {
//     "title": "tv2",
//     "description": "descripcion prod 2",
//     "price": 2500,
//     "thumbnail": "url imagen",
//     "stock": 45,
//     "code": "televisor",
//     "category": "hogar",
//     "status": true,
//     "id": "44820200-b24d-478f-84e9-e69c4f8cf650"
//   };


// await carrito.addProduct("44820200-b24d-478f-84e9-e69c4f8cf650", product)

// console.log(await carrito.getCarts())

// console.log(await carrito.getCartById("a6cd0621-fe82-4374-99ea-f78f1e50c998"))

