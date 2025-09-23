"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import phrasesData from "@/data/daily-phrases.json";
import JapaneseBackground from "@/components/JapaneseBackground";
import Header from "@/components/Header";

// Add CSS for ruby text styling
const rubyStyles = `
  ruby {
    ruby-align: center;
  }

  rt {
    font-size: 0.5em;
    line-height: 1;
    text-align: center;
    color: inherit;
    opacity: 0.8;
  }
`;

const categories = [
  "all",
  "greetings",
  "farewells",
  "gratitude",
  "apology",
  "introduction",
  "workplace",
  "dining",
  "home",
  "responses",
  "understanding",
  "health",
  "time",
  "shopping",
  "directions",
  "requests",
  "feelings",
  "weather",
  "conversation",
  "information"
];

const categoryColors = {
  all: "from-rose-100 to-pink-100 border-rose-300 text-rose-800",
  greetings: "from-green-100 to-emerald-100 border-green-300 text-green-800",
  farewells: "from-blue-100 to-cyan-100 border-blue-300 text-blue-800",
  gratitude: "from-purple-100 to-violet-100 border-purple-300 text-purple-800",
  apology: "from-red-100 to-rose-100 border-red-300 text-red-800",
  introduction: "from-yellow-100 to-amber-100 border-yellow-300 text-yellow-800",
  workplace: "from-indigo-100 to-blue-100 border-indigo-300 text-indigo-800",
  dining: "from-orange-100 to-red-100 border-orange-300 text-orange-800",
  home: "from-pink-100 to-rose-100 border-pink-300 text-pink-800",
  responses: "from-teal-100 to-cyan-100 border-teal-300 text-teal-800",
  understanding: "from-lime-100 to-green-100 border-lime-300 text-lime-800",
  health: "from-emerald-100 to-teal-100 border-emerald-300 text-emerald-800",
  time: "from-slate-100 to-gray-100 border-slate-300 text-slate-800",
  shopping: "from-amber-100 to-yellow-100 border-amber-300 text-amber-800",
  directions: "from-sky-100 to-blue-100 border-sky-300 text-sky-800",
  requests: "from-violet-100 to-purple-100 border-violet-300 text-violet-800",
  feelings: "from-rose-100 to-pink-100 border-rose-300 text-rose-800",
  weather: "from-cyan-100 to-blue-100 border-cyan-300 text-cyan-800",
  conversation: "from-green-100 to-lime-100 border-green-300 text-green-800",
  information: "from-gray-100 to-slate-100 border-gray-300 text-gray-800"
};

