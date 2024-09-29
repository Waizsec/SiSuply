import React, { useEffect, useState } from 'react';

const ProductsForm = (props) => {
    const [formData, setFormData] = useState({
        productname: '',
        imgurl: '',
        stock: '',
        price: '',
        description: '',
    });

    useEffect(() => {
        if (props.products) {
            setFormData({
                productname: props.products.nama_produk || '',
                imgurl: props.products.link_gambar || '',
                stock: props.products.jml_stok || '',
                price: props.products.harga || '',
                description: props.products.deskripsi || '',
            });
        } else {
            setFormData({
                productname: '',
                imgurl: '',
                stock: '',
                price: '',
                description: '',
            });
        }
    }, [props.products]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!props.products) {
            // Create a new product
            try {
                const response = await fetch('http://127.0.0.1:5000/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'nama_produk': formData.productname,
                        'link_gambar': formData.imgurl,
                        'jml_stok': formData.stock,
                        'harga': formData.price,
                        'deskripsi': formData.description,
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Product added successfully!');
                    console.log('Product added:', result);
                    window.location.reload(); // Refresh the page
                } else {
                    alert('Error adding product: ' + response.statusText);
                }
            } catch (error) {
                alert('Network error: ' + error.message);
            }
        } else {
            // Update the product
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/products/${props.products.id_produk}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'nama_produk': formData.productname,
                        'link_gambar': formData.imgurl,
                        'jml_stok': formData.stock,
                        'harga': formData.price,
                        'deskripsi': formData.description,
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Product updated successfully!');
                    console.log('Product updated:', result);
                    window.location.reload(); // Refresh the page
                } else {
                    alert('Error updating product: ' + response.statusText);
                }
            } catch (error) {
                alert('Network error: ' + error.message);
            }
        }
    };

    const handleDelete = async () => {
        if (props.products) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/products/${props.products.id_produk}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Product deleted successfully!');
                    console.log('Product deleted successfully');
                    window.location.reload(); // Refresh the page
                } else {
                    alert('Error deleting product: ' + response.statusText);
                }
            } catch (error) {
                alert('Network error: ' + error.message);
            }
        }
    };

    return (
        <div className='w-full flex flex-col relative mt-[8vw] h-[42vw] p-6 rounded-lg'>
            {props.products == null ? (
                <>
                    <h1 className='text-[2vw] font-medium mb-6'>Insert Products</h1>
                    <input
                        type="text"
                        name="productname"
                        placeholder='Product Name...'
                        className='w-full text-[1vw] mb-4 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                        value={formData.productname}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="imgurl"
                        placeholder='Image Link...'
                        className='w-full text-[1vw] mb-4 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                        value={formData.imgurl}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="stock"
                        placeholder='Stock'
                        className='w-full text-[1vw] mb-4 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                        value={formData.stock}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder='Price'
                        className='w-full text-[1vw] mb-4 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                        value={formData.price}
                        onChange={handleChange}
                    />
                    <textarea
                        name="description"
                        placeholder="Product Descriptions..."
                        className='w-full h-[19vw] mb-6 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            className='text-white bg-black mr-[0.5vw] p-2 rounded-md text-[1vw] hover:bg-transparent hover:text-black border-[0.1vw] border-black px-[2vw] duration-300'>
                            Add Products
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h1 className='text-[2vw] font-medium mb-6'>Update Products</h1>
                    <input
                        type="text"
                        name="productname"
                        placeholder='Product Name...'
                        className='w-full text-[1vw] mb-4 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                        value={formData.productname} // Use value instead of defaultValue
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="imgurl"
                        placeholder='Image Link...'
                        className='w-full text-[1vw] mb-4 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                        value={formData.imgurl} // Use value instead of defaultValue
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="stock"
                        placeholder='Stock'
                        className='w-full text-[1vw] mb-4 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                        value={formData.stock} // Use value instead of defaultValue
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder='Price'
                        className='w-full text-[1vw] mb-4 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                        value={formData.price} // Use value instead of defaultValue
                        onChange={handleChange}
                    />
                    <textarea
                        name="description"
                        placeholder="Product Descriptions..."
                        className='w-full h-[19vw] mb-6 p-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                        value={formData.description} // Use value instead of defaultValue
                        onChange={handleChange}
                    ></textarea>
                    <div className="flex justify-end">
                        <button
                            onClick={handleDelete}
                            className='bg-transparent mr-[0.5vw] p-2 rounded-md text-[1vw] hover:bg-black hover:text-white border-[0.1vw] border-black px-[2vw] duration-300'>
                            Delete
                        </button>
                        <button
                            onClick={handleSubmit}
                            className='text-white bg-black mr-[0.5vw] p-2 rounded-md text-[1vw] hover:bg-transparent hover:text-black border-[0.1vw] border-black px-[2vw] duration-300'>
                            Update Products
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductsForm;
