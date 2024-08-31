import axios from "axios";
import { productsFail, productsRequest, productsSuccess } from "../slices/productsSlice";
import { productFail, productRequest, productSuccess } from "../slices/productSlice";

export const getProducts = (keyword, price, category, rating, currentPage) => async (dispatch) => {
    try {
        dispatch(productsRequest())
        let link = `/products?page=${currentPage}`;

        if (keyword) {
            link += `&keyword=${keyword}`;
        }

        if (price) {
            link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
        }

        if (category) {
            link += `&category=${category}`;
        }
        if (rating) {
            link += `&ratings=${rating}`;
        }

        const {data} = await axios.get(link)
        dispatch(productsSuccess(data))
    } catch (error) {
        dispatch(productsFail(error.response.data.message))       
    }
}


export const getProduct = id => async (dispatch) => {
    try {
        dispatch(productRequest())
        const {data} = await axios.get(`/product/${id}`)
        dispatch(productSuccess(data))
    } catch (error) {
        dispatch(productFail(error.response.data.message))       
    }
}