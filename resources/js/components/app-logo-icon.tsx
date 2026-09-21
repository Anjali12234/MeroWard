import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg 
            {...props} 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0072BC" />
                    <stop offset="100%" stopColor="#005A9E" />
                </linearGradient>
            </defs>

            <circle cx="50" cy="50" r="48" fill="url(#blueGradient)" />

            <g transform="translate(50, 50) scale(1.15)">
                <path d="M-20,-10 L0,-24 L20,-10 Z" fill="#EAEAEA" stroke="#111111" strokeWidth="2.5" strokeLinejoin="round"/>
                
                <rect x="-18" y="-10" width="36" height="4" fill="#D6D6D6" stroke="#111111" strokeWidth="2" />

                <rect x="-16" y="-6" width="6" height="20" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
                <rect x="-3" y="-6" width="6" height="20" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
                <rect x="10" y="-6" width="6" height="20" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />

                <path d="M-3,4 Q0,1 3,4 L3,14 L-3,14 Z" fill="#4A4A4A" />

                <rect x="-20" y="14" width="40" height="5" fill="#D6D6D6" stroke="#111111" strokeWidth="2" rx="1" />
            </g>
        </svg>
    );
}