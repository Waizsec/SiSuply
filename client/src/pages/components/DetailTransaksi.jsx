import React from 'react'

const DetailTransaksi = () => {
    return (
        <div className='w-[45vw] flex flex-col relative mt-[9vw] h-[40vw] p-6 ml-[4vw] rounded-lg bg-white'>

            <div className="flex justify-end">
                <button className='bg-transparent mr-[0.5vw] p-2 rounded-md text-[1vw] hover:bg-black hover:text-white border-[0.1vw] border-black px-[2vw] duration-300'>
                    Delete
                </button>
                <button className='bg-black text-white p-2 rounded-md text-[1vw] hover:bg-transparent hover:text-black border-[0.1vw] border-black px-[2vw] duration-300'>
                    Update
                </button>
            </div>

        </div>
    )
}

export default DetailTransaksi