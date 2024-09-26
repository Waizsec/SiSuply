import React, { useState } from 'react'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can handle your form submission here (e.g., API call)
        console.log('Username:', username);
        console.log('Password:', password);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-[55vw] flex items-center justify-center flex-col relative">
                <span className='w-[4vw] h-[4vw] bg-black rounded-full absolute left-[4vw] top-[-4vw] moving-element'></span>

                <h1 className='text-[5vw] font-medium mx-[10vw] leading-[5vw]'>Welcome To SiSupply!</h1>
                <p className='mx-[10vw] mt-[2vw] text-[0.9vw]'>ASFA, the voice of superannuation since 1962, is the peak policy, research and advocacy body for Australia's superannuation industry.</p>
            </div>
            <div className="w-[45vw] bg-black">
                <form onSubmit={handleSubmit} className="h-screen flex flex-col justify-center px-[10vw]">
                    <h2 className="text-[1.8vw] font-semibold text-white">Sign In</h2>
                    <p className="text-[0.9vw] text-white mt-[0.4vw] mb-[2vw]">
                        Please Enter Your Username and Password
                    </p>
                    <label htmlFor="username" className="text-white text-[0.9vw]">
                        Username*
                    </label>
                    <input
                        type="text"
                        name="username"
                        className="w-full h-[3vw] border-[0.1vw] border-white bg-transparent text-white placeholder:text-[0.9vw] pl-[1vw] mt-[1vw] mb-[1vw] rounded-[1vw] text-[0.9vw] outline-none"
                        placeholder="Ex: Wiranto"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="password" className="text-white text-[0.9vw]">
                        Password*
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="w-full h-[3vw] border-[0.1vw] border-white bg-transparent text-white placeholder:text-[0.9vw] pl-[1vw] mt-[1vw] rounded-[1vw] text-[0.9vw] outline-none"
                        placeholder="******"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="submit"
                        value="Sign In"
                        className="text-[0.9vw] bg-white text-black mt-[2vw] w-full h-[3vw] rounded-[1vw] cursor-pointer duration-[0.6s] ease-in-out"
                    />
                    <p className="text-third text-[0.9vw] mt-[1vw] text-white">
                        Not registered yet? <a href="/register" className="text-[#bdbdbd] underline">Create an Account</a>
                    </p>
                </form>
            </div>
        </div>

    )
}

export default Login