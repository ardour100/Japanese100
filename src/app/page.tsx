import Link from "next/link";
import kanjiData from "@/data/kanji.json";
import JapaneseBackground from "@/components/JapaneseBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 p-4 sm:p-8 relative">
      <JapaneseBackground />
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-rose-800 mb-2 drop-shadow-sm">
            漢字学習
          </h1>
          <p className="text-xl text-rose-600">
            Most Frequent Japanese Kanji
          </p>
          <div className="flex justify-center mt-4">
            <div className="text-2xl">🌸</div>
          </div>
        </header>

        <main className="grid grid-cols-10 gap-2 sm:gap-4 max-w-4xl mx-auto">
          {kanjiData.slice(0, 100).map((kanji) => (
            <Link
              key={kanji.id}
              href={`/kanji/${kanji.id}`}
              className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:from-rose-100 hover:to-pink-100 flex items-center justify-center group border border-rose-200 hover:border-rose-300 backdrop-blur-sm hover:backdrop-blur-none"
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-800 group-hover:text-rose-600 transition-colors drop-shadow-sm">
                {kanji.kanji}
              </span>
            </Link>
          ))}
        </main>

        <footer className="text-center mt-12 text-rose-500 text-sm">
          <p>🌸 Click on any kanji to learn more about it 🌸</p>
        </footer>
      </div>
    </div>
  );
}
