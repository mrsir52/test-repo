'use client';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <h1 className="text-4xl font-bold">For locals by locals</h1>
          <div className="w-2 h-2 bg-green-200 rounded-full"></div>
        </div>
        <p className="text-green-50 text-lg font-medium">Fresh breakfast sandwiches delivered fast 🎿</p>
      </div>
    </header>
  );
}