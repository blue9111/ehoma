import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface MarkdownViewerProps {
  markdown: string;
  setMarkdown: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
  isProcessing: boolean;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  markdown,
  setMarkdown,
  onNext,
  onBack,
  isProcessing
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">結構化內容預覽</h2>
        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回編輯
          </button>
          <button
            onClick={onNext}
            disabled={isProcessing}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? '生成中...' : '下一步：生成 PPT'}
            {!isProcessing && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
          <span className="text-xs font-mono text-slate-400">Markdown Preview</span>
        </div>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-[60vh] p-6 text-base font-mono text-slate-300 bg-slate-900 border-none focus:ring-0 resize-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default MarkdownViewer;
