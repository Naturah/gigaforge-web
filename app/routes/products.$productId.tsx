import { useParams, Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";

// This would typically come from a database or API
const products = {
  "vase": { id: "vase", name: "3D Printed Vase", price: 29.99, category: "home-decor", description: "A beautiful, customizable vase perfect for any home." },
  "lamp": { id: "lamp", name: "Geometric Lamp", price: 39.99, category: "home-decor", description: "A modern lamp with intricate geometric patterns." },
  "phone-stand": { id: "phone-stand", name: "Phone Stand", price: 14.99, category: "gadgets", description: "A sturdy and adjustable phone stand for your desk." },
  "cable-organizer": { id: "cable-organizer", name: "Cable Organizer", price: 9.99, category: "gadgets", description: "Keep your cables tidy and organized." },
  "robot": { id: "robot", name: "Articulated Robot", price: 24.99, category: "toys", description: "A fun, posable robot figure with multiple points of articulation." },
  "puzzle": { id: "puzzle", name: "3D Puzzle Cube", price: 19.99, category: "toys", description: "A challenging 3D printed puzzle cube to test your skills." },
  "miniature": { id: "miniature", name: "Fantasy Miniature", price: 19.99, category: "collectables", description: "Highly detailed fantasy miniature for tabletop gaming or display." },
  "figurine": { id: "figurine", name: "Custom Figurine", price: 34.99, category: "collectables", description: "Create your own custom figurine with our 3D printing service." },
};

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: data ? `GigaForge - ${data.product.name}` : "Product Not Found" },
    { name: "description", content: data ? data.product.description : "Product details" },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const product = products[params.productId as keyof typeof products];
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }
  return json({ product });
};

export default function Product() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">GigaForge</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-semibold mb-4">{product.name}</h2>
        <p className="text-xl text-gray-600 mb-4">${product.price.toFixed(2)}</p>
        <p className="text-gray-700 mb-6">{product.description}</p>
        <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">
          Add to Cart
        </button>
      </div>
      <div className="mt-8">
        <Link to={`/categories/${product.category}`} className="text-blue-600 hover:underline">
          Back to {product.category}
        </Link>
      </div>
    </div>
  );
}