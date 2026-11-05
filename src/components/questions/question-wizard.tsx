'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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

  const activeQuestions = React.useMemo(
    () => getActiveQuestions(service, safeAnswers),
    [service, safeAnswers]
  );

  const totalSteps = activeQuestions.length;
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeCurrentStep = Math.min(currentStep, Math.max(totalSteps - 1, 0));

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
      {/* Clean Header & Step Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
              Pertanyaan {safeCurrentStep + 1} dari {totalSteps}
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-600 truncate">
              {service.name}
            </span>
          </div>

          <Link
            href={`/layanan/${service.slug}/hasil`}
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors shrink-0"
          >
            Lewati ke Checklist &rarr;
          </Link>
        </div>

        <ProgressBar
          current={safeCurrentStep + 1}
          total={totalSteps}
          showCount={false}
        />
      </div>

      {/* Active Question Card */}
      <QuestionCard
        question={activeQuestion}
        selectedOptionValue={currentAnswer}
        onSelectOption={handleSelectOption}
      />

      {/* Navigation Buttons */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleBack}
          leftIcon={<ChevronLeftIcon className="w-5 h-5" />}
        >
          {isFirstStep ? 'Kembali' : 'Sebelumnya'}
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={!currentAnswer || isSubmitting}
          isLoading={isSubmitting}
          rightIcon={!isSubmitting && <ArrowRightIcon className="w-5 h-5" />}
        >
          {isLastStep ? 'Lihat Checklist Persyaratan' : 'Lanjut'}
        </Button>
      </div>
    </div>
  );
};
