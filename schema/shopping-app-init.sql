CREATE SEQUENCE products_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE SEQUENCE orders_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;
	
CREATE SEQUENCE products_to_orders_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE TABLE orders
(
    id integer NOT NULL DEFAULT nextval('orders_id_seq'::regclass),
    created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status smallint NOT NULL DEFAULT 0,
    CONSTRAINT orders_pkey PRIMARY KEY (id)
);

CREATE TABLE products
(
    id integer NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    price numeric(5,2) NOT NULL,
    created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE products_to_orders
(
    id integer NOT NULL DEFAULT nextval('products_to_orders_id_seq'::regclass),
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    CONSTRAINT products_to_orders_pkey PRIMARY KEY (id),
    CONSTRAINT order_fk FOREIGN KEY (order_id)
        REFERENCES public.orders (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT product_fk FOREIGN KEY (product_id)
        REFERENCES public.products (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);