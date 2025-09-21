"use client";

import { PROGRESS_LEVELS, getProgressLevel } from '@/types/progress';

interface ProgressLadderProps {
  currentProgress: number;
  onProgressChange: (level: number) => void;
}

export default function ProgressLadder({ currentProgress, onProgressChange }: ProgressLadderProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 shadow-sm">
      <h3 className="text-xl font-semibold text-purple-700 mb-4 text-center">
        🎯 Learning Progress
      </h3>

      <div className="space-y-3">
        {PROGRESS_LEVELS.map((level) => {
          const isSelected = currentProgress === level.level;
          const isLocked = level.level === 0;

          return (
            <button
              key={level.level}
              onClick={() => onProgressChange(level.level)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left group ${
                isSelected
                  ? `${level.color} ${level.borderColor} shadow-md scale-105`
                  : `bg-white hover:${level.color} border-gray-200 hover:${level.borderColor} hover:shadow-sm`
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isSelected ? 'bg-white shadow-sm' : level.color
                  } ${level.textColor}`}>
                    {isLocked ? '🔒' : `${level.level}%`}
                  </div>

                  <div>
                    <div className={`font-semibold ${isSelected ? level.textColor : 'text-gray-700'}`}>
                      {level.label}
                    </div>
                    <div className={`text-sm ${isSelected ? level.textColor : 'text-gray-500'}`}>
                      {level.description}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="text-2xl">✨</div>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isSelected ? 'bg-gradient-to-r from-purple-400 to-indigo-500' : level.color.replace('bg-', 'bg-gradient-to-r from-').replace('-100', '-400 to-' + level.color.split('-')[1] + '-500')
                  }`}
                  style={{ width: `${level.level}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <span className="text-purple-600 font-medium">Current Level:</span>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getProgressLevel(currentProgress).color} ${getProgressLevel(currentProgress).textColor}`}>
              {getProgressLevel(currentProgress).label}
            </span>
            <span className="text-purple-600 font-bold">{currentProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}