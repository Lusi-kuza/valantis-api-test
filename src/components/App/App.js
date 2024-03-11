import React, { useEffect, useState } from "react";
import { ButtonsPagination } from "../buttons-pagination/buttons-pagination";
import { OptionsField } from "../options-field/options-field";
import { ProductsList } from "../products-list/products-list";
import appStyle from "./App.module.css";
import { getProductsIDs, getProductsItems } from "../../utils/product-API";

const App = () => {
  const [productsListState, setProductsListState] = useState({
    isLoading: true,
    products: [],
    step: 0,
    offsetProduct: {},
    limit: 50,
    filterProducts: [],
    selectProducts: [],
    stepFilterProduct: 0,
    activeField: "all",
    valueField: "",
    paginationHandler: getProductsIDs,
  });

  const updateProductData = (prod) => {
    return prod?.reduceRight((obj, el) => {
      obj[el.id] = el;
      return obj;
    }, {});
  };

  const getAllProducts = (
    callback,
    step,
    offset = 0,
    field,
    value_field,
    selection = 150
  ) => {
    setProductsListState({
      ...productsListState,
      isLoading: true,
      activeField: field,
      valueField: value_field,
      paginationHandler: callback,
    });

    callback(offset, selection, field, value_field)
      .then((data) => {
        const uniqueProductList = [...new Set(data.result)].slice(
          0,
          productsListState.limit
        );

        const offsetItem =
          offset +
          1 +
          data.result.indexOf(uniqueProductList[productsListState.limit - 1]);

        setProductsListState((prevState) => {
          if (step in prevState.offsetProduct) {
            return {
              ...prevState,
              step: step,
            };
          } else {
            return {
              ...prevState,
              offsetProduct: {
                ...prevState.offsetProduct,
                [step]: offsetItem,
              },
              step: step,
            };
          }
        });

        return getProductsItems(uniqueProductList);
      })
      .then((data) => {
        setProductsListState((prevState) => {
          return {
            ...prevState,
            products: Object.values(updateProductData(data.result)).reverse(),
            isLoading: false,
          };
        });
      });
  };

  const getFilteredProductList = (callback, field, value_field, step = 0) => {
    setProductsListState({
      ...productsListState,
      isLoading: true,
      activeField: field,
      valueField: value_field,
      paginationHandler: callback,
    });

    callback(field, value_field)
      .then((data) => {
        const uniqueProductList = [...new Set(data.result)];
        const selectProductList = uniqueProductList.slice(
          step * productsListState.limit,
          step * productsListState.limit + productsListState.limit
        );
        setProductsListState((prevState) => {
          return {
            ...prevState,
            filterProducts: data.result,
            selectProducts: selectProductList,
            stepFilterProduct: step,
          };
        });
        console.log(getProductsItems(selectProductList));
        return getProductsItems(selectProductList);
      })
      .then((data) => {
        setProductsListState((prevState) => {
          return {
            ...prevState,
            products: Object.values(updateProductData(data.result)).reverse(),
            isLoading: false,
          };
        });
      });
  };

  const getProductsList = (name) => {
    if (productsListState.activeField === "all") {
      let nextStep;
      let offset;
      if (name === "next") {
        nextStep = productsListState.step + 1;
        offset = productsListState.offsetProduct[productsListState.step];
      }

      if (name === "prev") {
        nextStep = productsListState.step - 1;
        offset = productsListState.offsetProduct[nextStep - 1 || 0];
      }

      getAllProducts(
        productsListState.paginationHandler,
        nextStep,
        offset,
        productsListState.activeField,
        productsListState.valueField
      );
    } else {
      let nextStep;
      if (name === "next") {
        nextStep = productsListState.stepFilterProduct + 1;
      }

      if (name === "prev") {
        nextStep = productsListState.stepFilterProduct - 1;
      }

      getFilteredProductList(
        productsListState.paginationHandler,
        productsListState.activeField,
        productsListState.valueField,
        nextStep
      );
    }
  };

  useEffect(() => {
    getAllProducts(getProductsIDs, productsListState.step);
  }, []);

  console.log(productsListState);

  return (
    <main className={appStyle.App}>
      <h1 className={appStyle.title}>Наши товары</h1>
      <OptionsField
        getAllProducts={getAllProducts}
        getFilteredProduct={getFilteredProductList}
      />
      {productsListState.isLoading && <p>Подождите, ищем товары...</p>}
      {!productsListState.isLoading &&
        productsListState.products.length === 0 && (
          <p>Товар не найден. Попробуйте использовать другие параметры.</p>
        )}

      {!productsListState.isLoading &&
        productsListState.products.length > 0 && (
          <>
            <ProductsList products={productsListState.products} />
            <ButtonsPagination
              firstPage={
                (productsListState.activeField === "all" &&
                  productsListState.step < 1) ||
                productsListState.stepFilterProduct < 1
              }
              lastPage={
                productsListState.products.length < productsListState.limit
              }
              handler={getProductsList}
            />
          </>
        )}
    </main>
  );
};

export default App;
