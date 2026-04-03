import Link from 'next/link';

export default function Offline() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <svg
                            className="w-12 h-12 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    </div>
                </div>
                <h1 className="text-3xl font-bold">You're Offline</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    It seems you don't have an active internet connection. Some features may be limited.
                </p>
                <div className="pt-4">
                    <Link
                        href="/"
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium inline-block"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        </div>
    );
}
