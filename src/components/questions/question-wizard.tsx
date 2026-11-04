'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Service, UserAnswers } from '@/types';
import { getActiveQuestions, sanitizeAnswersForActiveQuestions } from '@/lib/rules/engine';
import { QuestionCard } from './question-card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ArrowRightIcon, ChevronLeftIcon } from '@/components/ui/icons';
import { saveUserAnswers } from '@/lib/storage/answerStorage';
import { useLocalStorage } from '@/lib/storage/useStorage';

export interface QuestionWizardProps {
  service: Service;
}

export const QuestionWizard: React.FC<QuestionWizardProps> = ({ service }) => {
  const router = useRouter();

  const defaultAnswers = React.useMemo(() => {
    const initial: UserAnswers = {};
    (service.questions || []).forEach((q) => {
      if (q.defaultValue) {
        initial[q.id] = q.defaultValue;
      }
    });
    return initial;
  }, [service.questions]);

  const [answers, setAnswers] = useLocalStorage<UserAnswers>(
    `ceklayanan_answers_${service.id}`,
    defaultAnswers
  );

  const safeAnswers = React.useMemo(
    () => (answers && typeof answers === 'object' ? { ...defaultAnswers, ...answers } : defaultAnswers),
    [answers, defaultAnswers]
  );

  // Hitung daftar pertanyaan aktif secara dinamis berdasarkan dependsOn
  const activeQuestions = React.useMemo(
    () => getActiveQuestions(service, safeAnswers),
    [service, safeAnswers]
  );

  const totalSteps = activeQuestions.length;
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pastikan currentStep selalu berada di rentang valid jika activeQuestions berubah
  const safeCurrentStep = Math.min(currentStep, Math.max(totalSteps - 1, 0));

  // If service has no conditional questions, direct to hasil
  if (totalSteps === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Tidak ada pertanyaan kondisi untuk layanan ini
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Persyaratan layanan ini bersifat standar untuk seluruh pemohon.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            saveUserAnswers(service.id, {});
            router.push(`/layanan/${service.slug}/hasil`);
          }}
        >
          Lihat Persyaratan Lengkap
        </Button>
      </div>
    );
  }

  const activeQuestion = activeQuestions[safeCurrentStep];
  const currentAnswer = safeAnswers[activeQuestion.id];
  const isFirstStep = safeCurrentStep === 0;
  const isLastStep = safeCurrentStep === totalSteps - 1;

  const handleSelectOption = (value: string) => {
    setAnswers((prev) => {
      const merged = { ...(prev || defaultAnswers), [activeQuestion.id]: value };
      const sanitized = sanitizeAnswersForActiveQuestions(service, merged);
      saveUserAnswers(service.id, sanitized);
      return sanitized;
    });
  };

  const handleNext = () => {
    if (!currentAnswer) return;

    if (isLastStep) {
      setIsSubmitting(true);
      const finalAnswers = sanitizeAnswersForActiveQuestions(service, safeAnswers);
      saveUserAnswers(service.id, finalAnswers);

      // Buat query string kondisi agar URL hasil bersifat shareable
      const params = new URLSearchParams();
      Object.entries(finalAnswers).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const qs = params.toString();
      router.push(`/layanan/${service.slug}/hasil${qs ? `?${qs}` : ''}`);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (isFirstStep) {
      router.push(`/layanan/${service.slug}`);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header & Step Tracker */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500 mb-2">
          <span>{service.name}</span>
          <span>
            Langkah {safeCurrentStep + 1} dari {totalSteps}
          </span>
        </div>

        <ProgressBar
          current={safeCurrentStep + 1}
          total={totalSteps}
          showCount={false}
          className="mb-3"
        />

        {/* Stepper Pills Indicator */}
        {totalSteps > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {activeQuestions.map((q, idx) => {
              const isCompleted = idx < safeCurrentStep;
              const isCurrent = idx === safeCurrentStep;
              const ansLabel = q.options.find((o) => o.value === safeAnswers[q.id])?.label;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    if (idx <= safeCurrentStep) {
                      setCurrentStep(idx);
                    }
                  }}
                  disabled={idx > safeCurrentStep}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors text-left truncate max-w-[220px] ${
                    isCurrent
                      ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                      : isCompleted
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100 cursor-pointer'
                      : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  title={q.title}
                >
                  {idx + 1}. {isCompleted && ansLabel ? ansLabel : q.title}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Question Card */}
      <QuestionCard
        question={activeQuestion}
        selectedOptionValue={currentAnswer}
        onSelectOption={handleSelectOption}
      />

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleBack}
          leftIcon={<ChevronLeftIcon className="w-5 h-5" />}
        >
          {isFirstStep ? 'Batal' : 'Kembali'}
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleNext}
          disabled={!currentAnswer || isSubmitting}
          isLoading={isSubmitting}
          rightIcon={!isSubmitting && <ArrowRightIcon className="w-5 h-5" />}
        >
          {isLastStep ? 'Lihat Persyaratan Saya' : 'Lanjut'}
        </Button>
      </div>
    </div>
  );
};
