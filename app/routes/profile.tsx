import { getAuth } from "@clerk/remix/ssr.server";
import { UserButton } from "@clerk/remix";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "My Profile | GigaForge" },
    { name: "description", content: "Manage your GigaForge profile" }
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  
  // If not signed in, redirect to sign-in page
  if (!userId) {
    return redirect("/sign-in");
  }
  
  // In a real app, you would fetch more user data from your database here
  return json({
    userId
  });
};

export default function ProfilePage() {
  const { userId } = useLoaderData<typeof loader>();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <UserButton />
        </div>
        
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              <p className="text-gray-300 mb-2">User ID: {userId}</p>
              
              {/* This would be expanded with more user profile data */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="printFarm" 
                      className="mr-2 h-4 w-4 rounded border-gray-700 text-blue-600 focus:ring-blue-500" 
                    />
                    <label htmlFor="printFarm" className="text-gray-200">Print Farm Operations</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="functional" 
                      className="mr-2 h-4 w-4 rounded border-gray-700 text-blue-600 focus:ring-blue-500" 
                    />
                    <label htmlFor="functional" className="text-gray-200">Functional Prints</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="artistic" 
                      className="mr-2 h-4 w-4 rounded border-gray-700 text-blue-600 focus:ring-blue-500" 
                    />
                    <label htmlFor="artistic" className="text-gray-200">Artistic Creations</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Activity</h2>
              <p className="text-gray-400">Your recent activity will appear here.</p>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Followed Forges</h3>
                <p className="text-gray-400 italic">You haven't followed any forges yet.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-800">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 