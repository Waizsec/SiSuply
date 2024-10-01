import React, { useEffect, useState } from 'react';

const ListProducts = ({ setLeftDisplay, setSelectedProduct }) => {
    const [products, setProducts] = useState([]); // State to hold the products
    const [searchQuery, setSearchQuery] = useState(''); // State to hold the search input

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://supplier3.pythonanywhere.com/api/products');
                const data = await response.json();
                setProducts(data); // Set the fetched data to the products state
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []); // Empty dependency array to run once on component mount

    // Helper function to truncate the string
    const truncateString = (str, maxLength) => {
        if (str.length > maxLength) {
            return str.slice(0, maxLength) + '...';
        }
        return str;
    };

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.nama_produk.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-[#F5F5F5] z-[10]">
            <div className="flex justify-between items-center pr-[3vw]">
                <h2 className='text-[2vw] font-medium ml-[0.5vw] relative'>Product Line Up
                    <span className="w-[1.8vw] h-[1.8vw] text-[1.3vw] rounded-full bg-black text-white absolute flex items-center justify-center border-[0.2vw] border-black top-[-0.2vw] cursor-pointer right-[-2.3vw] hover:bg-white hover:text-black duration-700"
                        onClick={() => {
                            setSelectedProduct(null);
                            setLeftDisplay(1);
                        }}
                    >
                        <span className='mt-[-0.2vw]'>+</span>
                    </span>
                </h2>
                <input
                    type="search"
                    name="searchProduct"
                    placeholder='Search...'
                    className='h-[3vw] px-[1vw] rounded-[1vw] text-[1vw] outline-none'
                    value={searchQuery} // Controlled input
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                />
            </div>
            <p className='flex items-center'>
                <span className="h-[0.1vw] mt-[1vw] w-[20vw] bg-black"></span>
            </p>
            <div className="overflow-scroll">
                <div className="flex w-[900vw] mt-[3vw]">
                    {/* Map through the filtered products array to display each product */}
                    {filteredProducts.map(product => (
                        <div key={product.id_produk} className="px-[1vw] w-[17vw] mr-[2vw] h-[17vw] bg-white pt-[1vw] pb-[2vw] flex flex-col items-center justify-center rounded-[1vw] relative">
                            <img src={product.link_gambar} alt={product.nama_produk} className='w-[12vw] h-[12vw] object-cover mb-[1vw]' />

                            <div className="flex mt-[1vw] w-full justify-between">
                                <div className="text-[1vw] w-[50%]">
                                    <h4 className='font-bold'>
                                        {truncateString(product.nama_produk, 30)} {/* Display truncated product name */}
                                    </h4>
                                    <p className=''>
                                        Stock: {product.stock} {/* Display stock */}
                                    </p>
                                </div>
                                <div className="h-full flex justify-center items-center">
                                    <p className='text-[0.8vw] text-end'>
                                        IDR <br></br> <span className='text-[1.3vw]'>{product.harga.toLocaleString()}</span>{/* Display price */}
                                    </p>
                                </div>
                            </div>
                            <button
                                className='text-[1vw] absolute right-[-1vw] top-[-1vw] bg-black text-white w-[5vw] h-[2vw] rounded-[0.4vw] hover:bg-white hover:text-black duration-700 border-[0.2vw] border-black'
                                onClick={() => setSelectedProduct(product)} // Set selected product on button click
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListProducts;
