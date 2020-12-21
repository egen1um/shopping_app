import React from "react";

function ProductViewInProducts(props) {
    return (
        <div className="product-view">
            <div className="name">{props.name}</div>
            <div className="description">{props.description}</div>
            <div>{props.price}</div>
            <div>
                <button onClick={() => props.handleClick(props.id)}>Delete</button>
            </div>
        </div>
    );
}

class NewProductView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "dummyName",
            description: "dummyDescription",
            price: 16.20
        };

        this.onFormChange = this.onFormChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormSubmit(event) {
        event.preventDefault();
        (async () => {
            await this.props.client.createProduct(this.state.name, this.state.description, this.state.price);
            this.props.onProductCreated();
        })();
    }

    onFormChange(event) {
        const target = event.target;
        this.setState({
            [target.name]: target.value
        });
    }

    render() {
        return (
            <div className="new-product-view">
                <h3>Create new product:</h3>
                <form onSubmit={this.onFormSubmit}>
                    <input name="name" type="text" defaultValue={this.state.name} onChange={this.onFormChange}/>
                    <textarea name="description" defaultValue={this.state.description} onChange={this.onFormChange}/>
                    <input name="price" type="text" defaultValue={this.state.price} onChange={this.onFormChange}/>
                    <input type="submit" value="Create"/>
                </form>
            </div>
        );
    }
}

class ProductsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: props.products
        };
        this.onDeleteClick = this.onDeleteClick.bind(this);
    }

    onDeleteClick(id) {
        (async () => {
            await this.props.client.deleteProduct(id);
            this.props.refreshProductList();
        })();
    }

    render() {
        if (!this.props.display)
            return null;

        const productViews = this.props.products.map(product =>
            <ProductViewInProducts
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                handleClick={this.onDeleteClick}
            />
        );

        return (
            <div>
                <NewProductView client={this.props.client} onProductCreated={this.props.refreshProductList}/>
                <div className="content">
                    {productViews}
                </div>
            </div>);
    }
}

export default ProductsView;
