import SwapForm from "@/components/SwapForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-4 sm:py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center justify-center">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Swap Currency
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Exchange tokens with real-time rates
          </p>
        </div>
        <SwapForm />
      </div>
    </main>
  );
}
