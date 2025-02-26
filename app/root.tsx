import React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syncopate:wght@400;700&family=Rajdhani:wght@300;400;500;600;700&family=Inter:wght@300;400;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-black text-gray-100 font-space-grotesk">
        <div className="min-h-full flex flex-col relative overflow-hidden">
          {/* Enhanced futuristic background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20 z-0"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxYTFhM2EiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20 z-0"></div>
          
          {/* Animated light beams */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-cyan-500/10 blur-[100px] animate-pulse z-0"></div>
          <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-purple-500/10 blur-[100px] animate-pulse z-0"></div>
          
          <header className="relative z-10 border-b border-cyan-500/50 backdrop-blur-sm bg-black/40 shadow-[0_0_15px_rgba(8,145,178,0.2)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-syncopate tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">GIGAFORGE</h1>
              <nav className="hidden md:block">
                <ul className="flex space-x-8">
                  {['Products', 'Technology', 'Solutions', 'Community'].map((item) => (
                    <li key={item} className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">
                      {item}
                    </li>
                  ))}
                </ul>
              </nav>
              <button className="py-2 px-4 rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                Connect
              </button>
            </div>
          </header>
          
          <main className="flex-grow relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Enhanced Hero section */}
              <div className="mb-20 text-center relative">
                <div className="absolute inset-0 flex justify-center">
                  <div className="w-1/2 h-full bg-gradient-to-b from-cyan-500/20 via-purple-500/10 to-transparent blur-[50px] opacity-70"></div>
                </div>
                <h2 className="text-4xl md:text-6xl font-syncopate font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                  THE FUTURE OF 3D PRINTING
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto font-rajdhani">
                  Revolutionizing manufacturing with Web3 technology and next-generation 3D printing solutions.
                </p>
              </div>
              
              {/* Creator Studio Section - Enhanced with more glow and sharper visuals */}
              <div className="mb-24 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur-xl opacity-70 z-0"></div>
                <div className="relative z-10 border border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-sm bg-black/60 shadow-[0_0_30px_rgba(8,145,178,0.3)]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-600"></div>
                  
                  <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                      <div>
                        <h2 className="text-3xl font-syncopate font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                          CREATOR STUDIO
                        </h2>
                        <p className="text-gray-300 font-rajdhani text-xl">
                          Design, customize, and bring your ideas to life
                        </p>
                      </div>
                      <button className="mt-4 md:mt-0 py-2 px-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all">
                        Launch Studio
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          title: 'AI-Powered Design',
                          description: 'Generate complex 3D models with simple text prompts using our advanced AI tools.',
                          icon: '✨'
                        },
                        {
                          title: 'Parametric Modeling',
                          description: 'Create customizable designs with dynamic parameters that adapt to your needs.',
                          icon: '⚙️'
                        },
                        {
                          title: 'Collaborative Workspace',
                          description: 'Work together in real-time with team members across the globe.',
                          icon: '👥'
                        }
                      ].map((feature, index) => (
                        <div 
                          key={index} 
                          className="relative group p-6 border border-cyan-500/20 rounded-lg bg-gray-900/60 hover:bg-gray-900/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        >
                          <div className="text-3xl mb-4">{feature.icon}</div>
                          <h3 className="text-xl font-rajdhani font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                            {feature.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {feature.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-12 relative">
                      <div className="h-64 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-4">🎮</div>
                            <p className="text-xl font-rajdhani font-bold text-cyan-400">Interactive Demo</p>
                            <p className="text-sm text-gray-400 mt-2">Experience the Creator Studio interface</p>
                            <button className="mt-4 py-2 px-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all">
                              Try Demo
                            </button>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxYTFhM2EiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Digital Marketplace Section - Enhanced with more glow and sharper visuals */}
              <div className="mb-24 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 rounded-2xl blur-xl opacity-70 z-0"></div>
                <div className="relative z-10 border border-purple-500/30 rounded-xl overflow-hidden backdrop-blur-sm bg-black/60 shadow-[0_0_30px_rgba(147,51,234,0.3)]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-cyan-500"></div>
                  
                  <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                      <div>
                        <h2 className="text-3xl font-syncopate font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500 drop-shadow-[0_0_5px_rgba(147,51,234,0.5)]">
                          DIGITAL MARKETPLACE
                        </h2>
                        <p className="text-gray-300 font-rajdhani text-xl">
                          Buy, sell, and trade 3D models with secure blockchain verification
                        </p>
                      </div>
                      <button className="mt-4 md:mt-0 py-2 px-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-600 text-white font-medium hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all">
                        Browse Marketplace
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        {
                          title: 'Mech Warrior X9',
                          creator: 'CyberForge',
                          price: '0.25 ETH',
                          image: '🤖'
                        },
                        {
                          title: 'Quantum Reactor',
                          creator: 'NeoDesigns',
                          price: '0.18 ETH',
                          image: '⚛️'
                        },
                        {
                          title: 'Cybernetic Implant',
                          creator: 'SynthLabs',
                          price: '0.32 ETH',
                          image: '🦾'
                        },
                        {
                          title: 'Hovercraft X-7',
                          creator: 'FutureWorks',
                          price: '0.41 ETH',
                          image: '🚀'
                        }
                      ].map((item, index) => (
                        <div 
                          key={index} 
                          className="relative group overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                        >
                          {/* Glowing border effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-cyan-600/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute inset-[1px] bg-gray-900 rounded-[7px] z-10"></div>
                          
                          <div className="relative z-20 p-4 h-full flex flex-col">
                            <div className="h-32 bg-gradient-to-b from-gray-800 to-gray-900 rounded flex items-center justify-center mb-4">
                              <span className="text-5xl">{item.image}</span>
                            </div>
                            <h3 className="text-md font-rajdhani font-bold text-white mb-1">
                              {item.title}
                            </h3>
                            <p className="text-gray-400 text-xs mb-2">by {item.creator}</p>
                            <div className="mt-auto flex justify-between items-center">
                              <span className="text-sm font-medium text-purple-400">{item.price}</span>
                              <button className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-cyan-600 flex items-center justify-center text-white text-xs">
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 flex justify-center">
                      <button className="py-2 px-6 rounded-full border border-purple-500/30 text-purple-400 text-sm font-medium hover:bg-purple-500/10 transition-all">
                        View All Models →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {children}
            </div>
          </main>
          
          <footer className="relative z-10 border-t border-cyan-500/30 backdrop-blur-sm bg-black/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-syncopate text-cyan-400 mb-4 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">GIGAFORGE</h3>
                  <p className="text-sm text-gray-400">Revolutionizing the future of 3D printing with cutting-edge technology and Web3 integration.</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-300 mb-4">Products</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {['Printers', 'Materials', 'Software', 'Accessories'].map((item) => (
                      <li key={item} className="hover:text-cyan-400 transition-colors">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-300 mb-4">Resources</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {['Documentation', 'API', 'Community', 'Support'].map((item) => (
                      <li key={item} className="hover:text-cyan-400 transition-colors">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-300 mb-4">Connect</h4>
                  <div className="flex space-x-4">
                    {['Twitter', 'Discord', 'GitHub', 'LinkedIn'].map((item) => (
                      <span key={item} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-900 transition-colors cursor-pointer">
                        <span className="text-xs text-cyan-400">{item[0]}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} GIGAFORGE. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
        
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
