import React, { useEffect, useRef, useState } from 'react'
import { TypeAnimation } from 'react-type-animation';
import { DetailTransaksi, ListOrders, ListProducts, ProductsForm } from './components';

const Dashboard = () => {
    const [LeftDisplay, setLeftDisplay] = useState(0);
    const [SelectedProducts, setSelectedProduct] = useState(null);
    const [selectedTrx, setSelectedTrx] = useState(null);
    const scrollRef = useRef(null);

    // Scroll to the appropriate section based on LeftDisplay state
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: LeftDisplay * window.innerHeight,
                behavior: 'smooth'
            });
        }
    }, [LeftDisplay]);

    useEffect(() => {
        if (SelectedProducts) {
            setLeftDisplay(1); // Set LeftDisplay to 1 when SelectedProducts changes
        }
    }, [SelectedProducts]);

    useEffect(() => {
        if (LeftDisplay == 2) {
            setSelectedProduct(null); // Set LeftDisplay to 1 when SelectedProducts changes
        }
    }, [LeftDisplay]);


    return (

        <div className="flex h-[100vh] relative">
            {/* Left Side */}
            <div ref={scrollRef} className="h-[100vh] overflow-y-hidden pb-[8vw] w-[45vw] pl-[7vw]">
                {/* Condition 1 */}
                <div className="w-full h-[82vh] flex flex-col relative mt-[10vw]">
                    <TypeAnimation
                        className='text-[6vw] leading-[7vw]'
                        sequence={[
                            'Selamat Datang, di Supply!', // Types this string
                            700, // Waits 1s
                        ]}
                        speed={200} // Custom typing speed (ms)
                        repeat={Infinity} // Repeat the animation
                    />
                    <p className='mt-[2vw] text-[0.9vw]'>
                        ASFA, the voice of superannuation since 1962, is the peak policy, research and advocacy body for Australia's superannuation industry.
                    </p>
                </div>
                <ProductsForm products={SelectedProducts} />
                <DetailTransaksi orders={selectedTrx} />
            </div>


            {/* Right Side */}
            <div className="w-[55vw] pl-[5vw] pb-[7vw] pt-[10vw] h-[100vh] overflow-y-scroll">
                <ListProducts setLeftDisplay={setLeftDisplay} setSelectedProduct={setSelectedProduct} />
                <ListOrders setLeftDisplay={setLeftDisplay} setSelectedTrx={setSelectedTrx} />
            </div>

        </div>
    )
}

export default Dashboard