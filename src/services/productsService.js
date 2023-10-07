import { get } from "../components/Api/api";
import { GET_PRODUCTS } from "../constants/apiConstants";
import { GET_PRODUCTS_STORAGE } from "../constants/storageConstants";

export const getProducts = () => {
  let prods = localStorage.getItem(GET_PRODUCTS_STORAGE);
  if (prods) {
    prods = JSON.parse(prods);
    return prods;
  } else {
    return getProductsFromApi();
  }
};
export const setProducts = (value) => {
  localStorage.setItem(GET_PRODUCTS_STORAGE, JSON.stringify(value));
};
const getProductsFromApi = async () => {
  let res = await get(GET_PRODUCTS);
  if (
    res?.data &&
    res?.data?.data &&
    res?.data?.data?.data &&
    res?.data?.data?.data.length
  ) {
    let priceData = res?.data?.data?.data;
    if (priceData.length)
      priceData = priceData.filter((ele) => ele.active === true);
    setProducts(priceData);
    return priceData;
  } else {
    return [];
  }
};
