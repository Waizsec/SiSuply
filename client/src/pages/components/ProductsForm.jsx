import React from 'react'

const ProductsForm = () => {
    return (
        <div className='w-[45vw] flex flex-col relative mt-[10vw] h-[40vw] p-6 ml-[4vw] rounded-lg'>
            <h1 className='text-[2vw] font-medium mb-6'>Update Products</h1>

            <input
                type="text"
                name="productname"
                placeholder='Product Name...'
                className='w-full mb-4 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
            />

            <input
                type="text"
                name="imgurl"
                placeholder='Image Link...'
                className='w-full mb-4 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
            />

            <input
                type="number"
                name="stock"
                placeholder='Stock'
                className='w-full mb-4 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
            />

            <input
                type="number"
                name="price"
                placeholder='Price'
                className='w-full mb-4 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
            />

            <textarea
                name="description"
                placeholder="Product Descriptions..."
                className='w-full mb-6 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-black'
            ></textarea>

            <div className="flex justify-end">
                <button className='bg-transparent mr-[0.5vw] p-2 rounded-md text-[1vw] hover:bg-black hover:text-white border-[0.1vw] border-black px-[2vw] duration-300'>
                    Delete
                </button>
                <button className='bg-black text-white p-2 rounded-md text-[1vw] hover:bg-transparent hover:text-black border-[0.1vw] border-black px-[2vw] duration-300'>
                    Update
                </button>
            </div>

        </div>

    )
}

export default ProductsForm