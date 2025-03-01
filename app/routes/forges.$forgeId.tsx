import { useParams, Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import Logo from "../components/logo";
import { useState } from "react";

// Sample forge data
const forges = {
  "workspace-optimization": {
    id: "workspace-optimization",
    title: "Workspace Optimization",
    description: "Transform your desk with these essential 3D prints that will make your workspace more functional, organized, and personalized. This forge guides you through creating a complete desk setup that improves productivity and showcases your maker skills.",
    image: "https://placehold.co/1200x600?text=Workspace+Optimization",
    difficulty: "Beginner",
    estimatedTime: "3 days",
    filamentRequired: "~350g",
    printerRequirements: "Any FDM printer with at least 150mm × 150mm build area",
    steps: [
      {
        stepNumber: 1,
        title: "Cable Organizer",
        description: "Keep your cables tidy and easily accessible with this modular cable management system.",
        image: "https://placehold.co/600x400?text=Cable+Organizer",
        productId: "cable-organizer",
        estimatedPrintTime: "2 hours",
        difficulty: "Easy"
      },
      {
        stepNumber: 2,
        title: "Phone Stand",
        description: "A multi-angle phone stand that keeps your device visible while working.",
        image: "https://placehold.co/600x400?text=Phone+Stand",
        productId: "phone-stand",
        estimatedPrintTime: "3 hours",
        difficulty: "Easy"
      },
      {
        stepNumber: 3,
        title: "Headphone Hook",
        description: "An under-desk hook to store your headphones when not in use.",
        image: "https://placehold.co/600x400?text=Headphone+Hook",
        productId: "headphone-hook",
        estimatedPrintTime: "1.5 hours",
        difficulty: "Easy"
      },
      {
        stepNumber: 4,
        title: "Monitor Riser",
        description: "Elevate your monitor to the optimal height and gain storage space underneath.",
        image: "https://placehold.co/600x400?text=Monitor+Riser",
        productId: "monitor-riser",
        estimatedPrintTime: "8 hours",
        difficulty: "Medium"
      },
      {
        stepNumber: 5,
        title: "Desk Organizer",
        description: "A customizable organizer for pens, sticky notes, and small desk items.",
        image: "https://placehold.co/600x400?text=Desk+Organizer",
        productId: "desk-organizer",
        estimatedPrintTime: "4 hours",
        difficulty: "Medium"
      }
    ],
    creator: "GigaForge Team",
    communityRating: 4.8,
    completionCount: 237,
    relatedForges: ["smart-home-essentials", "productivity-boosters"]
  },
  "smart-home-essentials": {
    id: "smart-home-essentials",
    title: "Smart Home Essentials",
    description: "Level up your smart home with these must-have accessories for your devices. This forge will guide you through creating perfect companions for your smart speakers, displays, and other connected devices.",
    image: "https://placehold.co/1200x600?text=Smart+Home+Essentials",
    difficulty: "Intermediate",
    estimatedTime: "5 days",
    filamentRequired: "~500g",
    printerRequirements: "Any FDM printer with at least 180mm × 180mm build area",
    steps: [
      {
        stepNumber: 1,
        title: "Echo Dot Wall Mount",
        description: "Wall mount for your Echo Dot that keeps it accessible while saving space.",
        image: "https://placehold.co/600x400?text=Echo+Dot+Wall+Mount",
        productId: "echo-mount",
        estimatedPrintTime: "3 hours",
        difficulty: "Easy"
      },
      {
        stepNumber: 2,
        title: "Smart Plug Organizer",
        description: "Organize multiple smart plugs in a power strip without blocking adjacent outlets.",
        image: "https://placehold.co/600x400?text=Smart+Plug+Organizer",
        productId: "plug-organizer",
        estimatedPrintTime: "2 hours",
        difficulty: "Easy"
      },
      {
        stepNumber: 3,
        title: "Tablet Wall Dock",
        description: "A sleek wall dock for your tablet or smart display.",
        image: "https://placehold.co/600x400?text=Tablet+Wall+Dock",
        productId: "tablet-dock",
        estimatedPrintTime: "5 hours",
        difficulty: "Medium"
      },
      {
        stepNumber: 4,
        title: "Home Security Camera Mount",
        description: "Adjustable mount for indoor security cameras with cable management.",
        image: "https://placehold.co/600x400?text=Camera+Mount",
        productId: "camera-mount",
        estimatedPrintTime: "4 hours",
        difficulty: "Medium"
      },
      {
        stepNumber: 5,
        title: "Remote Holder",
        description: "Organize all your remotes in one accessible place.",
        image: "https://placehold.co/600x400?text=Remote+Holder",
        productId: "remote-holder",
        estimatedPrintTime: "3 hours",
        difficulty: "Easy"
      },
      {
        stepNumber: 6,
        title: "Cable Concealer",
        description: "Hide unsightly cables along walls and furniture.",
        image: "https://placehold.co/600x400?text=Cable+Concealer",
        productId: "cable-concealer",
        estimatedPrintTime: "6 hours",
        difficulty: "Medium"
      },
      {
        stepNumber: 7,
        title: "Smart Thermostat Frame",
        description: "A decorative frame for your smart thermostat that enhances its appearance.",
        image: "https://placehold.co/600x400?text=Thermostat+Frame",
        productId: "thermostat-frame",
        estimatedPrintTime: "3 hours",
        difficulty: "Hard"
      }
    ],
    creator: "GigaForge Team",
    communityRating: 4.7,
    completionCount: 184,
    relatedForges: ["workspace-optimization", "home-entertainment-center"]
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.forge
        ? `GigaForge - ${data.forge.title} Forge`
        : "Forge Not Found",
    },
    {
      name: "description",
      content: data?.forge ? data.forge.description : "Forge details",
    },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const forge = forges[params.forgeId as keyof typeof forges];
  if (!forge) {
    throw new Response("Forge not found", { status: 404 });
  }
  return json({ forge });
};

export default function ForgeDetail() {
  const { forge } = useLoaderData<typeof loader>();
  const [activeStep, setActiveStep] = useState<number | null>(null);
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Logo />
      
      {/* Breadcrumb Navigation */}
      <nav className="text-sm mb-6 flex items-center text-gray-400">
        <Link to="/" className="hover:text-cyan-400">Home</Link>
        <span className="mx-2">›</span>
        <Link to="/forges" className="hover:text-cyan-400">Forges</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-200">{forge.title}</span>
      </nav>
      
      {/* Forge Hero */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <img 
          src={forge.image} 
          alt={forge.title}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-cyan-500/20 text-cyan-400 text-xs rounded px-2 py-1 flex items-center">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-1"></span>
              {forge.difficulty}
            </span>
            <span className="bg-purple-500/20 text-purple-400 text-xs rounded px-2 py-1 flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-1"></span>
              {forge.estimatedTime}
            </span>
            <span className="bg-blue-500/20 text-blue-400 text-xs rounded px-2 py-1 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
              {forge.steps.length} Prints
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{forge.title}</h1>
          <p className="text-gray-300 text-lg max-w-3xl">{forge.description}</p>
        </div>
      </div>
      
      {/* Forge Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="bg-black/40 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Forge Overview</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-6">{forge.description}</p>
              
              <h3 className="text-xl font-semibold text-white mb-3">Requirements</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span className="text-gray-300"><strong>Estimated Time:</strong> {forge.estimatedTime}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span className="text-gray-300"><strong>Filament Required:</strong> {forge.filamentRequired}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span className="text-gray-300"><strong>Printer:</strong> {forge.printerRequirements}</span>
                </li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mb-3">Community Stats</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-black/60 p-3 rounded-lg text-center">
                  <span className="block text-cyan-400 text-xl font-bold">{forge.communityRating}</span>
                  <span className="text-gray-400 text-sm">Rating</span>
                </div>
                <div className="bg-black/60 p-3 rounded-lg text-center">
                  <span className="block text-cyan-400 text-xl font-bold">{forge.completionCount}</span>
                  <span className="text-gray-400 text-sm">Completions</span>
                </div>
                <div className="bg-black/60 p-3 rounded-lg text-center">
                  <span className="block text-cyan-400 text-xl font-bold">{forge.creator}</span>
                  <span className="text-gray-400 text-sm">Creator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-black/40 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 rounded-xl p-6 backdrop-blur-sm sticky top-4">
            <h3 className="text-xl font-bold text-white mb-4">Start This Forge</h3>
            <p className="text-gray-300 mb-6">Follow this forge to track your progress and unlock achievements.</p>
            <button 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-colors shadow-lg shadow-cyan-500/20 mb-4"
            >
              Begin Forge Journey
            </button>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Difficulty: {forge.difficulty}</span>
              <span>{forge.steps.length} prints</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Print Steps */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Forge Journey Steps</h2>
        
        <div className="space-y-4">
          {forge.steps.map((step, index) => (
            <div 
              key={index}
              className={`bg-black/40 border ${activeStep === step.stepNumber ? 'border-cyan-500' : 'border-cyan-500/30'} rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-cyan-500/20`}
            >
              <div 
                className="flex flex-col md:flex-row cursor-pointer"
                onClick={() => setActiveStep(activeStep === step.stepNumber ? null : step.stepNumber)}
              >
                <div className="md:w-1/4 p-4 flex items-center border-b md:border-b-0 md:border-r border-cyan-500/30">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-cyan-400 font-bold">{step.stepNumber}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <div className="flex space-x-2 text-xs mt-1">
                      <span className="text-gray-400">{step.estimatedPrintTime}</span>
                      <span className="text-gray-600">•</span>
                      <span className={`
                        ${step.difficulty === 'Easy' ? 'text-green-400' : 
                          step.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'}
                      `}>{step.difficulty}</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-3/4 p-4 flex justify-between items-center">
                  <p className="text-gray-300 text-sm pr-4">{step.description}</p>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-cyan-400 transition-transform ${activeStep === step.stepNumber ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Expanded Content */}
              {activeStep === step.stepNumber && (
                <div className="p-4 border-t border-cyan-500/30 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">{step.title}</h4>
                      <p className="text-gray-300 mb-4">{step.description}</p>
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-400 mb-1">Print Details:</h5>
                        <ul className="space-y-1">
                          <li className="text-gray-300 text-sm">
                            <span className="text-gray-500">Print Time:</span> {step.estimatedPrintTime}
                          </li>
                          <li className="text-gray-300 text-sm">
                            <span className="text-gray-500">Difficulty:</span> {step.difficulty}
                          </li>
                          <li className="text-gray-300 text-sm">
                            <span className="text-gray-500">Product ID:</span> {step.productId}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/products/${step.productId}`}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-colors shadow-lg shadow-cyan-500/20 text-sm"
                      >
                        View Product
                      </Link>
                      <button className="border border-cyan-500 text-cyan-400 px-4 py-2 rounded-lg font-medium hover:bg-cyan-500/10 transition-colors text-sm">
                        Mark Complete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Related Forges */}
      {forge.relatedForges && forge.relatedForges.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Related Forges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {forge.relatedForges.map((forgeId, index) => {
              const relatedForge = forges[forgeId as keyof typeof forges];
              if (!relatedForge) return null;
              
              return (
                <Link 
                  to={`/forges/${relatedForge.id}`} 
                  key={index} 
                  className="bg-black/40 border border-cyan-500/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cyan-500/20 transition-all group"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={relatedForge.image} 
                      alt={relatedForge.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold">{relatedForge.title}</h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Community Showcase - Coming Soon */}
      <div className="mb-12 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Community Showcase</h2>
        <p className="text-gray-300 mb-6">Coming soon! See how others have completed this forge and share your own journey.</p>
      </div>
      
      {/* Back to Forges */}
      <div className="mt-12 mb-8">
        <Link 
          to="/forges" 
          className="inline-flex items-center text-cyan-400 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to All Forges
        </Link>
      </div>
    </div>
  );
} 