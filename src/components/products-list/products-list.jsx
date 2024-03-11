import React from "react";
import productsListStyle from "./products-list.module.css";
import { ProductCard } from "./product-card/product-card";

const ProductsList = ({ products }) => {
  return (
    <ul className={productsListStyle.list}>
      {products.map((el) => (
        <li key={el.id} className={productsListStyle.item}>
          <ProductCard product={el} />
        </li>
      ))}
    </ul>
  );
};

export { ProductsList };
