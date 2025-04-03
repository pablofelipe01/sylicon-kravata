"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Sylicon Logo"
            width={120}
            height={32}
            priority
          />
          <h1 className="text-xl font-bold ml-4 text-gray-800 dark:text-gray-200">
            Sylicon API Integration
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="https://github.com/your-repo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            GitHub
          </a>
          <a 
            href="https://docs.example.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            Documentation
          </a>
        </div>
      </div>
    </header>
  );
}