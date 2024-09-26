import React from 'react'

const Dashboard = () => {
    return (
        <div className="flex  justify-center h-[100vh] relative">
            <div className="w-[45vw] flex items-center flex-col relative mt-[10vw]">
                <h1 className='text-[6vw] font-medium mx-[10vw] leading-[6vw]'>Selamat Datang, Wisnu!</h1>
                <p className='ml-[10vw] mt-[2vw] text-[0.9vw]'>ASFA, the voice of superannuation since 1962, is the peak policy, research and advocacy body for Australia's superannuation industry.</p>
            </div>
            <div className="w-[55vw] pl-[5vw] mt-[10vw]">
                <div className="">
                    <h2 className='text-[2vw] font-medium ml-[0.5vw]'>Product Line Up</h2>
                    <p className='flex items-center'>
                        <div className="h-[0.1vw] w-[25vw] bg-black"></div>
                        <a href="" className='ml-[1vw] font-bold text-[1.2vw] mt-[-0.2vw] underline'>See All</a>
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
                                    <button className='absolute right-[-1vw] top-[-1vw] bg-black text-white w-[5vw] h-[2vw] rounded-[0.4vw]'>
                                        Edit</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-[5vw]">
                    <h2 className='text-[2vw] font-medium ml-[0.5vw]'>Order Process</h2>
                    <p className='flex items-center'>
                        <div className="h-[0.1vw] w-[25vw] bg-black"></div>
                        <a href="" className='ml-[1vw] font-bold text-[1.2vw] mt-[-0.2vw] underline'>See All</a>
                    </p>
                    <div className="overflow-scroll">
                        <div className="flex w-[900vw] mt-[3vw]">
                            {/* Product Line Up */}
                            {[1, 2, 3, 4, 5, 6].map(product => (
                                <div >

                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex justify-between absolute top-0 w-[100vw] px-[2vw] py-[2vw]">
                <span className='w-[3vw] h-[3vw] bg-black rounded-full'></span>
                <button className='w-[6vw] h-[2.7vw] text-white bg-black text-[0.8vw] font-bold rounded-[0.3vw]'>Logout</button>
            </div>

        </div>
    )
}

export default Dashboard