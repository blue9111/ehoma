import React from 'react';
import { AppStep } from '../types';
import { Upload, FileText, List, Presentation } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: AppStep.UPLOAD, label: '上傳錄音', icon: Upload },
    { id: AppStep.TRANSCRIPTION, label: '轉錄編輯', icon: FileText },
    { id: AppStep.FORMATTING, label: '結構化', icon: List },
    { id: AppStep.PPT_GENERATION, label: '生成簡報', icon: Presentation },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
        
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center bg-slate-50 px-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                <Icon size={20} />
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  isCurrent ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
