import React, { useEffect, useState } from 'react';

const DetailTransaksi = ({ orders }) => {
    const [shipmentStatus, setShipmentStatus] = useState(''); // State to hold shipment status

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    };

    // Fetch shipment status based on orders.id_dist and orders.no_resi
    useEffect(() => {
        const fetchShipmentStatus = async () => {
            if (!orders) return; // Check if orders is not null or undefined

            if (orders.id_distributor === 'DIS03') {
                try {
                    const response = await fetch(`http://159.223.41.243:8000/api/status/${orders.no_resi}`);
                    if (response.ok) {
                        const data = await response.json();
                        setShipmentStatus(data.status || 'Unknown'); // Assuming the response contains a status field
                    } else {
                        console.error('Error fetching shipment status:', response.statusText);
                        setShipmentStatus('Error fetching status');
                    }
                } catch (error) {
                    console.error('Network error:', error.message);
                    setShipmentStatus('Network error');
                }
            } else {
                setShipmentStatus(''); // Set to empty if not DIS03
            }
        };

        fetchShipmentStatus();
    }, [orders]); // Re-run the effect if orders changes

    return (
        <>
            {orders ? (
                <div className='w-full flex flex-col relative mt-[10vw] h-[40vw] py-6 px-[4vw] rounded-lg bg-white'>
                    <div className="flex justify-between text-[1vw] mb-[2vw] items-center">
                        <h1 className='text-[2vw] font-medium text-center'>Invoice Transaksi</h1>
                        <h1 className='text-[1.2vw] font-medium text-center'>#{orders.id_log}</h1>
                    </div>

                    <div className="flex justify-between text-[1vw]">
                        <p>Tanggal: </p>
                        <p>{formatDate(orders.tanggal_pembelian)}</p>
                    </div>
                    <div className="flex justify-between text-[1vw]">
                        <p>Resi: </p>
                        <p>{orders.no_resi}</p>
                    </div>
                    <div className="flex justify-between text-[1vw]">
                        <p>Pembeli: </p>
                        <p>{orders.id_retail}</p>
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
                            <p className='w-[25%] text-end'>{(produk.total / produk.quantity).toFixed(2)}</p>
                            <p className='w-[25%] text-end'>{produk.total}</p>
                        </div>
                    ))}

                    <div className="flex justify-between text-[1vw] py-[0.5vw] border-black">
                        <p className='w-[25%] text-start'></p>
                        <p className='w-[25%] text-end'></p>
                        <p className='w-[25%] text-end font-bold'>Subtotal: </p>
                        <p className='w-[25%] text-end'>{orders.subtotal}</p>
                    </div>

                    <div className="flex justify-between text-[1vw] mt-[1vw]">
                        <p>Status: </p>
                        <p>{shipmentStatus || 'Unknown'}</p> {/* Display fetched status */}
                    </div>
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
