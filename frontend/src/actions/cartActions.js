import {addCartItemRequest, addCartItemSuccess} from '../slices/cartSlice';
import axios from 'axios'

export const addCartItem = (id, quantity) => async(dispatch) => {
    try {
        dispatch(addCartItemRequest())
        const {data } = await axios.get(`/product/${id}`)
        dispatch(addCartItemSuccess({
            product: data.data._id,
            name: data.data.name,
            price: data.data.price,
            image: data.data.images[0].image,
            stock: data.data.stock,
            quantity
        }))
    } catch (error) {
        
    }
}

