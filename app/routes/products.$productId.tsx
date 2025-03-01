import { useParams, Link, useLoaderData, useFetcher } from "@remix-run/react";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import Logo from "../components/logo";
import useLocalStorage from "../functions/useLocalStorage";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

// This would typically come from a database or API
// TODO: Use Stripe products or Shopify as a headless CMS
const products = {
  vase: {
    id: "vase",
    name: "3D Printed Vase",
    price: 29.99,
    category: "home-decor",
    description: "A beautiful, customizable vase perfect for any home.",
    image: "https://placehold.co/600x400?text=3D+Printed+Vase",
    features: ["Customizable design", "Multiple color options", "Durable material", "Waterproof coating"],
  },
  lamp: {
    id: "lamp",
    name: "Geometric Lamp",
    price: 39.99,
    category: "home-decor",
    description: "A modern lamp with intricate geometric patterns.",
    image: "https://placehold.co/600x400?text=Geometric+Lamp",
    features: ["LED compatible", "Unique geometric design", "Customizable patterns", "Easy assembly"],
  },
  "phone-stand": {
    id: "phone-stand",
    name: "Phone Stand",
    price: 14.99,
    category: "gadgets",
    description: "A sturdy and adjustable phone stand for your desk.",
    image: "https://placehold.co/600x400?text=Phone+Stand",
    features: ["Adjustable angles", "Compatible with all phones", "Non-slip surface", "Portable design"],
  },
  "cable-organizer": {
    id: "cable-organizer",
    name: "Cable Organizer",
    price: 9.99,
    category: "gadgets",
    description: "Keep your cables tidy and organized.",
    image: "https://placehold.co/600x400?text=Cable+Organizer",
    features: ["Multiple cable slots", "Desk mountable", "Customizable size", "Tangle-free design"],
  },
  robot: {
    id: "robot",
    name: "Articulated Robot",
    price: 24.99,
    category: "toys",
    description: "A fun, posable robot figure with multiple points of articulation.",
    image: "https://placehold.co/600x400?text=Articulated+Robot",
    features: ["20+ points of articulation", "Durable PLA material", "Custom color options", "Child-safe design"],
  },
  puzzle: {
    id: "puzzle",
    name: "3D Puzzle Cube",
    price: 19.99,
    category: "toys",
    description: "A challenging 3D printed puzzle cube to test your skills.",
    image: "https://placehold.co/600x400?text=3D+Puzzle+Cube",
    features: ["Multiple difficulty levels", "Unique mechanism", "Satisfying tactile feedback", "Durable construction"],
  },
  miniature: {
    id: "miniature",
    name: "Fantasy Miniature",
    price: 19.99,
    category: "collectables",
    description: "Highly detailed fantasy miniature for tabletop gaming or display.",
    image: "https://placehold.co/600x400?text=Fantasy+Miniature",
    features: ["Highly detailed", "Gaming scale compatible", "Custom paint options", "Multiple character designs"],
  },
  figurine: {
    id: "figurine",
    name: "Custom Figurine",
    price: 34.99,
    category: "collectables",
    description: "Create your own custom figurine with our 3D printing service.",
    image: "https://placehold.co/600x400?text=Custom+Figurine",
    features: ["Fully customizable", "High-resolution printing", "Multiple sizes available", "Durable finish"],
  },
};

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || '');

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.product
        ? `GigaForge - ${data.product.name}`
        : "Product Not Found",
    },
    {
      name: "description",
      content: data?.product ? data.product.description : "Product details",
    },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const product = products[params.productId as keyof typeof products];
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }
  return json({ 
    product,
    env: {
      // Pass the publishable key to the client
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    }
  });
};

export default function Product() {
  const { product, env } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [cart, setCart] = useLocalStorage<any[]>("cart", []); // Initialize cart as an empty array
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Handle Stripe Checkout
  const handleCheckout = async () => {
    setIsRedirecting(true);
    
    const formData = new FormData();
    formData.append('productId', product.id);
    formData.append('productName', product.name);
    formData.append('productPrice', (product.price * quantity).toString());
    formData.append('quantity', quantity.toString());
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        body: formData,
      });
      
      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setIsRedirecting(false);
      alert('Failed to create checkout session. Please try again.');
    }
  };
  
  const addToCart = () => {
    const cartItem = { 
      id: product.id, 
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image
    };
    setCart([...cart, cartItem]);
    alert(`Added ${quantity} ${product.name} to cart!`);
  };
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Logo />
      
      {/* Breadcrumb Navigation */}
      <nav className="text-sm mb-6 flex items-center text-gray-400">
        <Link to="/" className="hover:text-cyan-400">Home</Link>
        <span className="mx-2">›</span>
        <Link to={`/categories/${product.category}`} className="hover:text-cyan-400">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-200">{product.name}</span>
      </nav>
      
      {/* Product Card */}
      <div className="bg-black/40 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="overflow-hidden rounded-lg border border-cyan-500/20">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover transition-transform hover:scale-105"
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
              <span className="ml-2 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">In Stock</span>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>
            
            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Features:</h3>
              <ul className="space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm text-gray-400 mb-1">Quantity</label>
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center border border-cyan-500/30 text-white rounded-l hover:bg-cyan-500/20"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 h-8 border-y border-cyan-500/30 bg-transparent text-center text-white"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-cyan-500/30 text-white rounded-r hover:bg-cyan-500/20"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleCheckout}
                disabled={isRedirecting}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-colors shadow-lg shadow-cyan-500/20"
              >
                {isRedirecting ? "Redirecting to Checkout..." : "Buy Now with Stripe"}
              </button>
              
              <button
                onClick={addToCart}
                className="border border-cyan-500 text-cyan-400 px-6 py-3 rounded-lg font-medium hover:bg-cyan-500/10 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products Section - Coming Soon */}
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Related Products</h2>
        <p className="text-gray-400">Coming soon...</p>
      </div>
    </div>
  );
}
