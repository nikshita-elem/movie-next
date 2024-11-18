import Image from 'next/image';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="relative w-full h-64 lg:h-80">
            <Image
                src="/Vectors.svg"
                alt="" 
                className="w-full h-full object-cover"
                fill
                priority
                sizes="100vw"
                role="presentation"
            />
            {/* Optional: Add footer content here */}
            <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white text-center text-sm md:text-base">
                    &copy; {new Date().getFullYear()} Your Company. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

// Wrapping with React.memo for performance optimization
const MemoizedFooter = React.memo(Footer);

// Assigning a displayName for better debugging and readability in React DevTools
MemoizedFooter.displayName = 'Footer';

export default MemoizedFooter;
