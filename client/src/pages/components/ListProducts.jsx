import React from 'react'

const ListProducts = ({ setLeftDisplay }) => {
    return (
        <div className="bg-[#F5F5F5] z-[10]">
            <div className="flex justify-between items-center pr-[3vw]">
                <h2 className='text-[2vw] font-medium ml-[0.5vw] relative'>Porduct Line Up
                    <span className="w-[1.8vw] h-[1.8vw] text-[1.3vw] rounded-full bg-black text-white absolute flex items-center justify-center border-[0.2vw] border-black top-[-0.2vw] cursor-pointer right-[-2.3vw] hover:bg-white hover:text-black duration-700">
                        <span className='mt-[-0.2vw]'>+</span>
                    </span>

                </h2>
                <input type="search" name="searchProduct" placeholder='Search...' className='h-[3vw] pl-[1vw] rounded-[1vw] text-[1vw] outline-none' id="" />
            </div>
            <p className='flex items-center'>
                <div className="h-[0.1vw] mt-[1vw] w-[20vw] bg-black"></div>
            </p>
            <div className="overflow-scroll">
                <div className="flex w-[900vw] mt-[3vw]">
                    {/* Product Line Up */}
                    {[1, 2, 3, 4, 5, 6].map(product => (
                        <div className="px-[1vw] w-[17vw] mr-[2vw] h-[17vw] bg-white pb-[2vw] flex flex-col items-center justify-center rounded-[1vw] relative">
                            <img src="dummy.webp" className='w-[12vw] h-[12vw]' />
                            <div className="flex mt-[1vw] w-full justify-between">
                                <div className="text-[1vw]">
                                    <h4 className='font-bold'>
                                        Ultra Max G210
                                    </h4>
                                    <p className=''>
                                        Stock: 12
                                    </p>
                                </div>
                                <div className="h-full flex items-center justify-center">
                                    <p className='text-[1.8vw]'>
                                        $261
                                    </p>
                                </div>
                            </div>
                            <button className='absolute right-[-1vw] top-[-1vw] bg-black text-white w-[5vw] h-[2vw] rounded-[0.4vw] hover:bg-white hover:text-black duration-700 border-[0.2vw] border-black'
                                onClick={() => setLeftDisplay(1)}
                            >
                                Edit</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ListProducts