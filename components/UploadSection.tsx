import React, { useRef, useState } from 'react';
import { UploadCloud, FileAudio } from 'lucide-react';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelect, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
      onFileSelect(file);
    } else {
      alert('請上傳有效的音訊或視訊檔案 (mp3, wav, m4a, mp4, etc.)');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">上傳錄音檔開始轉錄</h2>
      
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ease-in-out cursor-pointer group ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-slate-100'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="audio/*,video/*"
          onChange={handleChange}
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform ${isProcessing ? 'animate-pulse' : ''}`}>
            {isProcessing ? (
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <UploadCloud className="w-10 h-10 text-blue-500" />
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-lg font-medium text-gray-700">
              {isProcessing ? '正在分析音訊...' : '點擊或拖放檔案至此'}
            </p>
            <p className="text-sm text-gray-500">支援 MP3, WAV, M4A, MP4 (最大 20MB)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
