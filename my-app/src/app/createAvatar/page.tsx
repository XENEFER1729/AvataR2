
"use client"
import React, { useState } from "react";
import { 
  Inbox, 
  Download, 
  GalleryHorizontal, 
  User,
  ChevronRight,
  ChevronLeft,
  AudioLines
} from "lucide-react";
import Main from "./CreateAvatar";
import TextToAudio from "./TextToAudio";

// Define sidebar items
const sidebarItems = [
  {
    title: "Create Avatar",
    url: "createAvatar",
    icon: User,
  },
  {
    title: "Convert Text to Audio",
    url: "textToAudio",
    icon: AudioLines,
  },
  {
    title: "Demo",
    url: "demo",
    icon: Inbox,
  },
  {
    title: "Saved Projects",
    url: "savedProjects",
    icon: Download,
  },
  {
    title: "Gallery",
    url: "gallery",
    icon: GalleryHorizontal,
  },
  // {
  //   title: "Settings",
  //   url: "Settings",
  //   icon: Settings,
  // },
];

export default function FloatingSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [currentItem,setCurrentItem]=useState("createAvatar");
  
  const handleMouseEnter = () => {
    setExpanded(true);
  };
  
  const handleMouseLeave = () => {
    setExpanded(false);
  };
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      <div 
        className={`
          flex flex-col h-screen bg-white shadow-lg transition-all duration-300 ease-in-out
          ${expanded ? 'w-64' : 'w-16'}
          relative
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {expanded && (
            <span className="font-medium text-gray-800">Menu</span>
          )}
          <button 
            onClick={toggleSidebar} 
            className={`
              p-1 rounded-md hover:bg-gray-100 text-gray-600
              ${expanded ? 'ml-auto' : 'mx-auto'}
            `}
          >
            {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  onClick={()=>setCurrentItem(item.url)}
                  className={`
                    flex items-center rounded-md p-2 text-gray-700 hover:bg-gray-100
                    transition-all duration-200
                    ${!expanded ? 'justify-center' : ''}
                  `}
                  title={!expanded ? item.title : ""}
                >
                  <item.icon size={20} className="text-gray-500" />
                  {expanded && (
                    <span className="ml-3 transition-opacity duration-300">{item.title}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          {expanded && (
            <div className="text-xs text-center text-gray-500">
              v1.0.0
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      {currentItem==="createAvatar" && <Main/>}
      {currentItem==="textToAudio" && <TextToAudio/>}

    </div>
  );
}