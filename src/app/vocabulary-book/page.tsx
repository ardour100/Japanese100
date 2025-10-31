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

export default function VocabularyBookPage() {
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [searchFilter, setSearchFilter] = useState("");

  // Load saved words from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("dictionarySavedWords");
    if (stored) {
      try {
        const words = JSON.parse(stored);
        setSavedWords(words);
      } catch (e) {
        console.error("Failed to load saved words:", e);
      }
    }
  }, []);

  const deleteWord = (timestamp: number) => {
    const updated = savedWords.filter((word) => word.timestamp !== timestamp);
    setSavedWords(updated);
    localStorage.setItem("dictionarySavedWords", JSON.stringify(updated));
  };

  const clearAll = () => {
    if (confirm("确定要清空所有单词吗？")) {
      setSavedWords([]);
      localStorage.removeItem("dictionarySavedWords");
    }
  };

  // Filter words based on search
  const filteredWords = savedWords.filter((word) =>
    word.word.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 relative">
      <Header />
      <JapaneseBackground />
      <div className="max-w-6xl mx-auto relative z-10 p-4 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 mb-2 drop-shadow-sm">
            我的单词本
          </h1>
          <p className="text-purple-600 mb-4">
            查看和管理您保存的单词 · {savedWords.length} 个单词
          </p>
        </header>

        {/* Search and Actions */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-lg p-4 shadow-lg border border-purple-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="搜索单词..."
                className="flex-1 px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
              />
              <div className="flex gap-2">
                <Link
                  href="/dictionary"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  + 添加单词
                </Link>
                {savedWords.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
                  >
                    清空
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Words List */}
        <div className="max-w-4xl mx-auto">
          {filteredWords.length === 0 ? (
            <div className="bg-white rounded-lg p-12 shadow-md border border-slate-200 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                {searchFilter
                  ? "没有找到匹配的单词"
                  : savedWords.length === 0
                  ? "单词本是空的"
                  : "没有匹配的单词"}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchFilter
                  ? "试试其他搜索词"
                  : "在英译中词典中搜索单词并保存到这里"}
              </p>
              {!searchFilter && savedWords.length === 0 && (
                <Link
                  href="/dictionary"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
                >
                  <span className="mr-2">🔍</span>
                  <span>去查单词</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWords.map((word) => (
                <div
                  key={word.timestamp}
                  className="bg-white rounded-lg p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-purple-800 mb-1">
                        {word.word}
                      </h3>
                      <p className="text-xs text-slate-400">
                        保存于: {new Date(word.timestamp).toLocaleString("zh-CN")}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteWord(word.timestamp)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      删除
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* English Definition */}
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2 flex items-center">
                        <span className="text-blue-600 mr-2">🇬🇧</span>
                        English
                      </h4>
                      <div className="bg-slate-50 rounded p-3 max-h-48 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600">
                          {word.englishDefinition}
                        </pre>
                      </div>
                    </div>

                    {/* Chinese Definition */}
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2 flex items-center">
                        <span className="text-red-600 mr-2">🇨🇳</span>
                        中文
                      </h4>
                      <div className="bg-slate-50 rounded p-3 max-h-48 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600">
                          {word.chineseDefinition}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
            <span>返回主页</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
