import React, { useState } from 'react';
import StepIndicator from './components/StepIndicator';
import UploadSection from './components/UploadSection';
import TranscriptionEditor from './components/TranscriptionEditor';
import MarkdownViewer from './components/MarkdownViewer';
import PPTPreview from './components/PPTPreview';
import { AppStep, SlideData } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { transcribeAudio, formatToMarkdown, generatePPTStructure } from './services/geminiService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.UPLOAD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [slides, setSlides] = useState<SlideData[]>([]);

  // Step 1: Handle File Upload & Transcription
  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    try {
      const base64Audio = await fileToBase64(file);
      const text = await transcribeAudio(base64Audio, file.type);
      setTranscribedText(text);
      setCurrentStep(AppStep.TRANSCRIPTION);
    } catch (error) {
      alert("處理失敗: " + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2: Handle Text Editing & Formatting
  const handleTranscriptionConfirm = async () => {
    setIsProcessing(true);
    try {
      const markdown = await formatToMarkdown(transcribedText);
      setMarkdownContent(markdown);
      setCurrentStep(AppStep.FORMATTING);
    } catch (error) {
      alert("格式化失敗: " + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 3: Handle PPT Generation
  const handleMarkdownConfirm = async () => {
    setIsProcessing(true);
    try {
      const slidesData = await generatePPTStructure(markdownContent);
      // Ensure we have exactly 4 slides or handle whatever comes back
      // Prompt asked for 4, but let's be safe
      if (slidesData.length === 0) {
        throw new Error("No slides generated");
      }
      setSlides(slidesData);
      setCurrentStep(AppStep.PPT_GENERATION);
    } catch (error) {
      alert("PPT 生成失敗: " + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("確定要重新開始嗎？所有進度將會遺失。")) {
      setTranscribedText('');
      setMarkdownContent('');
      setSlides([]);
      setCurrentStep(AppStep.UPLOAD);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl">AI</div>
            <h1 className="text-xl font-bold text-gray-800">Audio to Professional PPT</h1>
          </div>
          {process.env.API_KEY ? (
             <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">API Key Ready</span>
          ) : (
             <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">API Key Missing</span>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12">
        <StepIndicator currentStep={currentStep} />

        <div className="mt-8 transition-all duration-500 ease-in-out">
          {currentStep === AppStep.UPLOAD && (
            <UploadSection 
              onFileSelect={handleFileSelect} 
              isProcessing={isProcessing} 
            />
          )}

          {currentStep === AppStep.TRANSCRIPTION && (
            <TranscriptionEditor
              text={transcribedText}
              setText={setTranscribedText}
              onNext={handleTranscriptionConfirm}
              onRetry={() => setCurrentStep(AppStep.UPLOAD)}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === AppStep.FORMATTING && (
            <MarkdownViewer
              markdown={markdownContent}
              setMarkdown={setMarkdownContent}
              onNext={handleMarkdownConfirm}
              onBack={() => setCurrentStep(AppStep.TRANSCRIPTION)}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === AppStep.PPT_GENERATION && (
            <PPTPreview
              slides={slides}
              onReset={handleReset}
            />
          )}
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-400 bg-white border-t border-gray-100">
        <p>Powered by Gemini 2.5 Flash & Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default App;
