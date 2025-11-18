import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="container py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-24">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-purple-100 text-[#5222DB] rounded-full text-sm font-semibold shadow-sm">
                ✨ AI-Powered Design Platform
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
              Create Stunning
              <span className="block bg-gradient-to-r from-[#5222DB] to-[#7c3aed] bg-clip-text text-transparent">
                Social Media Designs
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Design, customize, and export professional templates in minutes with our
              intuitive canvas editor and AI-powered copy helper.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/templates">
                <Button size="lg" variant="primary">
                  Get Started Free →
                </Button>
              </Link>
              <Link href="/designs">
                <Button size="lg" variant="outline">
                  View Designs
                </Button>
              </Link>
            </div>
          </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110" style={{ backgroundColor: '#5222DB20' }}>
              <svg className="w-8 h-8" style={{ color: '#5222DB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Template Builder</h3>
            <p className="text-gray-600 leading-relaxed">
              Create and manage reusable templates with our intuitive canvas editor
            </p>
          </div>

          <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">AI Copy Helper</h3>
            <p className="text-gray-600 leading-relaxed">
              Generate compelling copy for your designs with AI assistance
            </p>
          </div>

          <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Design Library</h3>
            <p className="text-gray-600 leading-relaxed">
              Save and organize your designs for easy access and reuse
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
