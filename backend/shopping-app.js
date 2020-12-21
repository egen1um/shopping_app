'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');

const shoppingApp = express();

const productRouter = require("./routes/product-routes");
const orderRouter = require("./routes/order-routes");

shoppingApp.use(express.static(path.join(__dirname, './client/build')));

shoppingApp.use(cors());
shoppingApp.use(express.json());
shoppingApp.use(productRouter);
shoppingApp.use(orderRouter);

shoppingApp.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

module.exports = shoppingApp;