export default function PhrasesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPhrases = selectedCategory === "all"
    ? phrasesData
    : phrasesData.filter(phrase => phrase.category === selectedCategory);

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Function to identify kanji and add furigana (hiragana readings) above them
  const renderJapaneseWithFurigana = (japanese: string, hiragana: string) => {
    const kanjiRegex = /[\u4e00-\u9faf]+/g;
    const kanjiMatches = japanese.match(kanjiRegex);

    if (!kanjiMatches) {
      // No kanji found, return the text as is
      return <span>{japanese}</span>;
    }

    // Split the text by kanji to get all parts
    const parts = japanese.split(kanjiRegex);
    const result = [];
    let kanjiIndex = 0;

    for (let i = 0; i < parts.length; i++) {
      // Add non-kanji part
      if (parts[i]) {
        result.push(<span key={`text-${i}`}>{parts[i]}</span>);
      }

      // Add kanji with furigana if there's a kanji match for this position
      if (kanjiIndex < kanjiMatches.length) {
        const kanjiText = kanjiMatches[kanjiIndex];

        // Try to find the reading for this specific kanji in the hiragana
        // This is a simplified approach - for complex cases, you'd need a kanji-to-reading mapping
        let reading = "";

        // For common kanji patterns, try to extract readings
        if (kanjiText === "日本") reading = "にほん";
        else if (kanjiText === "語") reading = "ご";
        else if (kanjiText === "英") reading = "えい";
        else if (kanjiText === "勉強") reading = "べんきょう";
        else if (kanjiText === "大丈夫") reading = "だいじょうぶ";
        else if (kanjiText === "問題") reading = "もんだい";
        else if (kanjiText === "会計") reading = "かいけい";
        else if (kanjiText === "写真") reading = "しゃしん";
        else if (kanjiText === "電話") reading = "でんわ";
        else if (kanjiText === "番号") reading = "ばんごう";
        else if (kanjiText === "住所") reading = "じゅうしょ";
        else if (kanjiText === "年齢") reading = "ねんれい";
        else if (kanjiText === "誕生日") reading = "たんじょうび";
        else if (kanjiText === "趣味") reading = "しゅみ";
        else if (kanjiText === "食") reading = "た";
        else if (kanjiText === "週末") reading = "しゅうまつ";
        else if (kanjiText === "今度") reading = "こんど";
        else if (kanjiText === "一緒") reading = "いっしょ";
        else if (kanjiText === "会") reading = "あ";
        else if (kanjiText === "元気") reading = "げんき";
        else if (kanjiText === "名前") reading = "なまえ";
        else if (kanjiText === "来") reading = "き";
        else if (kanjiText === "時") reading = "じ";
        else if (kanjiText === "今") reading = "いま";
        else if (kanjiText === "何") reading = "なん";
        else if (kanjiText === "駅") reading = "えき";
        else if (kanjiText === "手") reading = "て";
        else if (kanjiText === "伝") reading = "つだ";
        else if (kanjiText === "一度") reading = "いちど";
        else if (kanjiText === "話") reading = "はな";
        else if (kanjiText === "撮") reading = "と";
        else if (kanjiText === "忙") reading = "いそが";
        else if (kanjiText === "疲") reading = "つか";
        else if (kanjiText === "腹") reading = "なか";
        else if (kanjiText === "空") reading = "す";
        else if (kanjiText === "渇") reading = "かわ";
        else if (kanjiText === "眠") reading = "ねむ";
        else if (kanjiText === "寒") reading = "さむ";
        else if (kanjiText === "暑") reading = "あつ";
        else if (kanjiText === "今日") reading = "きょう";
        else if (kanjiText === "天気") reading = "てんき";
        else if (kanjiText === "雨") reading = "あめ";
        else if (kanjiText === "降") reading = "ふ";
        else if (kanjiText === "少") reading = "すこ";
        else if (kanjiText === "全然") reading = "ぜんぜん";
        else if (kanjiText === "何") reading = "なに";
        else if (kanjiText === "本当") reading = "ほんとう";
        else if (kanjiText === "信") reading = "しん";
        else if (kanjiText === "面白") reading = "おもしろ";
        else if (kanjiText === "楽") reading = "たの";
        else if (kanjiText === "嬉") reading = "うれ";
        else if (kanjiText === "悲") reading = "かな";
        else if (kanjiText === "心配") reading = "しんぱい";
        else if (kanjiText === "安心") reading = "あんしん";
        else if (kanjiText === "困") reading = "こま";
        else if (kanjiText === "世話") reading = "せわ";
        else if (kanjiText === "気") reading = "き";
        else if (kanjiText === "体") reading = "からだ";
        else if (kanjiText === "大切") reading = "たいせつ";
        else if (kanjiText === "風邪") reading = "かぜ";
        else if (kanjiText === "引") reading = "ひ";
        else if (kanjiText === "病院") reading = "びょういん";
        else if (kanjiText === "行") reading = "い";
        else if (kanjiText === "薬") reading = "くすり";
        else if (kanjiText === "飲") reading = "の";

        result.push(
          <ruby key={`kanji-${kanjiIndex}`}>
            {kanjiText}
            {reading && <rt>{reading}</rt>}
          </ruby>
        );

        kanjiIndex++;
      }
    }

    return <span>{result}</span>;
  };

  const getCategoryEmoji = (category: string) => {
    const emojis = {
      all: "🌸",
      greetings: "👋",
      farewells: "👋",
      gratitude: "🙏",
      apology: "🙇",
      introduction: "🤝",
      workplace: "💼",
      dining: "🍽️",
      home: "🏠",
      responses: "💬",
      understanding: "🤔",
      health: "🏥",
      time: "⏰",
      shopping: "🛒",
      directions: "🗺️",
      requests: "🙏",
      feelings: "❤️",
      weather: "🌤️",
      conversation: "💭",
      information: "ℹ️"
    };
    return emojis[category as keyof typeof emojis] || "🌸";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 relative">
      <style dangerouslySetInnerHTML={{ __html: rubyStyles }} />
      <Header />
      <JapaneseBackground />
      <div className="max-w-6xl mx-auto relative z-10 p-4 sm:p-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-lg hover:from-rose-100 hover:to-pink-100 transition-all shadow-md border border-rose-200 mr-4"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Kanji
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-rose-800 drop-shadow-sm">
              Daily Japanese Phrases
            </h1>
          </div>
          <p className="text-rose-600 mb-6">
            {getCategoryEmoji(selectedCategory)} {filteredPhrases.length} phrases
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </p>
        </header>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {categories.map((category) => {
              const colors = categoryColors[category as keyof typeof categoryColors];
              const isSelected = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                    isSelected
                      ? `bg-gradient-to-r ${colors} shadow-md scale-105`
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {getCategoryEmoji(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Phrases Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhrases.map((phrase) => {
            const colors = categoryColors[phrase.category as keyof typeof categoryColors];

            return (
              <div
                key={phrase.id}
                className={`bg-gradient-to-br ${colors} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2`}
              >
                {/* Category and Formality */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold px-2 py-1 bg-white/50 rounded-full">
                    {phrase.category}
                  </span>
                  <span className="text-xs font-medium opacity-75">
                    {phrase.formality}
                  </span>
                </div>

                {/* Japanese with Kanji and Furigana */}
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold mb-2 leading-relaxed">
                    {renderJapaneseWithFurigana(phrase.japanese, phrase.hiragana)}
                  </div>
                  <button
                    onClick={() => playAudio(phrase.japanese)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-white/30 rounded-lg hover:bg-white/50 transition-colors text-xs font-medium"
                  >
                    <SpeakerWaveIcon className="w-4 h-4" />
                    Listen
                  </button>
                </div>

                {/* Romaji */}
                <div className="text-center mb-3">
                  <div className="text-sm font-medium opacity-80 italic">
                    {phrase.romaji}
                  </div>
                </div>

                {/* English Translation */}
                <div className="text-center">
                  <div className="text-base font-semibold">
                    {phrase.english}
                  </div>
                </div>
              </div>
            );
          })}
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p className="font-medium">🌸 Practice these phrases daily to improve your Japanese conversation skills 🌸</p>
        </footer>
      </div>
    </div>
  );
}