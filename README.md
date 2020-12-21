# Demo shopping app

## Stack used:
* React.js
* Node.js
* Express.js
* PostgreSQL
* Docker / Docker-Compose
## Instructions
1. Download project to *local folder*
* *If localhost ports 80 and 5432 are unavailable, edit `docker-compose.yml`*
2. Run `docker-compose up` command in this *local folder*
3. Browse to `localhost:80` to use demo frontend

## Data types:
* Product: `{id: <int>, name: <string>, description: <string>, price: <float>}`
* Order: `{id: <int>, status: <int>, products: [<Product>...], price: <Price>`
* Price: `{totalPrice: <float>, discount: <float>, calculatedPrice: <float>}`

## API reference


*  __*get* `/products` - get all products__\
    input: none\
    output: `{products: [<Product>...]}`  
  
* __*post* `/product` - create new product__\
    input: `<Product>`(without **id**)\
    output: `{productId: <int>}`
  
* __*delete* `/product/:id` - remove product by id__\
    input: `:id`\
    output: none
  
* __*get* `/orders` - get all orders__\
    input: none\
    output: `{orders: [<Order>...]}` (without **products**) 
  
* __*post* `/order` - create new order__\
    input: none\
    output: `{orderId: <int>}`
  
* __*delete* `/order/:id` - delete order by id__\
    input: `:id`\
    output: none
  
* __*put* `/order/:orderId/status/:status` - set order status (0 - being created, 1 - placed)__\
    input: `:orderId`, `:status`\
    output: none
  
* __*put* `/order/:id` - get order by id with products__\
    input: `:id`\
    output: `<Order>`
  
* __*put* `/order/:orderId/:productId` - add product to order__\
    input: `:orderId`, `:productId`\
    output: `{productToOrderId: <int>}`
  
* __*delete* `/order/product/:productToOrderId` - removes product from order__\
    input: `:productToOrderId`\
    output: none
