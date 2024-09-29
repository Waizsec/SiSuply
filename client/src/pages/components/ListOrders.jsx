import React from 'react'

const ListOrders = ({ setLeftDisplay }) => {
    return (
        <div className="mt-[5vw]">
            <div className="flex justify-between items-center pr-[3vw]">
                <h2 className='text-[2vw] font-medium ml-[0.5vw]'>Order List</h2>
                <input type="search" name="searchProduct" placeholder='Search...' className='h-[3vw] pl-[1vw] rounded-[1vw] text-[1vw] outline-none' id="" />
            </div>
            <p className='flex items-center'>
                <div className="h-[0.1vw] mt-[1vw] w-[20vw] bg-black"></div>
            </p>
            <div className="overflow-scroll h-[35vw] mt-[3vw] pr-[5vw]">
                <div className="flex flex-col h-[auto]">
                    {/* Product Line Up */}
                    {[1, 2, 3, 4, 5, 6, 0, 1, 1, 1, 1, 1, 1, 1, 1].map(product => (
                        <div className="h-[3vw] mb-[1vw] flex items-center justify-center">
                            <div className='flex h-full bg-white items-center px-[3vw] text-[0.9vw] w-[75%] rounded-md'>
                                <p className='w-[25%]'>Resi</p>
                                <p className='w-[25%]'>Jumlah Item</p>
                                <p className='w-[25%]'>Pembeli</p>
                                <p className='w-[25%]'>Total Harga</p>
                            </div>
                            <div className="h-[85%] w-[20%] ml-[5%] bg-black rounded-md text-white flex items-center justify-center text-[0.9vw] hover:bg-white hover:text-black duration-700 border-[0.2vw] border-black cursor-pointer"
                                onClick={() => setLeftDisplay(2)}
                            >
                                See Detail
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ListOrders