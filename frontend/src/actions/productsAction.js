import axios from "axios";
import { productsFail, productsRequest, productsSuccess } from "../slices/productsSlice";

export const getProducts = (keyword, currentPage) => async (dispatch) => {
    try {
        dispatch(productsRequest())
        let link = `/products?page=${currentPage}`;

        if (keyword) {
            link += `&keyword=${keyword}`;
        }

        const {data} = await axios.get(link)
        dispatch(productsSuccess(data))
    } catch (error) {
        dispatch(productsFail(error.response.data.message))       
    }
}