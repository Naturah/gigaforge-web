import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "GigaForge - 3D Printed Products" },
    { name: "description", content: "Explore our 3D printed products!" },
  ];
};

const categories = [
  { id: "collectables", name: "Collectables" },
  { id: "toys", name: "Toys" },
  { id: "characters", name: "Characters" },
  { id: "props", name: "Props" },
  { id: "miniatures", name: "Miniatures" },
  { id: "other", name: "Other" },
];

export default function Index() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">GigaForge</h1>
      <h2 className="text-2xl mb-4">Categories</h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <li key={category.id} className="border p-4 rounded-lg">
            <Link to={`/categories/${category.id}`} className="text-blue-600 hover:underline">
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

