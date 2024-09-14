import { useParams, Link, useLoaderData, useFetcher } from "@remix-run/react";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import Logo from "../components/logo";
import useLocalStorage from "../functions/useLocalStorage";

// This would typically come from a database or API
// TODO: Use Stripe products or Shopify as a headless CMS
const products = {
  vase: {
    id: "vase",
    name: "3D Printed Vase",
    price: 29.99,
    category: "home-decor",
    description: "A beautiful, customizable vase perfect for any home.",
    image: "https://placehold.co/600x400",
  },
  lamp: {
    id: "lamp",
    name: "Geometric Lamp",
    price: 39.99,
    category: "home-decor",
    description: "A modern lamp with intricate geometric patterns.",
    image: "https://placehold.co/600x400",
  },
  "phone-stand": {
    id: "phone-stand",
    name: "Phone Stand",
    price: 14.99,
    category: "gadgets",
    description: "A sturdy and adjustable phone stand for your desk.",
    image: "https://placehold.co/600x400",
  },
  "cable-organizer": {
    id: "cable-organizer",
    name: "Cable Organizer",
    price: 9.99,
    category: "gadgets",
    description: "Keep your cables tidy and organized.",
    image: "https://placehold.co/600x400",
  },
  robot: {
    id: "robot",
    name: "Articulated Robot",
    price: 24.99,
    category: "toys",
    description:
      "A fun, posable robot figure with multiple points of articulation.",
    image: "https://placehold.co/600x400",
  },
  puzzle: {
    id: "puzzle",
    name: "3D Puzzle Cube",
    price: 19.99,
    category: "toys",
    description: "A challenging 3D printed puzzle cube to test your skills.",
    image: "https://placehold.co/600x400",
  },
  miniature: {
    id: "miniature",
    name: "Fantasy Miniature",
    price: 19.99,
    category: "collectables",
    description:
      "Highly detailed fantasy miniature for tabletop gaming or display.",
    image: "https://placehold.co/600x400",
  },
  figurine: {
    id: "figurine",
    name: "Custom Figurine",
    price: 34.99,
    category: "collectables",
    description:
      "Create your own custom figurine with our 3D printing service.",
    image: "https://placehold.co/600x400",
  },
};

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
  return json({ product });
};

export default function Product() {
  const { product } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [cart, setCart] = useLocalStorage<any[]>("cart", []); // Initialize cart as an empty array
  console.log({ cart });
  const addToCart = (product) => {
    setCart([...cart, product]);
  };
  return (
    <div className="container mx-auto p-4">
      <Logo />
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="md:w-1/2 md:pl-6">
            <h2 className="text-3xl font-semibold mb-4">{product.name}</h2>
            <p className="text-xl text-gray-600 mb-4">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <p className="text-sm text-gray-500 mb-4">
              Category: {product.category}
            </p>
            <button
              onClick={() => addToCart({ id: product.id, name: product.name })}
              disabled={fetcher.state === "submitting"}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              {fetcher.state === "submitting" ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Link
          to={`/categories/${product.category}`}
          className="text-blue-600 hover:underline"
        >
          Back to {product.category}
        </Link>
      </div>
    </div>
  );
}
