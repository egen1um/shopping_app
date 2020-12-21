const router = require('express').Router();
const {pool} = require("../db-connection-pool");

router.get('/products', (req, res) => {
    pool
        .query("SELECT * FROM products;")
        .then(result => res.json({products: result.rows}))
        .catch(queryError => {
            console.error('Error executing query', queryError.stack);
            res.status(500).json({
                error: "There was an error getting the products. Check logs for more information."
            });
        });
});

router.post('/product', (req, res) => {
    pool
        .query("INSERT INTO products(name, description, price) VALUES ($1, $2, $3) RETURNING id;", [req.body.name, req.body.description, req.body.price])
        .then(queryResult => res.json({
            productId: queryResult.rows[0].id
        }))
        .catch(queryError => {
            console.error('Error executing query', queryError.stack);
            res.status(500).json({
                error: "There was an error adding the product. Check logs for more information."
            });
        });
});

router.delete('/product/:id', (req, res) => {
    pool
        .query("DELETE FROM products WHERE id=$1;", [req.params.id])
        .then(_ => res.status(200).end())
        .catch(queryError => {
            console.error('Error executing query', queryError.stack);
            res.status(500).json({
                error: "There was an error removing the product. Check logs for more information."
            });
        });
});

module.exports = router;