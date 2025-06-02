import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import logo from '../../../public/image.jpg';


function Header() {
    const navigate = useNavigate();
    return (
        <header className="w-full  mb-8">
            <div className="mx-auto max-w-7xl px-6 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo with improved styling */}
                    <div className="flex items-center space-x-4">
                        <img
                            className="rounded-xl w-16 h-16 md:w-20 md:w-20 border-2 border-white shadow-md transform hover:rotate-2 transition duration-300"
                            src={logo}
                            alt="DispatchPro Logo"
                            onClick={() => {
                                navigate('/')
                            }}
                        />
                        <div className="hidden md:block h-12 w-px bg-white/30"></div>
                    </div>

                    {/* Title with animation */}
                    <div className="text-center group">
                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            Welcome to <span className="text-amber-300 animate-pulse">DispatchPro</span>
                        </h1>
                        <p className="text-sm text-blue-100 mt-1 group-hover:text-white transition duration-300">
                            Your ultimate freight dispatch command center
                        </p>
                    </div>

                    {/* Navigation with modern styling */}
                    <nav className="flex items-center space-x-1 md:space-x-4">
                        {[
                            { name: 'Drivers', path: '/Drivers' },
                            { name: 'Contacted Loads', path: '/contacted-loads' },
                            { name: 'Loads', path: '/loads' },
                            { name: 'Dashboard', path: '/Dashboard' },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="relative px-3 py-2 text-sm font-medium text-white rounded-lg hover:bg-white/20 transition duration-300 group"
                            >
                                {item.name}
                                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-400 group-hover:w-4/5 group-hover:left-[10%] transition-all duration-300"></span>
                            </Link>
                        ))}

                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header;

