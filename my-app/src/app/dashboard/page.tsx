"use client"
import React, { useState } from "react";
import {
  Inbox,
  Download,
  GalleryHorizontal,
  User,
  AudioLines
} from "lucide-react";
import TextToAudio from "./TextToAudio";
import FrontPage from "./FrontPage"

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
];

export default function FloatingSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [currentItem, setCurrentItem] = useState("createAvatar");

  const handleMouseEnter = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-950">
      {/* Fixed sidebar with improved transition */}
      <div
        className={`
          fixed flex flex-col h-screen bg-black shadow-xl transition-all duration-300 ease-out z-10
          ${expanded ? 'w-64' : 'w-16'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {expanded && (
            <span className="font-medium text-blue-600 opacity-0 transition-opacity duration-300 ease-in-out"
              style={{ opacity: expanded ? 1 : 0 }}>
              Dashboard
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-3 px-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={() => setCurrentItem(item.url)}
                  className={`
                    flex items-center rounded-lg p-3 transition-all duration-200 ease-in-out
                    ${!expanded ? 'justify-center' : ''}
                    ${currentItem === item.url
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-blue-600 hover:bg-gray-800 hover:text-white'}
                    transform hover:translate-x-1
                  `}
                  title={!expanded ? item.title : ""}
                >
                  <item.icon
                    size={20}
                    className={`
                      ${currentItem === item.url ? "text-white" : "text-blue-600"}
                      transition-colors duration-300
                      
                    `}
                  />
                  {expanded && (
                    <span className="ml-3 transition-all duration-300 ease-in-out"
                      style={{ opacity: expanded ? 1 : 0 }}>
                      {item.title}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-800">
          {expanded && (
            <div className="text-xs text-center text-blue-600 transition-opacity duration-300 ease-in-out"
              style={{ opacity: expanded ? 1 : 0 }}>
              v1.0.0
            </div>
          )}
        </div>
      </div>

      {/* Main Content with smooth transition */}
      <div
        className={`
          flex-1 max-md:p-0 p-6 text-blue-600 transition-all duration-300 ease-out
          ${expanded ? 'ml-64' : 'ml-16'}
        `}
      >
        {currentItem === "textToAudio" && <TextToAudio />}
        {currentItem === "createAvatar" && <FrontPage setCurrentItem={setCurrentItem} />}

        {!["createAvatar", "textToAudio"].includes(currentItem) && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-purple-600 text-5xl mb-4">
              {(() => {
                const IconComponent = sidebarItems.find(item => item.url === currentItem)?.icon;
                return IconComponent ? <IconComponent size={64} /> : null;
              })()}
            </div>
            <p className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Coming Soon: {sidebarItems.find(item => item.url === currentItem)?.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}