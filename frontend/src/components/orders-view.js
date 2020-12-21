import React from "react";

const ORDER_STATUS = [
    "BEING_CREATED",
    "PLACED"
]

function ProductViewInOrders(props) {
    return (
        <div className="product-view">
            <div className="name">{props.name}</div>
            <div className="description">{props.description}</div>
            <div>{props.price}</div>
            <div className="controls">
                <button onClick={() => props.onAddToOrderClick(props.id)}>Add to order</button>
            </div>
        </div>
    );
}

class LoadOrderView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: "Order ID"
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event) {
        this.setState({orderId: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.onLoadOrderClick(this.state.orderId);
    }

    render() {
        return (
            <div className="new-product-view">
                <h3>Load order:</h3>
                <form onSubmit={this.onSubmit}>
                    <input type="text" defaultValue={this.state.name} onChange={this.onChange}/>
                    <input type="submit" value="Load"/>
                </form>
            </div>
        );
    }
}

class CurrentOrderView extends React.Component {
    constructor(props) {
        super(props);

        this.onDeleteProductFromOrderClick = this.onDeleteProductFromOrderClick.bind(this);
        this.onPlaceOrderClick = this.onPlaceOrderClick.bind(this);
    }

    onDeleteProductFromOrderClick(id) {
        (async () => {
            const response = await this.props.client.deleteProductFromOrder(id);
            if (!response.error)
                this.props.refreshCurrentOrder(this.props.order.id);
        })();
    }

    onPlaceOrderClick() {
        (async () => {
            const response = await this.props.client.placeOrder(this.props.order.id);
            if (!response.error)
                this.props.refreshCurrentOrder(this.props.order.id);
        })();
    }

    render() {
        if (!this.props.order)
            return null;

        const products = this.props.order.products.map(product =>
            <li key={product.id} className="order-item">
                <div>{product.name}</div>
                <div>{product.price}</div>
                <button onClick={() => this.onDeleteProductFromOrderClick(product.id)}>X</button>
            </li>
        );

        return (
            <div className="new-product-view">
                <h3>Current order:</h3>
                <div>{`Order # ${this.props.order.id}`}</div>
                <ul>
                    {products}
                </ul>
                <div>{`Total price: ${this.props.order.price.totalPrice}`}</div>
                <div>{`Discount: ${this.props.order.price.discount}`}</div>
                <div>{`Final price: ${this.props.order.price.calculatedPrice}`}</div>
                <div>{`Status: ${ORDER_STATUS[this.props.order.status]}`}</div>
                <div><button onClick={this.onPlaceOrderClick}>Place</button></div>
            </div>
        );
    }
}

class OrdersView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentOrder: null
        };

        this.onAddToOrderClick = this.onAddToOrderClick.bind(this);
        this.onLoadOrderClick = this.onLoadOrderClick.bind(this);
        this.refreshCurrentOrder = this.refreshCurrentOrder.bind(this);
    }

    onAddToOrderClick(productId) {
        (async () => {
            let orderId;
            if (!this.state.currentOrder) {
                const result = await this.props.client.createOrder();
                orderId = result.orderId;
            } else
                orderId = this.state.currentOrder.id;

            const res = await this.props.client.addProductToOrder(productId, orderId);
            if (!res.error)
                this.refreshCurrentOrder(orderId);
        })();
    }

    onLoadOrderClick(orderId) {
        this.refreshCurrentOrder(orderId);
    }

    refreshCurrentOrder(orderId) {
        (async () => {
            const res = await this.props.client.getOrderById(orderId);
            this.setState({currentOrder: res.order});
        })();
    }

    render() {
        if (!this.props.display)
            return null;

        const productViews = this.props.products.map(product =>
            <ProductViewInOrders
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                onAddToOrderClick={this.onAddToOrderClick}
            />
        );

        return (
            <div>
                <LoadOrderView
                    onLoadOrderClick={this.onLoadOrderClick}
                />
                <CurrentOrderView
                    order={this.state.currentOrder}
                    refreshCurrentOrder={this.refreshCurrentOrder}
                    client={this.props.client}
                />
                <div className="content">
                    {productViews}
                </div>
            </div>);
    }
}

export default OrdersView;
