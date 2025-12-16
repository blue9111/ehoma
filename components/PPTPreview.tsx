import React, { useState } from 'react';
import { SlideData } from '../types';
import { Download, CheckCircle, RotateCcw } from 'lucide-react';
import PptxGenJS from 'pptxgenjs';

interface PPTPreviewProps {
  slides: SlideData[];
  onReset: () => void;
}

const PPTPreview: React.FC<PPTPreviewProps> = ({ slides, onReset }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleDownload = () => {
    const pptx = new PptxGenJS();
    
    // Set Layout
    pptx.layout = 'LAYOUT_16x9';

    // Add Slides
    slides.forEach((slideData) => {
      const slide = pptx.addSlide();
      
      // Title
      slide.addText(slideData.title, {
        x: 0.5,
        y: 0.5,
        w: '90%',
        h: 1,
        fontSize: 32,
        bold: true,
        color: '363636',
        align: 'left'
      });

      // Bullets
      slideData.bullets.forEach((bullet, index) => {
         slide.addText(bullet, {
            x: 0.8,
            y: 1.8 + (index * 0.6),
            w: '85%',
            h: 0.5,
            fontSize: 18,
            color: '666666',
            bullet: true
         });
      });

      // Notes
      slide.addNotes(slideData.notes);
    });

    pptx.writeFile({ fileName: 'Analysis_Presentation.pptx' });
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar - Slide Thumbnails */}
      <div className="w-full md:w-1/4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">投影片預覽</h3>
        <div className="space-y-3 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {slides.map((slide, idx) => (
                <div 
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        activeSlide === idx 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400">Slide {idx + 1}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-800 line-clamp-2">{slide.title}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="w-full md:w-3/4">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">簡報生成完成</h2>
            <div className="flex gap-3">
                 <button
                    onClick={onReset}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    重新開始
                </button>
                <button
                    onClick={handleDownload}
                    className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md transition-all hover:scale-105"
                >
                    <Download className="w-4 h-4 mr-2" />
                    下載 PPTX
                </button>
            </div>
        </div>

        {/* Slide Canvas */}
        <div className="aspect-video bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col relative">
            <div className="flex-1 p-12 flex flex-col">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">{slides[activeSlide]?.title}</h1>
                <ul className="space-y-4 flex-1">
                    {slides[activeSlide]?.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start text-xl text-gray-600">
                            <span className="mr-3 text-blue-500 mt-1.5 text-xs">●</span>
                            {bullet}
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Notes Section Overlay */}
            <div className="bg-yellow-50 border-t border-yellow-100 p-4">
                <p className="text-xs font-bold text-yellow-700 mb-1 uppercase tracking-wider">講者備忘錄 (Notes)</p>
                <p className="text-sm text-gray-700 leading-relaxed">{slides[activeSlide]?.notes}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PPTPreview;
