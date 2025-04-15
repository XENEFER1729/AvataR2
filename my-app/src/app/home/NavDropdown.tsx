"use client"
import React, { useState } from 'react';
import Image from 'next/image';

import { ImageIcon, PenTool, Settings, ChevronDown, Sparkles, Camera, UserPlus, Palette, Sliders, Shield, CloudCog } from 'lucide-react';

type SubItem = {
  icon: React.ReactNode; // icon is JSX, not string
  title: string;
  description: string;
};

type ItemType = {
  id: string;
  title: string;
  icon: React.ReactNode;
  image: string;
  description: string;
  items: SubItem[];
};


const NavDropdown = () => {
<<<<<<< HEAD
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropdownItems: ItemType[] = [
=======
 const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const dropdownItems = [
>>>>>>> 0aa6ada (home page)
    {
      id: 'gallery',
      title: 'Gallery',
      icon: <ImageIcon size={18} />,
      image: "/",
      description: "Explore and curate your personal reflections",
      items: [
        { icon: <Camera size={16} />, title: "Your Collection", description: "View your saved persona reflections" },
        { icon: <Sparkles size={16} />, title: "Featured Mirrors", description: "Discover trending reflections" },
        { icon: <UserPlus size={16} />, title: "Shared With You", description: "Reflections shared by connections" }
      ]
    },
    {
      id: 'create',
      title: 'Create Avatar',
      icon: <PenTool size={18} />,
      image: "/createAvatar.avif",
      description: "Express your authentic digital self",
      items: [
        { icon: <Palette size={16} />, title: "Create Avatar", description: "Create avatar video using image" },
        { icon: <Camera size={16} />, title: "Mirror Upload", description: "Transform your photos into reflections" },
        { icon: <Sparkles size={16} />, title: "Emotion Templates", description: "Start with feeling-based presets" }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings size={18} />,
      image: "/",
      description: "Personalize your mirror experience",
      items: [
        { icon: <Sliders size={16} />, title: "Preferences", description: "Customize your reflection settings" },
        { icon: <Shield size={16} />, title: "Privacy", description: "Control your digital boundaries" },
        { icon: <CloudCog size={16} />, title: "Mirror Sync", description: "Manage your persona across devices" }
      ]
    }
  ];
<<<<<<< HEAD

  const handleMouseEnter = (id) => {
    console.log(id)
=======
  
  
  const handleMouseEnter = (id:string) => {
>>>>>>> 0aa6ada (home page)
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <div className="hidden md:flex items-center space-x-6">
      {dropdownItems.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center space-x-3 text-gray-500 hover:text-gray-200 cursor-pointer font-medium transition-colors px-3 py-2 rounded-full backdrop-blur-sm hover:shadow-sm group"
          >
            <span className="text-purple-400 group-hover:text-indigo-500 transition-colors">{item.icon}</span>
            <span className="relative">
              {item.title}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-300 to-indigo-400 group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </span>
            <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
          </button>


          {activeDropdown === item.id && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-md bg-white/90 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden transition-all duration-300 z-50 border border-purple-100">
              <div className="p-4 ">
                <div className="relative rounded-lg overflow-hidden mb-4 shadow-md">
                  {/* {add the image in the drop down} */}
                  <div className='h-50'>
                    <Image
                      src={item.image}// from public folder
                      alt="Background"
                      fill
                      className="object-cover object-fit "
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/70 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      <p className="text-sm opacity-90">{item.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2" >
                  {item.items.map((subItem, index) => (
                    <a
                      key={index}
                      href={`/${item.id}Avatar`}
                      onClick={()=>console.log(item.id)}
                      className="flex items-start p-3 rounded-lg hover:bg-purple-50 transition-colors group"
                    >
                      <div className="mr-3 text-purple-400 group-hover:text-indigo-500 transition-colors mt-0.5">
                        {subItem.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{subItem.title}</h4>
                        <p className="text-sm text-gray-500">{subItem.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-t border-purple-100">
                <a href="#" className="text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors flex items-center">
                  <span>View all {item.title.toLowerCase()} options</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavDropdown;