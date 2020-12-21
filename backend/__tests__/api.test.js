const app = require('../shopping-app');
const request = require('supertest');

const {pool} = require("../db-connection-pool");

describe("Test product API", () => {
    let productId;
    let productCount;

    it("Test get products", async () => {
        const res = await request(app).get('/products');
        expect(res.status).toBe(200);
        productCount = res.body.products.length;
    });

    it("Test create product", async () => {
        let res = await request(app).post('/product').send({
            name: "dummyName",
            description: "dummyDescription",
            price: 16.20
        });
        expect(res.status).toBe(200);
        productId = res.body.productId;

        res = await request(app).get('/products');
        expect(res.status).toBe(200);
        expect(res.body.products.length).toBe(productCount + 1);
    });

    it("Test delete product", async () => {
        let res = await request(app).delete(`/product/${productId}`);
        expect(res.status).toBe(200);

        res = await request(app).get('/products');
        expect(res.status).toBe(200);
        expect(res.body.products.length).toBe(productCount);
    });
});

describe("Test order API", () => {
    let orderId;
    let ordersCount;

    it("Test get orders", async () => {
        const res = await request(app).get('/orders');
        expect(res.status).toBe(200);
        ordersCount = res.body.orders.length;
    });

    it("Test create order", async () => {
        let res = await request(app).post('/order');
        expect(res.status).toBe(200);
        orderId = res.body.orderId;

        res = await request(app).get('/orders');
        expect(res.status).toBe(200);
        expect(res.body.orders.length).toBe(ordersCount + 1);
    });

    let productId;
    let productToOrderId;

    let expensiveProductId;
    let expensiveProductToOrderId;

    it("Test add product to not placed order & get order by id", async () => {
        let res = await request(app).post('/product').send({
            name: "dummyName",
            description: "dummyDescription",
            price: 16.20
        });
        productId = res.body.productId;

        res = await request(app).put(`/order/${orderId}/${productId}`);
        expect(res.status).toBe(200);
        productToOrderId = res.body.productToOrderId;

        res = await request(app).get(`/order/${orderId}`);
        expect(res.status).toBe(200);
        expect(res.body.order.products.length).toBe(1);
    });

    it("Test delete product from not placed order", async () => {
        let res = await request(app).delete(`/order/product/${productToOrderId}`);
        expect(res.status).toBe(200);

        res = await request(app).get(`/order/${orderId}`);
        expect(res.status).toBe(200);
        expect(res.body.order.products.length).toBe(0);
    });

    it("Test place empty order", async () => {
        const res = await request(app).put(`/order/${orderId}/status/1`);
        expect(res.status).not.toBe(200);
    });

    it("Test place order with amount too big", async () => {
        let res = await request(app).post('/product').send({
            name: "expensiveProduct",
            description: "expensiveProductDescription",
            price: 999
        });
        expensiveProductId = res.body.productId;

        res = await request(app).put(`/order/${orderId}/${expensiveProductId}`);
        expensiveProductToOrderId = res.body.productToOrderId;

        res = await request(app).put(`/order/${orderId}/status/1`);
        expect(res.status).not.toBe(200);

        res = await request(app).delete(`/order/product/${expensiveProductToOrderId}`);
        expect(res.status).toBe(200);
    });

    it("Test place proper order", async () => {
        let res = await request(app).put(`/order/${orderId}/${productId}`);
        productToOrderId = res.body.productToOrderId;

        res = await request(app).put(`/order/${orderId}/status/1`);
        expect(res.status).toBe(200);
    });

    it("Test add product to placed order", async () => {
        let res = await request(app).put(`/order/${orderId}/${productId}`);
        expect(res.status).not.toBe(200);
    });

    it("Test delete product from not placed order", async () => {
        let res = await request(app).delete(`/order/product/${productToOrderId}`);
        expect(res.status).not.toBe(200);
    });

    it("Test delete order", async () => {
        let res = await request(app).delete(`/order/${orderId}`);
        expect(res.status).toBe(200);

        res = await request(app).get('/orders');
        expect(res.status).toBe(200);
        expect(res.body.orders.length).toBe(ordersCount);
    });
});

afterAll(() => {
    pool.end();
});
