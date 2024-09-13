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
  { id: "collectables", name: "Collectables" },
];

export default function Index() {
  return (
    <div className="container mx-auto p-4">
      <Logo />
      <p>About</p>
    </div>
  );
}

