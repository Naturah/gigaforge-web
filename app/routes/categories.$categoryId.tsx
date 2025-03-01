import { useParams, Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import Logo from "../components/logo";

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `GigaForge - ${params.categoryId} Products` },
    { name: "description", content: `Explore our ${params.categoryId} 3D printed products!` },
  ];
};

// This would eventually come from an API or database
const products = {
  "home-decor": [
    { id: "vase", name: "3D Printed Vase", price: 29.99, image: "https://placehold.co/600x400?text=3D+Printed+Vase", description: "A beautiful, customizable vase perfect for any home." },
    { id: "lamp", name: "Geometric Lamp", price: 39.99, image: "https://placehold.co/600x400?text=Geometric+Lamp", description: "A modern lamp with intricate geometric patterns." },
  ],
  "gadgets": [
    { id: "phone-stand", name: "Phone Stand", price: 14.99, image: "https://placehold.co/600x400?text=Phone+Stand", description: "A sturdy and adjustable phone stand for your desk." },
    { id: "cable-organizer", name: "Cable Organizer", price: 9.99, image: "https://placehold.co/600x400?text=Cable+Organizer", description: "Keep your cables tidy and organized." },
  ],
  "toys": [
    { id: "robot", name: "Articulated Robot", price: 24.99, image: "https://placehold.co/600x400?text=Articulated+Robot", description: "A fun, posable robot figure with multiple points of articulation." },
    { id: "puzzle", name: "3D Puzzle Cube", price: 19.99, image: "https://placehold.co/600x400?text=3D+Puzzle+Cube", description: "A challenging 3D printed puzzle cube to test your skills." },
  ],
  "collectables": [
    { id: "miniature", name: "Fantasy Miniature", price: 19.99, image: "https://placehold.co/600x400?text=Fantasy+Miniature", description: "Highly detailed fantasy miniature for tabletop gaming or display." },
    { id: "figurine", name: "Custom Figurine", price: 34.99, image: "https://placehold.co/600x400?text=Custom+Figurine", description: "Create your own custom figurine with our 3D printing service." },
  ],
};

export default function Category() {
  const { categoryId } = useParams();
  const categoryProducts = products[categoryId as keyof typeof products] || [];
  
  const getCategoryTitle = (id: string) => {
    const titles = {
      "home-decor": "Home Decor",
      "gadgets": "Gadgets",
      "toys": "Toys",
      "collectables": "Collectables"
    };
    return titles[id as keyof typeof titles] || id;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Logo />
      
      {/* Breadcrumb Navigation */}
      <nav className="text-sm mb-6 flex items-center text-gray-400">
        <Link to="/" className="hover:text-cyan-400">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-200">{getCategoryTitle(categoryId || '')}</span>
      </nav>
      
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3">
          {getCategoryTitle(categoryId || '')} Products
        </h1>
        <p className="text-gray-300">
          Explore our collection of 3D printed {getCategoryTitle(categoryId || '').toLowerCase()} products.
        </p>
      </div>
      
      {/* Products Grid */}
      {categoryProducts.length === 0 ? (
        <div className="bg-black/40 border border-cyan-500/30 rounded-xl p-8 text-center">
          <h2 className="text-xl text-white mb-2">No Products Found</h2>
          <p className="text-gray-400 mb-4">We couldn't find any products in this category.</p>
          <Link to="/" className="text-cyan-400 hover:underline">Return to Home</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.map((product) => (
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
                <h3 className="text-xl font-semibold text-white mb-1">{product.name}</h3>
                <p className="text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-medium">${product.price.toFixed(2)}</span>
                  <span className="bg-cyan-500/20 text-cyan-400 text-xs rounded px-2 py-1">View Details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* Back to Home Link */}
      <div className="mt-12 mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-cyan-400 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}