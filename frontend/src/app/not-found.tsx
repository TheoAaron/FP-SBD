// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      {/* 404 Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-8xl font-bold text-black mb-8">404 Not Found</h1>
          <p className="text-gray-600 text-lg mb-8">
            Your visited page not found. You may go home page.
          </p>
          <Link href="/">
            <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md font-medium transition-colors duration-200">
              Back to home page
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}