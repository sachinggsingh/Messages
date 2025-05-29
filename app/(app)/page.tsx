// import Dashboard from "./dashboard/page"

// export default function Home() {
//   return (
//     <main className="min-h-screen">
//       <Dashboard />
//     </main>
//   );
// }
 

import Link  from 'next/link'
import React from 'react'


const page = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
    <section className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold text-white mb-6 mt-16">
        Send Anonymous Messages
      </h1>
      <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        Share your thoughts and questions anonymously. Connect with others in a safe and engaging way.
      </p>
      <div className="flex gap-4 justify-center">
        <Link 
          href="/sign-up" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Get Started
        </Link>
        <Link 
          href="/sign-in" 
          className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Sign In
        </Link>
      </div>
    </section>

    {/* Features Section */}
    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-blue-500 text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-white mb-2">Anonymous</h3>
          <p className="text-gray-400">Send and receive messages while maintaining your privacy.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-blue-500 text-4xl mb-4">💭</div>
          <h3 className="text-xl font-semibold text-white mb-2">Engaging</h3>
          <p className="text-gray-400">Get thoughtful questions and meaningful interactions.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-blue-500 text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold text-white mb-2">Instant</h3>
          <p className="text-gray-400">Real-time messaging with instant delivery.</p>
        </div>
      </div>
    </section>

    {/* How It Works Section */}
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">1</div>
          <h3 className="text-xl font-semibold text-white mb-2">Create Profile</h3>
          <p className="text-gray-400">Sign up and create your unique profile</p>
        </div>
        <div className="text-center">
          <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">2</div>
          <h3 className="text-xl font-semibold text-white mb-2">Share Link</h3>
          <p className="text-gray-400">Share your profile link with friends</p>
        </div>
        <div className="text-center">
          <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">3</div>
          <h3 className="text-xl font-semibold text-white mb-2">Receive Messages</h3>
          <p className="text-gray-400">Get anonymous messages from others</p>
        </div>
      </div>
    </section>
  </main>
  )
}

export default page
