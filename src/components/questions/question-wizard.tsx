'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Service, UserAnswers } from '@/types';
import { QuestionCard } from './question-card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ArrowRightIcon, ChevronLeftIcon } from '@/components/ui/icons';
import { saveUserAnswers } from '@/lib/storage/answerStorage';
import { useSessionStorage } from '@/lib/storage/useStorage';

export interface QuestionWizardProps {
  service: Service;
}

export const QuestionWizard: React.FC<QuestionWizardProps> = ({ service }) => {
  const router = useRouter();
  const questions = service.questions || [];
  const totalSteps = questions.length;

  const [currentStep, setCurrentStep] = useState(0);
  const defaultAnswers = React.useMemo(() => {
    const initial: UserAnswers = {};
    (service.questions || []).forEach((q) => {
      if (q.defaultValue) {
        initial[q.id] = q.defaultValue;
      }
    });
    return initial;
  }, [service.questions]);

  const [answers, setAnswers] = useSessionStorage<UserAnswers>(
    `ceklayanan_answers_${service.id}`,
    defaultAnswers
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const activeQuestion = questions[currentStep];
  const currentAnswer = answers[activeQuestion.id];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const handleSelectOption = (value: string) => {
    setAnswers((prev) => {
      const updated = { ...prev, [activeQuestion.id]: value };
      saveUserAnswers(service.id, updated);
      return updated;
    });
  };

  const handleNext = () => {
    if (!currentAnswer) return;

    if (isLastStep) {
      setIsSubmitting(true);
      saveUserAnswers(service.id, answers);
      router.push(`/layanan/${service.slug}/hasil`);
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
            Langkah {currentStep + 1} dari {totalSteps}
          </span>
        </div>

        <ProgressBar
          current={currentStep + 1}
          total={totalSteps}
          showCount={false}
          className="mb-2"
        />
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
