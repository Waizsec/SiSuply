import React, { useEffect, useState } from 'react';

const ListOrders = ({ setLeftDisplay, setSelectedTrx }) => {
    const [orders, setOrders] = useState([]); // State to hold the fetched orders
    const [searchTerm, setSearchTerm] = useState(''); // State for search input

    // Fetch orders from the API when the component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/get_transaksi');
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data); // Update state with fetched data
                } else {
                    console.error('Error fetching orders:', response.statusText);
                }
            } catch (error) {
                console.error('Network error:', error.message);
            }
        };

        fetchOrders();
    }, []); // Empty dependency array means this effect runs once on mount

    // Handle input change for search
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase()); // Update search term and convert to lowercase
    };

    // Filter orders based on search term
    const filteredOrders = orders.filter((order) =>
        order.id_log.toLowerCase().includes(searchTerm) // Adjust this condition based on your filtering criteria
    );

    return (
        <div className="mt-[5vw]">
            <div className="flex justify-between items-center pr-[3vw]">
                <h2 className='text-[2vw] font-medium ml-[0.5vw]'>Order List</h2>
                <input
                    type="search"
                    name="searchProduct"
                    placeholder='Search...'
                    className='h-[3vw] pl-[1vw] rounded-[1vw] text-[1vw] outline-none'
                    onChange={handleSearchChange} // Handle change
                />
            </div>
            <p className='flex items-center'>
                <span className="h-[0.1vw] mt-[1vw] w-[20vw] bg-black"></span>
            </p>
            <div className="overflow-scroll h-[35vw] mt-[3vw] pr-[5vw]">
                <div className="flex flex-col h-[auto]">
                    {/* Product Line Up */}
                    <div className="h-[3vw] mb-[1vw] flex items-center justify-center">
                        <div className='flex h-full bg-white items-center px-[3vw] text-[0.9vw] w-[75%] rounded-md'>
                            <p className='w-[25%]'>ID TRX</p> {/* Displaying id_log */}
                            <p className='w-[25%] text-end'>Jumlah Produk</p> {/* Displaying number of items */}
                            <p className='w-[25%] text-end'></p> {/* Placeholder for buyer's info */}
                            <p className='w-[25%] text-end'>Total Harga</p> {/* Displaying total price */}
                        </div>
                        <div className="h-[85%] w-[20%] ml-[5%] bg-transparent rounded-md"></div>
                    </div>
                    {filteredOrders.map((order, index) => (
                        <div key={index} className="h-[3vw] mb-[1vw] flex items-center justify-center">
                            <div className='flex h-full bg-white items-center px-[3vw] text-[0.9vw] w-[75%] rounded-md'>
                                <p className='w-[25%]'>{order.id_log}</p> {/* Displaying id_log */}
                                <p className='w-[25%] text-end'>{order.produk.length}</p> {/* Displaying number of items */}
                                <p className='w-[25%] text-end'></p> {/* Placeholder for buyer's info */}
                                <p className='w-[25%] text-end'>IDR {order.subtotal.toLocaleString()}</p> {/* Displaying total price */}
                            </div>
                            <div className="h-[85%] w-[20%] ml-[5%] bg-black rounded-md text-white flex items-center justify-center text-[0.9vw] hover:bg-white hover:text-black duration-700 border-[0.2vw] border-black cursor-pointer"
                                onClick={() => { setLeftDisplay(2); setSelectedTrx(order); }}
                            >
                                See Detail
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListOrders;
