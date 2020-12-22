class ShoppingAppClient {

    constructor(onError = response => console.log(response)) {
        this.onError = onError
    }

    async sendRequest(method, endpoint, json) {
        const fetchParams = {
            method: method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };

        if (json != null)
            fetchParams.body = JSON.stringify(json);

        let result = await fetch(endpoint, fetchParams);

        result = await result.text();

        if (result)
            result = JSON.parse(result);

        this.onError(result.error ? result.error : '');

        return result;
    }

    async createProduct(name, description, price) {
        return await this.sendRequest("post", "/product", {
            name: name,
            description: description,
            price: price
        });
    }

    async deleteProduct(id) {
        return await this.sendRequest("delete", `/product/${id}`, null);
    }

    async createOrder() {
        return await this.sendRequest("post", "/order", null);
    }

    async getProducts() {
        return await this.sendRequest("get", "/products", null);
    }

    async getOrders() {
        return await this.sendRequest("get", "/orders", null);
    }

    async addProductToOrder(productId, orderId) {
        return await this.sendRequest("put", `/order/${orderId}/${productId}`, null);
    }

    async getOrderById(id) {
        return await this.sendRequest("get", `/order/${id}`, null);
    }

    async deleteProductFromOrder(id) {
        return await this.sendRequest("delete", `/order/product/${id}`, null);
    }

    async placeOrder(id) {
        return await this.sendRequest("put", `/order/${id}/status/1`, null);
    }
}

export default ShoppingAppClient;