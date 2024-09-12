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
];

export default function Index() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">GigaForge</h1>
      <p>About</p>
    </div>
  );
}

