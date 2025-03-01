import { Link } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import Logo from "../components/logo";

export const meta: MetaFunction = () => {
  return [
    { title: "GigaForge - Explore Forges" },
    { name: "description", content: "Discover guided 3D printing journeys with GigaForge Forges" },
  ];
};

// Sample forge data
const forgeCategories = [
  {
    id: "home-improvement",
    title: "Home Improvement",
    description: "Enhance your living space with functional 3D prints",
    image: "https://placehold.co/800x400?text=Home+Improvement",
    forges: [
      {
        id: "workspace-optimization",
        title: "Workspace Optimization",
        description: "Transform your desk with essential 3D prints that improve functionality",
        image: "https://placehold.co/600x400?text=Workspace+Optimization",
        difficulty: "Beginner",
        printCount: 5,
        estimatedTime: "3 days"
      },
      {
        id: "bathroom-accessories",
        title: "Bathroom Accessories",
        description: "Upgrade your bathroom with custom organizers and fixtures",
        image: "https://placehold.co/600x400?text=Bathroom+Accessories",
        difficulty: "Beginner",
        printCount: 6,
        estimatedTime: "4 days"
      },
      {
        id: "kitchen-essentials",
        title: "Kitchen Essentials",
        description: "Practical kitchen gadgets and organization solutions",
        image: "https://placehold.co/600x400?text=Kitchen+Essentials",
        difficulty: "Intermediate",
        printCount: 8,
        estimatedTime: "5 days"
      }
    ]
  },
  {
    id: "technology",
    title: "Technology",
    description: "Enhance your devices and tech setup",
    image: "https://placehold.co/800x400?text=Technology",
    forges: [
      {
        id: "smart-home-essentials",
        title: "Smart Home Essentials",
        description: "Must-have accessories for your smart home devices",
        image: "https://placehold.co/600x400?text=Smart+Home+Essentials",
        difficulty: "Intermediate",
        printCount: 7,
        estimatedTime: "5 days"
      },
      {
        id: "portable-tech-accessories",
        title: "Portable Tech Accessories",
        description: "On-the-go solutions for your tech devices",
        image: "https://placehold.co/600x400?text=Portable+Tech+Accessories",
        difficulty: "Beginner",
        printCount: 6,
        estimatedTime: "3 days"
      }
    ]
  },
  {
    id: "hobbies",
    title: "Hobbies & Interests",
    description: "Enhance your favorite activities with custom 3D prints",
    image: "https://placehold.co/800x400?text=Hobbies",
    forges: [
      {
        id: "photography-accessories",
        title: "Photography Accessories",
        description: "Enhance your photography setup with custom tools and mounts",
        image: "https://placehold.co/600x400?text=Photography+Accessories",
        difficulty: "Intermediate",
        printCount: 5,
        estimatedTime: "4 days"
      },
      {
        id: "tabletop-gaming",
        title: "Tabletop Gaming Set",
        description: "Create a complete set of gaming accessories for your table",
        image: "https://placehold.co/600x400?text=Tabletop+Gaming",
        difficulty: "Advanced",
        printCount: 12,
        estimatedTime: "8 days"
      },
      {
        id: "gardening-tools",
        title: "Gardening Tools",
        description: "Custom tools and organizers for garden enthusiasts",
        image: "https://placehold.co/600x400?text=Gardening+Tools",
        difficulty: "Beginner",
        printCount: 7,
        estimatedTime: "5 days"
      }
    ]
  }
];

