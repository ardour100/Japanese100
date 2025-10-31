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
  const [savedNotes, setSavedNotes] = useState<SavedWord[]>([]);
  const [showNotes, setShowNotes] = useState(false);

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

      // Fetch Chinese translation from LibreTranslate (free API)
      // Note: This is a simplified approach. For production, consider using a proper Chinese dictionary API
      const translateResponse = await fetch(
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=" +
          encodeURIComponent(searchWord.trim())
      );

      const translateData = await translateResponse.json();
      const chineseTranslation = translateData[0][0][0] || searchWord;

      // Create a Chinese definition
      const chineseDef = `中文翻译: ${chineseTranslation}\n\n释义: ${englishDef
        .split("\n")
        .slice(0, 5)
        .join("\n")}`;

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

  const saveToNotes = () => {
    if (!currentWord || !englishDefinition || !chineseDefinition) {
      return;
    }

    const newNote: SavedWord = {
      word: currentWord,
      englishDefinition,
      chineseDefinition,
      timestamp: Date.now(),
    };

    setSavedNotes([newNote, ...savedNotes]);
    alert(`"${currentWord}" saved to notes!`);
  };

  const deleteNote = (timestamp: number) => {
    setSavedNotes(savedNotes.filter((note) => note.timestamp !== timestamp));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative">
      <Header />
      <JapaneseBackground />
      <div className="max-w-6xl mx-auto relative z-10 p-4 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-2 drop-shadow-sm">
            English - Chinese Dictionary
          </h1>
          <p className="text-blue-600 mb-4">
            Search English words and get both English and Chinese explanations
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
                placeholder="Enter an English word..."
                className="flex-1 px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
              <button
                onClick={searchDictionary}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-red-600 text-sm">Error: {error}</p>
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
                  onClick={saveToNotes}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>💾</span>
                  <span>Save to Notes</span>
                </button>
              </div>

              {/* English Definition */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                  <span className="text-xl mr-2">🇬🇧</span>
                  English Definition
                </h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap font-sans text-slate-700">
                    {englishDefinition}
                  </pre>
                </div>
              </div>

              {/* Chinese Definition */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                  <span className="text-xl mr-2">🇨🇳</span>
                  Chinese Definition (中文释义)
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

        {/* Saved Notes Section */}
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="w-full mb-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>📝</span>
            <span>
              {showNotes ? "Hide" : "Show"} My Notes ({savedNotes.length})
            </span>
          </button>

          {showNotes && (
            <div className="space-y-4">
              {savedNotes.length === 0 ? (
                <div className="bg-white rounded-lg p-6 shadow-md border border-slate-200 text-center text-slate-500">
                  No notes saved yet. Search for words and save them!
                </div>
              ) : (
                savedNotes.map((note) => (
                  <div
                    key={note.timestamp}
                    className="bg-white rounded-lg p-6 shadow-md border border-slate-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-blue-800">
                        {note.word}
                      </h3>
                      <button
                        onClick={() => deleteNote(note.timestamp)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-700 mb-2">
                        🇬🇧 English:
                      </h4>
                      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 bg-slate-50 rounded p-3">
                        {note.englishDefinition}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">
                        🇨🇳 Chinese:
                      </h4>
                      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 bg-slate-50 rounded p-3">
                        {note.chineseDefinition}
                      </pre>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                      Saved: {new Date(note.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-medium rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all shadow-md hover:shadow-lg"
          >
            <span className="mr-2">←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
