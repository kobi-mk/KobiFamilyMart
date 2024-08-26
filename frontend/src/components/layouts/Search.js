import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Search() {

   const navigate = useNavigate()
   const [keyword, setKeyword] = useState("")
   const searchHandler = (e) => {
      e.preventDefault()
      navigate(`/search/${keyword}`)
   }

   return (
      <div className="input-group">
         <form onSubmit={searchHandler}>
            <input
               type="text"
               id="search_field"
               className="form-control"
               placeholder="Enter Product Name ..."
               onChange={(e)=>{setKeyword(e.target.value)}}
               value={keyword}
            />
            <div className="input-group-append">
               <button id="search_btn" className="btn">
                  <i className="fa fa-search" aria-hidden="true"></i>
               </button>
            </div>
         </form>
      </div>
   )
}