export default function ForgesIndex() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Logo />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cyan-900/40 to-purple-900/40 rounded-xl overflow-hidden mb-12 p-8 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Forge Your 3D Printing Journey
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl">
            Follow guided paths to create cohesive collections of 3D prints. Each Forge is a curated journey that guides you from start to finish.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#featured" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-colors shadow-lg shadow-cyan-500/20">
              Explore Forges
            </a>
            <a href="#how-it-works" className="bg-black/30 backdrop-blur-sm border border-cyan-500/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-cyan-500/10 transition-colors">
              How It Works
            </a>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div id="how-it-works" className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">How Forges Work</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black/40 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-cyan-400 text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Choose a Forge</h3>
            <p className="text-gray-300">Browse our collection of curated Forges and select one that matches your interests and skill level.</p>
          </div>
          
          <div className="bg-black/40 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-cyan-400 text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Follow the Journey</h3>
            <p className="text-gray-300">Each Forge provides step-by-step guidance, with each print building towards a cohesive collection.</p>
          </div>
          
          <div className="bg-black/40 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-cyan-400 text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Share & Showcase</h3>
            <p className="text-gray-300">Complete your Forge journey and share your creations with the GigaForge community.</p>
          </div>
        </div>
      </div>
      
      {/* Featured Forges */}
      <div id="featured" className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Featured Forges</h2>
        <p className="text-gray-300 mb-8">Start with these popular journeys curated by our team</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            forgeCategories[0].forges[0],
            forgeCategories[1].forges[0],
            forgeCategories[2].forges[1]
          ].map((forge, index) => (
            <Link 
              to={`/forges/${forge.id}`} 
              key={index} 
              className="bg-black/40 border border-cyan-500/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all group"
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={forge.image} 
                  alt={forge.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex gap-2 mb-2">
                    <span className="bg-cyan-500/20 text-cyan-400 text-xs rounded px-2 py-1">{forge.difficulty}</span>
                    <span className="bg-purple-500/20 text-purple-400 text-xs rounded px-2 py-1">{forge.printCount} prints</span>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-1">{forge.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{forge.description}</p>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div className="text-sm text-gray-400">Est. Time: {forge.estimatedTime}</div>
                <div className="text-cyan-400 flex items-center">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Forge Categories */}
      {forgeCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{category.title}</h2>
              <p className="text-gray-300">{category.description}</p>
            </div>
            <Link 
              to={`/forge-categories/${category.id}`}
              className="text-cyan-400 flex items-center hover:underline"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.forges.map((forge, forgeIndex) => (
              <Link 
                to={`/forges/${forge.id}`} 
                key={forgeIndex} 
                className="bg-black/40 border border-cyan-500/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all group"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={forge.image} 
                    alt={forge.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex gap-2 mb-2">
                      <span className="bg-cyan-500/20 text-cyan-400 text-xs rounded px-2 py-1">{forge.difficulty}</span>
                      <span className="bg-purple-500/20 text-purple-400 text-xs rounded px-2 py-1">{forge.printCount} prints</span>
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-1">{forge.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2">{forge.description}</p>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div className="text-sm text-gray-400">Est. Time: {forge.estimatedTime}</div>
                  <div className="text-cyan-400 flex items-center">
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
      
      {/* Community Section */}
      <div className="mb-16">
        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 rounded-xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Join Our Community</h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl">
              Connect with other makers, share your completed Forges, and discover inspiration for your next project.
            </p>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-colors shadow-lg shadow-cyan-500/20">
              Community Hub (Coming Soon)
            </button>
          </div>
        </div>
      </div>
      
      {/* Create Your Own */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Create Your Own Forge</h2>
        <p className="text-gray-300 mb-8">Have a great idea for a Forge journey? Design your own and share it with the community.</p>
        
        <div className="bg-black/40 border border-cyan-500/30 rounded-xl p-6 md:p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Forge Creator Tools</h3>
              <p className="text-gray-300 mb-4">
                Our Forge Creator tools make it easy to design, test, and publish your own Forge journeys. 
                Guide others through your creative process and showcase your expertise.
              </p>
              <button className="bg-black/60 border border-cyan-500/50 text-cyan-400 px-6 py-3 rounded-lg font-medium hover:bg-cyan-500/10 transition-colors">
                Coming Soon
              </button>
            </div>
            <div className="bg-black/60 p-6 rounded-xl border border-gray-800">
              <div className="aspect-video bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-400">Forge Creator Studio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 