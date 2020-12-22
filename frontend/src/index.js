import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ProductsView from './components/products-view';
import OrdersView from './components/orders-view';

import ShoppingAppClient from "./shopping-app-client";

class Content extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayPage: "ProductsView",
            products: [],
            error: null
        };

        this.refreshProductList = this.refreshProductList.bind(this);
        this.displayErrorMsg = this.displayErrorMsg.bind(this);

        this.shoppingAppClient = new ShoppingAppClient(this.displayErrorMsg);

        (async () => {
            const res = await this.shoppingAppClient.getProducts();
            this.setState({products: res.products});
        })();
    }

    refreshProductList() {
        console.log("refreshProductList");
        (async () => {
            const res = await this.shoppingAppClient.getProducts();
            this.setState({products: res.products});
        })();
    }

    displayErrorMsg(error) {
        this.setState({error: error});
    }

    render() {
        return (
            <div>
                <div className="menu">
                    <div className="error-msg">{this.state.error}</div>
                    <button onClick={() => this.setState({displayPage: "ProductsView"})}>ProductsView</button>
                    <button onClick={() => this.setState({displayPage: "OrdersView"})}>OrdersView</button>
                </div>

                <ProductsView
                    products={this.state.products}
                    display={this.state.displayPage === "ProductsView"}
                    refreshProductList={this.refreshProductList}
                    client={this.shoppingAppClient}
                />
                <OrdersView
                    products={this.state.products}
                    display={this.state.displayPage === "OrdersView"}
                    client={this.shoppingAppClient}
                />
            </div>
        );
    }
}

ReactDOM.render(
    <Content/>,
    document.getElementById('root')
);
