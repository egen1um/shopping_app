const router = require('express').Router();
const {pool} = require("../db-connection-pool");
const config = require('../config');


function calculatePrice(products) {
    function getPriceById(id, products) {
        for (let product of products)
            if (product.id === id)
                return product.price;
        return null;
    }

    let totalPrice = products.reduce((sum, product) => sum + product.price, 0);
    let discount = 0;

    if (totalPrice > config.AMOUNT_THRESHOLD_FOR_DISCOUNT)
        discount = config.AMOUNT_THRESHOLD_DISCOUNT;

    const uniqueProductIds = new Set(products.map(product => product.id));

    uniqueProductIds.forEach(id => {
        const productCount = products.reduce((cnt, product) => product.id === id ? ++cnt : cnt, 0);
        if (productCount >= config.PRODUCT_NUM_TO_GET_FREE) {
            const freeProductCount = Math.floor(productCount / config.PRODUCT_NUM_TO_GET_FREE);
            discount += freeProductCount * getPriceById(id, products);
        }
    });

    return {
        totalPrice: totalPrice.toFixed(2),
        discount: discount.toFixed(2),
        calculatedPrice: (totalPrice - discount).toFixed(2)
    };
}

async function getOrderWithProducts(orderId) {
    let result = await pool.query('SELECT * FROM orders WHERE id=$1;', [orderId]);

    if (result.rowCount === 0)
        throw {result: 0, error: `Order ${orderId} doesn't exist.`};

    const order = result.rows[0];
    result = await pool.query('SELECT products_to_orders.id, product_id, name, price FROM products_to_orders  INNER JOIN products ON product_id = products.id WHERE order_id=$1;', [orderId]);
    order.products = result.rows;

    order.price = calculatePrice(order.products.map(product => {
        return {id: product.product_id, price: parseFloat(product.price)};
    }));

    return order;
}

async function getOrderStatus(orderId) {
    let result = await pool.query('SELECT status FROM orders WHERE id=$1', [orderId]);
    if (result.rowCount === 0)
        throw {error: `Order ${orderId} doesn't exist.`};

    return result.rows[0].status;
}

router.get('/orders', (req, res) => {
    pool
        .query("SELECT * FROM orders;")
        .then(queryResult => res.json({orders: queryResult.rows}))
        .catch(queryError => {
            console.error('Error executing query', queryError.stack);
            res.status(500).json({
                error: "Error getting the products. Check logs for more information."
            });
        });
});

router.post('/order', (req, res) => {
    pool
        .query("INSERT INTO orders DEFAULT VALUES RETURNING id;")
        .then(queryResult => res.json({orderId: queryResult.rows[0].id}))
        .catch(queryError => {
            console.error('Error executing query', queryError.stack);
            res.status(500).json({
                error: "Error getting the products. Check logs for more information."
            });
        });
});

router.put('/order/:orderId/status/:status', (req, res) => {
    (async () => {
        const order = await getOrderWithProducts(req.params.orderId);
        if (order.price.calculatedPrice > config.MAX_ORDER_PRICE && req.params.status !== 0) {
            res.status(400).json({error: `You can't place orders above ${config.MAX_ORDER_PRICE}`});
            return;
        }

        if (order.products.length === 0) {
            res.status(400).json({error: `You can't place empty orders`});
            return;
        }

        pool.query('UPDATE orders SET status=$1 WHERE id=$2', [req.params.status, req.params.orderId]).then(_ => res.json({result: 1}));

    })().catch(err =>
        setImmediate(() => {
            console.log(err.stack);
            res.status(400).json({
                result: 0,
                error: "Error getting the order. Check logs for more information."
            });
        })
    );
});

router.get('/order/:id', (req, res) => {
    (async () => {
        const order = await getOrderWithProducts(req.params.id);
        res.json({order: order});
    })().catch(err =>
        setImmediate(() => {
            if (err.error)
                res.status(400).json(err);
            else {
                console.log(err.stack);
                res.status(500).json({
                    error: "Error getting the order. Check logs for more information."
                });
            }
        })
    );
});

router.put('/order/:orderId/:productId', (req, res) => {
    (async () => {
        const status = await getOrderStatus(req.params.orderId);
        if (status !== 0)
            throw {error: `Order ${req.params.orderId} already placed. You can't modify it.`};

        const result = await pool.query('INSERT INTO products_to_orders (product_id, order_id) VALUES ($1, $2) RETURNING id', [req.params.productId, req.params.orderId]);
        const productToOrderId = result.rows[0].id;

        res.status(200).json({productToOrderId: productToOrderId});
    })().catch(err =>
        setImmediate(() => {
            if (err.error)
                res.status(400).json(err);
            else {
                console.log(err.stack);
                res.status(500).json({
                    error: "Error adding product to order. Check logs for more information."
                });
            }
        })
    );
});

router.delete('/order/product/:productToOrderId', (req, res) => {
    (async () => {
        const result = await pool.query('SELECT order_id FROM products_to_orders WHERE id=$1', [req.params.productToOrderId]);
        const orderId = result.rows[0].order_id;

        const status = await getOrderStatus(orderId);
        if (status !== 0)
            throw {error: `Order ${req.params.orderId} already placed. You can't modify it.`};

        await pool.query('DELETE FROM products_to_orders WHERE id=$1;', [req.params.productToOrderId]);

        res.status(200).end();
    })().catch(err =>
        setImmediate(() => {
            if (err.error)
                res.status(400).json(err);
            else {
                console.log(err.stack);
                res.status(500).json({
                    error: "Error deleting product from order. Check logs for more information."
                });
            }
        })
    );
});

router.delete('/order/:id', (req, res) => {
    pool
        .query("DELETE FROM orders WHERE id=$1;", [req.params.id])
        .then(_ => res.status(200).end())
        .catch(queryError => {
            console.error('Error executing query', queryError.stack);
            res.status(500).json({
                result: 0,
                error: "Error removing the order. Check logs for more information."
            });
        });
});

module.exports = router;
