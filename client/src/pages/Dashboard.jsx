import React from 'react'
import { TypeAnimation } from 'react-type-animation';
import { DetailTransaksi, ListOrders, ListProducts, ProductsForm } from './components';

const Dashboard = () => {
    return (
        <div className="flex  justify-center h-[100vh] relative">
            {/* <div className="w-[45vw] flex items-center flex-col relative mt-[10vw]">
                <TypeAnimation
                    className='text-[6vw] mx-[10vw] leading-[7vw]'
                    sequence={[
                        'Selamat Datang, Wisnu!', // Types this string
                        1000, // Waits 1s
                    ]}
                    speed={250} // Custom typing speed (ms)
                    repeat={Infinity} // Repeat the animation
                />
                <p className='ml-[10vw] mt-[2vw] text-[0.9vw]'>
                    ASFA, the voice of superannuation since 1962, is the peak policy, research and advocacy body for Australia's superannuation industry.
                </p>
            </div> */}
            {/* <ProductsForm /> */}
            <DetailTransaksi />



            <div className="w-[55vw] pl-[5vw] py-[10vw] h-[100vh] overflow-y-scroll">
                <ListProducts />
                <ListOrders />
            </div>
            <div className="flex justify-between absolute top-0 w-[100vw] px-[2vw] py-[2vw]">
                <span className='w-[3vw] h-[3vw] bg-black rounded-full'></span>
                {/* <button className='w-[6vw] h-[2.7vw] text-white bg-black text-[0.8vw] font-bold rounded-[0.3vw]'>Logout</button> */}
            </div>

        </div>
    )
}

export default Dashboard