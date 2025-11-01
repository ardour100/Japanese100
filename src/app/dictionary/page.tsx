"use client";

import { useState, useEffect } from "react";
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
  const [currentWord, setCurrentWord] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [phonetic, setPhonetic] = useState("");

  // Check if current word is already saved whenever currentWord changes
  useEffect(() => {
    if (!currentWord) {
      setIsSaved(false);
      return;
    }

    const stored = localStorage.getItem("dictionarySavedWords");
    if (stored) {
      try {
        const existingWords: SavedWord[] = JSON.parse(stored);
        const wordExists = existingWords.some(
          (w) => w.word.toLowerCase() === currentWord.toLowerCase()
        );
        setIsSaved(wordExists);
      } catch (e) {
        console.error("Failed to parse saved words:", e);
        setIsSaved(false);
      }
    } else {
      setIsSaved(false);
    }
  }, [currentWord]);

  const searchDictionary = async () => {
    if (!searchWord.trim()) {
      setError("Please enter a word to search");
      return;
    }

    setLoading(true);
    setError("");
    setEnglishDefinition("");
    setAudioUrl("");
    setPhonetic("");

    try {
      // Fetch English definition from Free Dictionary API
      const englishResponse = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord.trim()}`
      );

      if (!englishResponse.ok) {
        throw new Error("Word not found in English dictionary");
      }

      const englishData = await englishResponse.json();

      // Extract phonetic transcription and audio
      let phoneticText = "";
      let audio = "";
      if (englishData && englishData[0]) {
        // Try to get phonetic and audio from phonetics array
        if (englishData[0].phonetics && englishData[0].phonetics.length > 0) {
          // Find the first phonetic with both text and audio
          const phoneticWithAudio = englishData[0].phonetics.find(
            (p: { text?: string; audio?: string }) => p.text && p.audio
          );
          if (phoneticWithAudio) {
            phoneticText = phoneticWithAudio.text || "";
            audio = phoneticWithAudio.audio || "";
          } else {
            // If no phonetic has both, try to find one with text
            const phoneticObj = englishData[0].phonetics.find((p: { text?: string }) => p.text);
            if (phoneticObj && phoneticObj.text) {
              phoneticText = phoneticObj.text;
            }
            // And try to find one with audio
            const audioObj = englishData[0].phonetics.find((p: { audio?: string }) => p.audio);
            if (audioObj && audioObj.audio) {
              audio = audioObj.audio;
            }
          }
        }
        // Fallback to phonetic field if exists
        if (!phoneticText && englishData[0].phonetic) {
          phoneticText = englishData[0].phonetic;
        }
      }

      setPhonetic(phoneticText);
      setAudioUrl(audio);

      // Translate word to Chinese first
      const wordTranslateResponse = await fetch(
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=" +
          encodeURIComponent(searchWord.trim())
      );
      const wordTranslateData = await wordTranslateResponse.json();
      const chineseWord = wordTranslateData[0][0][0] || searchWord;

      // Build combined definition with English and Chinese line by line
      // Include phonetic transcription if available
      let combinedDef = phoneticText
        ? `${searchWord} ${phoneticText} - ${chineseWord}\n\n`
        : `${searchWord} - ${chineseWord}\n\n`;

      if (englishData && englishData[0] && englishData[0].meanings) {
        const meanings = englishData[0].meanings;

        for (const meaning of meanings) {
          const partOfSpeech = meaning.partOfSpeech || "";
          if (partOfSpeech) {
            combinedDef += `[${partOfSpeech}]\n`;
          }

          // Get first 3 definitions
          const definitions = meaning.definitions.slice(0, 3);

          for (let i = 0; i < definitions.length; i++) {
            const def = definitions[i];
            const englishDef = def.definition;

            // Translate each definition to Chinese
            try {
              const translateResponse = await fetch(
                "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=" +
                  encodeURIComponent(englishDef)
              );
              const translateData = await translateResponse.json();
              const chineseDef = translateData[0][0][0] || englishDef;

              // Add both English and Chinese on consecutive lines
              combinedDef += `\n${i + 1}. ${englishDef}\n`;
              combinedDef += `   ${chineseDef}\n`;
            } catch {
              // If translation fails, just show English
              combinedDef += `\n${i + 1}. ${englishDef}\n`;
            }
          }

          combinedDef += "\n";
        }
      }

      setEnglishDefinition(combinedDef || "未找到释义");
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
    if (!currentWord || !englishDefinition) {
      return;
    }

    const newWord: SavedWord = {
      word: currentWord,
      englishDefinition,
      chineseDefinition: "", // Not used anymore, kept for compatibility
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
      setIsSaved(true);
      return;
    }

    // Add new word and save
    const updatedWords = [newWord, ...existingWords];
    localStorage.setItem("dictionarySavedWords", JSON.stringify(updatedWords));
    setIsSaved(true);
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
        {englishDefinition && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-blue-100">
              {/* Word header with phonetic and audio */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-blue-800">
                    {currentWord}
                  </h2>
                  {phonetic && (
                    <span className="text-lg text-slate-600">{phonetic}</span>
                  )}
                  {audioUrl && (
                    <button
                      onClick={() => {
                        const audio = new Audio(audioUrl);
                        audio.play();
                      }}
                      className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                      title="播放发音"
                    >
                      <span className="text-xl">🔊</span>
                    </button>
                  )}
                </div>
                <button
                  onClick={saveToVocabularyBook}
                  disabled={isSaved}
                  className={`px-4 py-2 font-medium rounded-lg transition-all shadow-md flex items-center gap-2 ${
                    isSaved
                      ? "bg-slate-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg"
                  }`}
                >
                  <span>{isSaved ? "✓" : "💾"}</span>
                  <span>{isSaved ? "已保存到单词本" : "保存到单词本"}</span>
                </button>
              </div>

              {/* Combined English & Chinese Definition */}
              <div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                    {englishDefinition}
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
