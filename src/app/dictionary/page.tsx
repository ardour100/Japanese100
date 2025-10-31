"use client";

import { useState } from "react";
import Link from "next/link";
import JapaneseBackground from "@/components/JapaneseBackground";
import Header from "@/components/Header";

interface SavedWord {
  word: string;
  englishDefinition: string;
  chineseDefinition: string;
  timestamp: number;
}

export default function DictionaryPage() {
  const [searchWord, setSearchWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [englishDefinition, setEnglishDefinition] = useState("");
  const [chineseDefinition, setChineseDefinition] = useState("");
  const [currentWord, setCurrentWord] = useState("");

  const searchDictionary = async () => {
    if (!searchWord.trim()) {
      setError("Please enter a word to search");
      return;
    }

    setLoading(true);
    setError("");
    setEnglishDefinition("");
    setChineseDefinition("");

    try {
      // Fetch English definition from Free Dictionary API
      const englishResponse = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord.trim()}`
      );

      if (!englishResponse.ok) {
        throw new Error("Word not found in English dictionary");
      }

      const englishData = await englishResponse.json();

      // Extract English definition
      let englishDef = "";
      if (englishData && englishData[0] && englishData[0].meanings) {
        const meanings = englishData[0].meanings;
        englishDef = meanings
          .map((m: any, idx: number) => {
            const partOfSpeech = m.partOfSpeech || "";
            const definitions = m.definitions
              .slice(0, 3) // Take first 3 definitions
              .map((d: any, i: number) => `${i + 1}. ${d.definition}`)
              .join("\n   ");
            return `${partOfSpeech ? `[${partOfSpeech}]` : ""}\n   ${definitions}`;
          })
          .join("\n\n");
      }

      setEnglishDefinition(englishDef || "No definition available");

      // Translate word to Chinese
      const wordTranslateResponse = await fetch(
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=" +
          encodeURIComponent(searchWord.trim())
      );
      const wordTranslateData = await wordTranslateResponse.json();
      const chineseWord = wordTranslateData[0][0][0] || searchWord;

      // Translate the English definitions to Chinese
      const definitionsToTranslate = englishDef.replace(/\[.*?\]/g, ''); // Remove [noun], [verb] etc for translation
      const defTranslateResponse = await fetch(
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=" +
          encodeURIComponent(definitionsToTranslate)
      );
      const defTranslateData = await defTranslateResponse.json();

      // Reconstruct translated definitions
      let chineseDefinitions = "";
      if (defTranslateData && defTranslateData[0]) {
        chineseDefinitions = defTranslateData[0]
          .map((item: any) => item[0])
          .join("");
      }

      // Create a Chinese definition with both word and translated definitions
      const chineseDef = `中文翻译: ${chineseWord}\n\n释义:\n${chineseDefinitions}`;

      setChineseDefinition(chineseDef);
      setCurrentWord(searchWord.trim());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch definitions"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchDictionary();
    }
  };

  const saveToVocabularyBook = () => {
    if (!currentWord || !englishDefinition || !chineseDefinition) {
      return;
    }

    const newWord: SavedWord = {
      word: currentWord,
      englishDefinition,
      chineseDefinition,
      timestamp: Date.now(),
    };

    // Load existing words from localStorage
    const stored = localStorage.getItem("dictionarySavedWords");
    let existingWords: SavedWord[] = [];
    if (stored) {
      try {
        existingWords = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse saved words:", e);
      }
    }

    // Check if word already exists
    const wordExists = existingWords.some(
      (w) => w.word.toLowerCase() === currentWord.toLowerCase()
    );

    if (wordExists) {
      alert(`"${currentWord}" 已经在单词本中了！`);
      return;
    }

    // Add new word and save
    const updatedWords = [newWord, ...existingWords];
    localStorage.setItem("dictionarySavedWords", JSON.stringify(updatedWords));
    alert(`"${currentWord}" 已保存到单词本！`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative">
      <Header />
      <JapaneseBackground />
      <div className="max-w-6xl mx-auto relative z-10 p-4 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-2 drop-shadow-sm">
            英译中词典
          </h1>
          <p className="text-blue-600 mb-4">
            搜索英文单词，获取英文和中文释义
          </p>
        </header>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg border border-blue-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入英文单词..."
                className="flex-1 px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
              <button
                onClick={searchDictionary}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "搜索中..." : "搜索"}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-red-600 text-sm">错误: {error}</p>
            )}
          </div>
        </div>

        {/* Results Section */}
        {(englishDefinition || chineseDefinition) && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-blue-100">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-blue-800">
                  {currentWord}
                </h2>
                <button
                  onClick={saveToVocabularyBook}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>💾</span>
                  <span>保存到单词本</span>
                </button>
              </div>

              {/* English Definition */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">
                  英文释义
                </h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap font-sans text-slate-700">
                    {englishDefinition}
                  </pre>
                </div>
              </div>

              {/* Chinese Definition */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3">
                  中文释义
                </h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap font-sans text-slate-700">
                    {chineseDefinition}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Link to Vocabulary Book */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link
            href="/vocabulary-book"
            className="block w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg text-center"
          >
            <span className="text-xl mr-2">📚</span>
            <span>查看我的单词本</span>
          </Link>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-medium rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all shadow-md hover:shadow-lg"
          >
            <span className="mr-2">←</span>
            <span>返回主页</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
