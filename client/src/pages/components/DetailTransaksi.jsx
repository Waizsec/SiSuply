import React from 'react'

const DetailTransaksi = () => {

    return (
        <div className='w-full flex flex-col relative mt-[10vw] h-[40vw] py-6 px-[4vw] rounded-lg bg-white'>
            <div className="flex justify-between text-[1vw] mb-[2vw] items-center">
                <h1 className='text-[2vw] font-medium text-center'>Invoice Transaksi</h1>
                <h1 className='text-[1.2vw] font-medium text-center'>#ID71234HASF21</h1>
            </div>

            <div className="flex justify-between text-[1vw]">
                <p>Tanggal: </p>
                <p>12/12/2012</p>
            </div>
            <div className="flex justify-between text-[1vw]">
                <p>Pembeli: </p>
                <p>Name Pembeli</p>
            </div>

            <div className="flex font-bold justify-between text-[1vw] mt-[3vw] border-y-[0.1vw] pt-[1vw] pb-[0.5vw] border-black">
                <p className='w-[25%] text-start'>Item</p>
                <p className='w-[25%] text-end'>Quantity</p>
                <p className='w-[25%] text-end'>Harga</p>
                <p className='w-[25%] text-end'>Total</p>
            </div>

            {[1, 2, 3, 4, 5, 6].map(product => (
                <div className="flex justify-between text-[1vw]  border-b-[0.1vw] py-[0.5vw] border-black">
                    <p className='w-[25%] text-start'>Pedal G413</p>
                    <p className='w-[25%] text-end'>20</p>
                    <p className='w-[25%] text-end'>120000</p>
                    <p className='w-[25%] text-end'>460000</p>
                </div>
            ))}
            <div className="flex justify-between text-[1vw] py-[0.5vw] border-black">
                <p className='w-[25%] text-start'></p>
                <p className='w-[25%] text-end'></p>
                <p className='w-[25%] text-end font-bold'>Subtotal : </p>
                <p className='w-[25%] text-end'>98120000</p>
            </div>


            <div className="flex justify-between text-[1vw] mt-[1vw]">
                <p>Status : </p>
            </div>

        </div>
    )
}

export default DetailTransaksi