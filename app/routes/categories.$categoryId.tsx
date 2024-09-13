import { useParams, Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import Logo from "../components/logo";
import PageTitle from "../components/pagetitle";

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `GigaForge - ${params.categoryId} Products` },
    { name: "description", content: `Explore our ${params.categoryId} 3D printed products!` },
  ];
};

const products = {
  "collectables": [
    { id: "robot", name: "Articulated Robot", price: 24.99 },
    { id: "puzzle", name: "3D Puzzle Cube", price: 19.99 },
    { id: "doll", name: "3D Printed Doll", price: 39.99 },
    { id: "figurine", name: "3D Printed Figurine", price: 49.99 },
  ],
};

export default function Category() {
  const { categoryId } = useParams();
  console.log(categoryId)
  const categoryProducts = products[categoryId as keyof typeof products] || [];

  return (
    <div className="container mx-auto p-4">
     <Logo />
      <PageTitle>{categoryId} Products</PageTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categoryProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-md">
            <img
              src={`https://placehold.co/300x200?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              className="w-full h-48 object-cover mb-4 rounded-lg"
            />
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            <Link
              to={`/products/${product.id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link to="/" className="text-blue-600 hover:underline">
          Back to Categories
        </Link>
      </div>
    </div>
  );
}