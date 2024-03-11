import React from "react";
import productCardStyle from "./product-card.module.css";

const ProductCard = ({ product }) => {
  return (
    <section className={productCardStyle.section}>
      <p>{product.id}</p>
      <p>{product.product}</p>
      <p>{product.price.toLocaleString()}</p>
      <p>{product.brand ? product.brand : "Нет бренда"}</p>
    </section>
  );
};

export { ProductCard };
