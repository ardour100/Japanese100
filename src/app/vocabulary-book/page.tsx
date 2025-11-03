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
  const [expandedWords, setExpandedWords] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const WORDS_PER_PAGE = 20;

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

  const toggleExpand = (timestamp: number) => {
    setExpandedWords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(timestamp)) {
        newSet.delete(timestamp);
      } else {
        newSet.add(timestamp);
      }
      return newSet;
    });
  };

  // Filter words based on search
  const filteredWords = savedWords.filter((word) =>
    word.word.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredWords.length / WORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * WORDS_PER_PAGE;
  const endIndex = startIndex + WORDS_PER_PAGE;
  const currentWords = filteredWords.slice(startIndex, endIndex);

  // Reset to page 1 when search filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter]);

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
            查看和管理您保存的单词 · 共 {savedWords.length} 个单词
            {filteredWords.length !== savedWords.length && ` · 搜索结果: ${filteredWords.length} 个`}
            {totalPages > 1 && ` · 第 ${currentPage}/${totalPages} 页`}
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
            <div className="space-y-2">
              {currentWords.map((word) => {
                const isExpanded = expandedWords.has(word.timestamp);
                return (
                  <div
                    key={word.timestamp}
                    className="bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow"
                  >
                    {/* Collapsed header - always visible */}
                    <div className="flex items-center justify-between p-4">
                      <button
                        onClick={() => toggleExpand(word.timestamp)}
                        className="flex items-center gap-3 flex-1 text-left hover:bg-slate-50 rounded p-2 transition-colors"
                      >
                        <span
                          className={`text-slate-500 transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        >
                          ▶
                        </span>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-purple-800">
                            {word.word}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {new Date(word.timestamp).toLocaleString("zh-CN")}
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => deleteWord(word.timestamp)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors ml-2"
                      >
                        删除
                      </button>
                    </div>

                    {/* Expanded content - only show when expanded */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="bg-slate-50 rounded p-4 max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 leading-relaxed">
                            {word.englishDefinition}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="max-w-4xl mx-auto mt-6">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一页
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1;

                  const showEllipsis =
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2);

                  if (showEllipsis) {
                    return (
                      <span key={page} className="px-2 text-slate-400">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-purple-600 text-white"
                          : "bg-white border border-purple-300 text-purple-700 hover:bg-purple-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一页
              </button>
            </div>
          </div>
        )}

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
