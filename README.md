# Demo shopping app

## Stack used:
* React.js
* Node.js
* Express.js
* PostgreSQL
* Docker / Docker-Compose
## Instructions
1. Download project to *local folder*
2. Run `docker-compose up` command in this *local folder*
3. Browse to `localhost:80` to use demo frontend

## Data types:
* ### Product: `{id: <int>, name: <string>, description: <string>, price: <float>, products: [<Product>...]}`
* ### Order: `{id: <int>, status: <int>, price: <Price>`
* ### Price: `{totalPrice: <float>, discount: <float>, calculatedPrice: <float>}`

## API reference


* ### *get* `/products` - get all products
    input: none\
    output: `{products: [<Product>...]}`  
  
* ### *post* `/product` - create new product
    input: `<Product>`(without **id**)\
    output: `{productId: <int>}`
  
* ### *delete* `/product/:id` - remove product by id
    input: `:id`\
    output: none
  
* ### *get* `/orders` - get all orders
    input: none\
    output: `{orders: [<Order>...]}` (without **products**) 
  
* ### *post* `/order` - create new order
    input: none\
    output: `{orderId: <int>}`
  
* ### *delete* `/order/:id` - delete order by id
    input: `:id`\
    output: none
  
* ### *put* `/order/:orderId/status/:status` - set order status (0 - being created, 1 - placed)
    input: `:orderId`, `:status`\
    output: none
  
* ### *put* `/order/:id` - get order by id with products
    input: `:id`\
    output: `<Order>`
  
* ### *put* `/order/:orderId/:productId` - add product to order
    input: `:orderId`, `:productId`\
    output: `{productToOrderId: <int>}`
  
* ### *delete* `/order/product/:productToOrderId` - removes product from order
    input: `:productToOrderId`\
    output: none
