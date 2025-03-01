import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Logo from "../components/logo";

export const meta: MetaFunction = () => {
  return [
    { title: "GigaForge - 3D Printed Products" },
    { name: "description", content: "Explore our 3D printed products!" },
  ];
};

const categories = [
  { 
    id: "home-decor", 
    name: "Home Decor",
    description: "Beautiful 3D printed decorations for your home",
    image: "https://placehold.co/600x400?text=Home+Decor" 
  },
  { 
    id: "gadgets", 
    name: "Gadgets",
    description: "Useful 3D printed tech accessories and gadgets", 
    image: "https://placehold.co/600x400?text=Gadgets" 
  },
  { 
    id: "toys", 
    name: "Toys",
    description: "Fun and educational 3D printed toys",
    image: "https://placehold.co/600x400?text=Toys" 
  },
  { 
    id: "collectables", 
    name: "Collectables",
    description: "Unique 3D printed collectables and figurines",
    image: "https://placehold.co/600x400?text=Collectables" 
  }
];

const featuredProducts = [
  { id: "vase", name: "3D Printed Vase", category: "home-decor", price: 29.99, image: "https://placehold.co/600x400?text=3D+Printed+Vase" },
  { id: "robot", name: "Articulated Robot", category: "toys", price: 24.99, image: "https://placehold.co/600x400?text=Articulated+Robot" }
];

// Sample featured forges data
const featuredForges = [
  {
    id: "workspace-optimization",
    title: "Workspace Optimization",
    description: "Transform your desk setup with these essential 3D prints",
    image: "https://placehold.co/600x400?text=Workspace+Optimization",
    printCount: 5,
    difficulty: "Beginner",
    estimatedTime: "3 days"
  },
  {
    id: "smart-home-essentials",
    title: "Smart Home Essentials",
    description: "Level up your smart home with these useful accessories",
    image: "https://placehold.co/600x400?text=Smart+Home+Essentials",
    printCount: 7,
    difficulty: "Intermediate",
    estimatedTime: "5 days"
  }
];

export default function Index() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Logo />
      
      {/* Hero Section */}
      <div className="mb-16 mt-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          3D Printed Products for Every Need
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Discover our collection of high-quality 3D printed products, from home decor to collectables.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            to="/categories/home-decor" 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-colors shadow-lg shadow-cyan-500/20"
          >
            Shop Now
          </Link>
          <Link 
            to="/about" 
            className="border border-cyan-500 text-cyan-400 px-6 py-3 rounded-lg font-medium hover:bg-cyan-500/10 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
      
      {/* Featured Forges Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Featured Forges</h2>
            <p className="text-gray-400">Guided 3D printing journeys to level up your skills</p>
          </div>
          <Link to="/forges" className="text-cyan-400 hover:underline">View All Forges</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredForges.map((forge) => (
            <Link 
              to={`/forges/${forge.id}`} 
              key={forge.id} 
              className="bg-black/40 border border-cyan-500/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all group relative"
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={forge.image} 
                  alt={forge.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">{forge.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{forge.description}</p>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <span className="text-xs block text-gray-400">Prints</span>
                    <span className="text-cyan-400 font-bold">{forge.printCount}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs block text-gray-400">Difficulty</span>
                    <span className="text-cyan-400 font-bold">{forge.difficulty}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs block text-gray-400">Time</span>
                    <span className="text-cyan-400 font-bold">{forge.estimatedTime}</span>
                  </div>
                </div>
                <span className="bg-cyan-500/20 text-cyan-400 text-xs rounded px-2 py-1">Explore Forge</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Featured Products</h2>
          <Link to="/products" className="text-cyan-400 hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProducts.map((product) => (
            <Link 
              to={`/products/${product.id}`} 
              key={product.id} 
              className="bg-black/40 border border-cyan-500/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all group"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-cyan-400">${product.price.toFixed(2)}</p>
                  <span className="text-gray-400 text-sm">{product.category.replace('-', ' ')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              to={`/categories/${category.id}`} 
              key={category.id} 
              className="bg-black/40 border border-cyan-500/30 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-cyan-500/20 group"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                <p className="text-gray-400 mt-1">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Newsletter - Coming Soon */}
      <section className="mt-16 mb-8 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Join Our Newsletter</h2>
        <p className="text-gray-300 mb-6">Coming soon! Stay updated with our latest products and offers.</p>
      </section>
    </div>
  );
}

