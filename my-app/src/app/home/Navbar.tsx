"use client"
import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Heart, MessageCircle, LogIn } from 'lucide-react';
// import Image from 'next/image';
import NavDropdown from './NavDropdown';

type MobileNavLinkProps = {
    href: string;
    icon: React.ReactNode;
    text: string;
    isButton?: boolean; // <-- optional prop
};

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activePage, setActivePage] = useState("Home");
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effects
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? ' backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-3 group">
                        <div className="relative w-12 h-12 overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover:scale-105">
                            {/* Custom SVG Logo */}
                            {/* place Icon here */}
                        </div>
                        <h1
                            className="text-2xl font-light tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 cursor-pointer transition-all duration-500 group-hover:from-purple-500 group-hover:to-indigo-600"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            <span className="font-bold">Avatar</span>AI
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <NavLink href="#" activePage={activePage} setActivePage={setActivePage} icon={<Home size={16} />} text="Home" />
                        <NavLink href="#" activePage={activePage} setActivePage={setActivePage} icon={<Heart size={16} />} text="Reflections" />
                        <NavDropdown />

                        <button className="bg-gradient-to-r cursor-pointer from-purple-300 to-indigo-400 hover:from-purple-400 hover:to-indigo-500 text-white px-5 py-2 rounded-full font-medium shadow-md flex items-center space-x-2 transition-all duration-300 hover:shadow-lg">
                            <LogIn size={16} />
                            <span>Get Started</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 rounded-full hover:bg-gray-100/80 transition-colors"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} className="text-indigo-400" /> : <Menu size={24} className="text-indigo-400" />}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-gray-200/50 animate-fadeIn">
                        <div className="flex flex-col space-y-3 bg-white  rounded-xl p-4 shadow-lg justify-center">
                            <MobileNavLink href="#" icon={<Home size={16} />} text="Home" />
                            <MobileNavLink href="#" icon={<Heart size={16} />} text="Reflections" />
                            <MobileNavLink href="#" icon={<MessageCircle size={16} />} text="Connect" />
                            <MobileNavLink href="#" icon={<LogIn size={16} />} text="Sign Up" isButton={true} />
                        </div>
                    </div>
                )}
            </div>``
        </nav>
    );
};

type NavLinkProps = {
    href: string;
    icon: React.ReactNode;
    text: string;
    activePage: string;
    setActivePage: (page: string) => void;
};

const NavLink = ({ href, icon, text, activePage, setActivePage }: NavLinkProps) => (
    <a
        href={href}
        onClick={() => setActivePage(text)}
        className="flex items-center space-x-3 text-gray-500 hover:text-gray-200 font-medium transition-colors px-3 py-2 rounded-full backdrop-blur-sm hover:shadow-sm group"
    >
        <span className="text-purple-400 group-hover:text-indigo-500 transition-colors">{icon}</span>
        <span className="relative">
            {text}
            <span
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-300 to-indigo-400 transition-all duration-300 ease-in-out ${activePage === text ? "w-full" : "w-0 group-hover:w-full"
                    }`}
            ></span>
        </span>
    </a>
);


const MobileNavLink = ({ href, icon, text, isButton }:MobileNavLinkProps) => (
    <a
        href={href}
        className={`flex items-center space-x-3 font-medium transition-colors p-3 rounded-full
          ${isButton ?
                "bg-gradient-to-r from-purple-300 to-indigo-400 hover:from-purple-400 hover:to-indigo-500 text-white justify-center shadow-md" :
                "text-gray-500 hover:text-indigo-500 hover:bg-white/70 backdrop-blur-sm"}`}
    >
        <span className={isButton ? "text-white" : "text-purple-400"}>{icon}</span>
        <span>{text}</span>
    </a>
);

export default Navbar;