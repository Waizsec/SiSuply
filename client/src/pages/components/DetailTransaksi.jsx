import React from 'react';

const DetailTransaksi = ({ orders }) => {

    const formatDate = (dateString) => {
        // Create a new Date object from the date string
        const date = new Date(dateString);

        // Extract the components of the date
        const day = String(date.getUTCDate()).padStart(2, '0'); // Day with leading zero
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month with leading zero
        const year = date.getUTCFullYear(); // Full year

        // Format the date to 'MM/DD/YYYY'
        return `${day}/${month}/${year}`;
    };

    console.log(orders)
    return (
        <>
            {orders ? (
                <div className='w-full flex flex-col relative mt-[10vw] h-[40vw] py-6 px-[4vw] rounded-lg bg-white'>
                    <div className="flex justify-between text-[1vw] mb-[2vw] items-center">
                        <h1 className='text-[2vw] font-medium text-center'>Invoice Transaksi</h1>
                        <h1 className='text-[1.2vw] font-medium text-center'>#{orders.id_log}</h1>
                    </div>

                    {/* Uncomment and fill these in when available */}
                    <div className="flex justify-between text-[1vw]">
                        <p>Tanggal: </p>
                        <p>{formatDate(orders.tanggal_pembelian)}</p>
                    </div>
                    <div className="flex justify-between text-[1vw]">
                        <p>Resi: </p>
                        <p>{orders.no_resi}</p>
                    </div>

                    <div className="flex font-bold justify-between text-[1vw] mt-[3vw] border-y-[0.1vw] pt-[1vw] pb-[0.5vw] border-black">
                        <p className='w-[25%] text-start'>Item</p>
                        <p className='w-[25%] text-end'>Quantity</p>
                        <p className='w-[25%] text-end'>Harga</p>
                        <p className='w-[25%] text-end'>Total</p>
                    </div>

                    {orders.produk.map((produk, index) => (
                        <div key={index} className="flex justify-between text-[1vw] border-b-[0.1vw] py-[0.5vw] border-black">
                            <p className='w-[25%] text-start'>{produk.nama_produk}</p>
                            <p className='w-[25%] text-end'>{produk.quantity}</p>
                            <p className='w-[25%] text-end'>{(produk.total / produk.quantity).toFixed(2)}</p> {/* Ensure it displays as a number */}
                            <p className='w-[25%] text-end'>{produk.total}</p>
                        </div>
                    ))}

                    <div className="flex justify-between text-[1vw] py-[0.5vw] border-black">
                        <p className='w-[25%] text-start'></p>
                        <p className='w-[25%] text-end'></p>
                        <p className='w-[25%] text-end font-bold'>Subtotal: </p>
                        <p className='w-[25%] text-end'>{orders.subtotal}</p>
                    </div>

                    {/* <div className="flex justify-between text-[1vw] mt-[1vw]">
                        <p>Status: </p>
                        <p>{orders.status || 'Unknown'}</p> 
                    </div> */}
                </div>
            ) : (
                <div className="w-full flex justify-center items-center mt-[10vw] h-[40vw] py-6 px-[4vw] rounded-lg bg-white">
                    <p className='text-[2vw]'>No transaction details available.</p>
                </div>
            )}
        </>
    );
};

export default DetailTransaksi;
