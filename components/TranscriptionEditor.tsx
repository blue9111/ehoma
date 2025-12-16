import React from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface TranscriptionEditorProps {
  text: string;
  setText: (text: string) => void;
  onNext: () => void;
  onRetry: () => void;
  isProcessing: boolean;
}

const TranscriptionEditor: React.FC<TranscriptionEditorProps> = ({
  text,
  setText,
  onNext,
  onRetry,
  isProcessing
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">編輯逐字稿</h2>
        <div className="flex space-x-3">
          <button
            onClick={onRetry}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重新上傳
          </button>
          <button
            onClick={onNext}
            disabled={isProcessing || !text.trim()}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? '處理中...' : '下一步：結構化內容'}
            {!isProcessing && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-[60vh] p-6 text-lg leading-relaxed text-gray-800 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-sans"
          placeholder="轉錄內容將顯示於此..."
        />
        <div className="absolute bottom-4 right-4 text-xs text-gray-400">
          {text.length} 字元
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500 text-center">請校對並修正任何轉錄錯誤，確認無誤後點擊下一步。</p>
    </div>
  );
};

export default TranscriptionEditor;
