import React from 'react';
import { Question } from '@/types';
import { Card } from '@/components/ui/card';

export interface QuestionCardProps {
  question: Question;
  selectedOptionValue?: string;
  onSelectOption: (value: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionValue,
  onSelectOption,
}) => {
  return (
    <Card className="p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm bg-white">
      {/* Question Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
        {question.title}
      </h2>

      {/* Optional Description */}
      {question.description && (
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          {question.description}
        </p>
      )}

      {/* Options List */}
      <div className="mt-6 space-y-3" role="radiogroup" aria-label={question.title}>
        {question.options.map((option) => {
          const isSelected = selectedOptionValue === option.value;

          return (
            <div
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelectOption(option.value)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onSelectOption(option.value);
                }
              }}
              className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all flex items-start gap-3.5 cursor-pointer min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 select-none ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 text-slate-900 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              {/* Radio Indicator (Outer & Inner Circle) */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected
                    ? 'border-blue-600 bg-white'
                    : 'border-slate-300 bg-white'
                }`}
                aria-hidden="true"
              >
                {isSelected && (
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                )}
              </div>

              {/* Option Label & Optional Description */}
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-base block leading-snug">
                  {option.label}
                </span>
                {option.description && (
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional Help Text Footer */}
      {question.helpText && (
        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
          <strong>Bantuan:</strong> {question.helpText}
        </div>
      )}
    </Card>
  );
};
