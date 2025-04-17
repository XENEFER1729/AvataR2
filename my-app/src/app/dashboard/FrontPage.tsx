"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import { Search } from 'lucide-react';
import { FileText, ChevronRight, Plus as PlusIcon, User, Mic } from "lucide-react";
import { useRouter } from 'next/navigation';


type ProjectType = 'all' | 'personalized' | 'avatar' | 'screen';

type HomePageProps = {
    setCurrentItem: (item: string) => void; 
};

const HomePage = ({ setCurrentItem }: HomePageProps) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ProjectType>('all');
    const [component, setComponent] = useState("frontPage");

    const DirectToCreate = (message: string) => {
        console.log(message);
        setComponent(message);
        router.push(message);
    }

    return (
        <div>
            <div className={`${component !== "frontPage" ? "hidden" : "block"} min-h-screen bg-black text-white p-4 sm:p-6 md:p-8 rounded-md w-full overflow-x-hidden`}>
                <Head>
                    <title>Studio by Gan.AI</title>
                    <meta name="description" content="Create personalized videos and avatars" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>

                <main className="max-w-7xl mx-auto">
                    {/* Creation Options Section */}
                    <div className="mb-8 md:mb-16">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">What would you like to create?</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4" >
                            {/* New Personalized Project */}
                            <div className="group bg-gradient-to-b from-gray-950 to-blue-950 transition hover:scale-105 hover:to-blue-900 duration-300 border-t-2 border-t-blue-500 rounded-lg p-3 sm:p-4 flex items-center justify-between cursor-pointer"
                                onClick={() => DirectToCreate("createAvatarP")}>
                                <div className="flex items-center">
                                    <div className="bg-indigo-950 p-2 sm:p-3 rounded-lg mr-2 sm:mr-4 flex-shrink-0">
                                        <DocumentIcon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-medium">New personalized project</h3>
                                        <p className="text-gray-400 text-xs sm:text-sm">Record a single video & personalize it for each viewer</p>
                                    </div>
                                </div>
                                <button className="p-1 sm:p-2 rounded-lg text-gray-400 cursor-pointer flex-shrink-0">
                                    <ChevronRight className="hidden group-hover:block h-4 w-4 sm:h-5 sm:w-5" />
                                    <PlusIcon className="block group-hover:hidden h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            </div>

                            {/* Generate an Avatar Video */}
                            <div className="group bg-gradient-to-b from-gray-950 to-pink-950 transition hover:scale-105 hover:to-pink-900 duration-300 border-t-2 border-t-pink-500 cursor-pointer rounded-lg p-3 sm:p-4 flex items-center justify-between"
                                onClick={() => DirectToCreate("generate")}>
                                <div className="flex items-center">
                                    <div className="bg-purple-950 p-2 sm:p-3 rounded-lg mr-2 sm:mr-4 flex-shrink-0">
                                        <AvatarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-medium  ">Generate an Avatar Video</h3>
                                        <p className="text-gray-400 text-xs sm:text-sm">Create a single or personalized videos with your avatars</p>
                                    </div>
                                </div>
                                <button className="p-1 sm:p-2 rounded-lg text-gray-400 cursor-pointer flex-shrink-0">
                                    <ChevronRight className="hidden group-hover:block h-4 w-4 sm:h-5 sm:w-5" />
                                    <PlusIcon className="block group-hover:hidden h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            </div>
                            {/* text to speech */}
                            <div className="group bg-gradient-to-b from-gray-950 to-yellow-950 transition hover:scale-105 hover:to-yellow-900 duration-300 border-t-2 border-t-yellow-500 cursor-pointer rounded-lg p-3 sm:p-4 flex items-center justify-between"
                                onClick={() => { setCurrentItem("textToAudio") }}>
                                <div className="flex items-center">
                                    <div className="bg-purple-950 p-2 sm:p-3 rounded-lg mr-2 sm:mr-4 flex-shrink-0">
                                        <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-medium  ">Convert Text to Speech</h3>
                                        <p className="text-gray-400 text-xs sm:text-sm">Create a audio with your audio and text </p>
                                    </div>
                                </div>
                                <button className="p-1 sm:p-2 rounded-lg text-gray-400 cursor-pointer flex-shrink-0">
                                    <ChevronRight className="hidden group-hover:block h-4 w-4 sm:h-5 sm:w-5" />
                                    <PlusIcon className="block group-hover:hidden h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-800 my-6 sm:my-8" />

                    {/* Recently Created Section */}
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                            <div className="flex items-center">
                                <h2 className="text-xl sm:text-2xl font-semibold mr-2">Recently created</h2>
                                <span className="text-gray-400">•</span>
                            </div>

                            <div className="relative w-full sm:w-auto">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full sm:w-auto bg-gray-900 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
                                />
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 overflow-x-auto">
                            <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                                All
                            </TabButton>
                            <TabButton active={activeTab === 'personalized'} onClick={() => setActiveTab('personalized')}>
                                Personalized projects
                            </TabButton>
                            <TabButton active={activeTab === 'avatar'} onClick={() => setActiveTab('avatar')}>
                                Avatar projects
                            </TabButton>
                        </div>

                        {/* Empty State */}
                        <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-20">
                            <div className="relative w-48 sm:w-64 h-36 sm:h-48 mb-4 sm:mb-6">
                                <div className="absolute top-0 right-4 sm:right-8 text-xs bg-gray-900 bg-opacity-80 p-1 rounded">
                                    <div className="text-xs">
                                        <p>Hey John!</p>
                                        <p>Hey Jane!</p>
                                        <p>Hey Patel!</p>
                                    </div>
                                </div>
                                <AvatarIllustration />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 text-center">Welcome to Studio by Gan.AI</h3>
                            <button className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium w-full sm:w-auto" onClick={() => DirectToCreate("createAvatarP")} >
                                Generate an Avatar Video
                            </button>
                        </div>
                    </div>
                </main>
            </div>
            {/* {component==="personalize" && <CreateAvatar/>} */}
        </div>
    );
};

// Component for tab buttons
const TabButton = ({
    children,
    active,
    onClick
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) => {
    return (
        <button
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-900'
                }`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

const DocumentIcon = ({ className }: { className?: string }) => (
    <FileText className={className} />
);

const AvatarIcon = ({ className }: { className?: string }) => (
    <User className={className} />
);


// Avatar Illustration Component
const AvatarIllustration = () => (
    <div className="relative h-full w-full">
        <div className="absolute bottom-0 left-8 sm:left-12">
            <div className="w-16 sm:w-24 h-24 sm:h-32 bg-indigo-900 rounded-t-full relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 sm:w-16 h-16 sm:h-20 bg-indigo-800 rounded-t-full">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-indigo-700 rounded-full absolute top-1 sm:top-2 left-2 sm:left-3"></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="absolute bottom-2 sm:bottom-4 right-8 sm:right-12">
            <div className="w-16 sm:w-20 h-20 sm:h-24 relative">
                <div className="w-8 sm:w-12 h-8 sm:h-12 bg-indigo-800 rounded-lg"></div>
                <div className="w-6 sm:w-8 h-12 sm:h-16 bg-indigo-900 absolute -bottom-1 sm:-bottom-2 left-1 sm:left-2"></div>
            </div>
        </div>
    </div>
);

export default HomePage;