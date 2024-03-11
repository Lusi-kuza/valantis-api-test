import React, { useState } from "react";
import optionsFieldStyle from "./options-field.module.css";
import {
  getBrandsFields,
  getFilteredProductsId,
  getProductsIDs,
} from "../../utils/product-API";
import { Button } from "../button/button";

const OptionsField = ({ getAllProducts, getFilteredProduct }) => {
  const [optionsFieldState, setOptionsFieldState] = useState({
    brands: [],
    inputValue: "",
    activeField: "all",
    activeBrand: "",
  });

  const handleInputChange = (e) => {
    setOptionsFieldState({ ...optionsFieldState, inputValue: e.target.value });
  };

  const setActiveField = (field) => {
    setOptionsFieldState((prevState) => {
      return { ...prevState, activeField: field, inputValue: "" };
    });
  };

  const getBrandFieldsHandler = () => {
    if (optionsFieldState.brands.length > 0) return;
    getBrandsFields().then((data) => {
      const uniqueList = [...new Set(data.result)];
      setOptionsFieldState((prevState) => {
        return {
          ...prevState,
          brands: uniqueList,
        };
      });
    });
  };

  const submitForm = (inputValue) => {
    if (optionsFieldState.activeField === "price")
      sortedProduct(+inputValue, "price");
    if (optionsFieldState.activeField === "product")
      sortedProduct(inputValue, "product");
  };

  const sortedProduct = (el, field) => {
    getFilteredProduct(getFilteredProductsId, field, el);
    if (field === "brand") {
      setOptionsFieldState({ ...optionsFieldState, activeBrand: el });
    }
  };

  return (
    <div className={optionsFieldStyle.options_field}>
      <ul className={optionsFieldStyle.options_list}>
        <li
          onClick={() => {
            setActiveField("all");
          }}
          className={optionsFieldStyle.options_item}
        >
          <Button
            content="Все"
            handler={() => getAllProducts(getProductsIDs, 0)}
            name="all"
            select={optionsFieldState.activeField === "all"}
            isActive={true}
          />
        </li>
        <li
          onClick={() => setActiveField("product")}
          className={optionsFieldStyle.options_item}
        >
          <Button
            content="Название"
            name="product"
            select={optionsFieldState.activeField === "product"}
            isActive={true}
          />
        </li>
        <li
          onClick={() => setActiveField("price")}
          className={optionsFieldStyle.options_item}
        >
          <Button
            content="Цена"
            name="price"
            select={optionsFieldState.activeField === "price"}
            isActive={true}
          />
        </li>
        <li
          onClick={() => setActiveField("brand")}
          className={optionsFieldStyle.options_item}
        >
          <Button
            content="Бренд"
            handler={getBrandFieldsHandler}
            name="brand"
            select={optionsFieldState.activeField === "brand"}
            isActive={true}
          />
        </li>
      </ul>
      {optionsFieldState.brands.length > 0 &&
        optionsFieldState.activeField === "brand" && (
          <ul className={optionsFieldStyle.brand_list}>
            {optionsFieldState.brands.map((el, ind) => (
              <li
                key={ind}
                className={`${optionsFieldStyle.options_item} ${
                  optionsFieldState.activeBrand === el
                    ? optionsFieldStyle.options_item_isActive
                    : ""
                }`}
                onClick={() => sortedProduct(el, optionsFieldState.activeField)}
              >
                {el === null ? "Нет бренда" : el}
              </li>
            ))}
          </ul>
        )}
      {(optionsFieldState.activeField === "price" ||
        optionsFieldState.activeField === "product") && (
        <form className={optionsFieldStyle.form}>
          <input
            {...(optionsFieldState.activeField === "price"
              ? { type: "number", name: "price", placeholder: "Укажите цену" }
              : {
                  type: "text",
                  name: "product",
                  placeholder: "Укажите название товара",
                })}
            onChange={(e) => handleInputChange(e)}
            value={optionsFieldState.inputValue}
            className={optionsFieldStyle.input}
          />

          <Button
            content="Найти"
            handler={() => submitForm(optionsFieldState.inputValue)}
            name="search"
          />
        </form>
      )}
    </div>
  );
};

export { OptionsField };
