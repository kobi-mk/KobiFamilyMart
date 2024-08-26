import React, { Fragment, useEffect, useState } from 'react'
import MetaData from './layouts/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../actions/productsAction'
import Loader from './layouts/Loader'
import Product from './product/Product'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Pagination from "react-js-pagination";

export default function Home() {

   const dispatch = useDispatch()
   const { products, loading, error, productsCount, resultsPerPage } = useSelector((state) => state.productsState)
   const[currentPage, setCurrentPage] = useState(1)

   const setCurrentPageNo = (pageNo)=> {
      setCurrentPage(pageNo)
   }

   useEffect(() => {
      if(error){
         return toast.error(error,{
            position: toast.POSITION.BOTTOM_CENTER
         })
      }
      dispatch(getProducts(null, currentPage))
   }, [dispatch, error, currentPage])

   return (
      <Fragment>
         {loading ? <Loader /> :
            <Fragment>
               <MetaData title={'Buy Best Products'} />
               <h1 id="products_heading">Latest Products</h1>

               <section id="products" className="container mt-5">
                  <div className="row">
                     {products && products.map(product => (
                        <Product key={product._id} product={product}/>
                     ))}
                  </div>
               </section>
               {productsCount > 0 && productsCount > resultsPerPage ?
               <div className='d-flex justify-content-center mt-5'>
                     <Pagination
                        activePage={currentPage}
                        onChange={setCurrentPageNo}
                        totalItemsCount={productsCount}
                        itemsCountPerPage={resultsPerPage}
                        // nextPageText={'Next'}
                        firstPageText={'First'}
                        lastPageText={'Last'}
                        itemClass={'page-item'}
                        linkClass={'page-link'}
                     />
               </div> : null }
            </Fragment>
         }
      </Fragment>
   )
}


