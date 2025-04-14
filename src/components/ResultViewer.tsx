import React from 'react';
import { X, Copy, Download } from 'lucide-react';
import { cn } from '../lib/utils';

interface ResultViewerProps {
  content: string;
  type: 'email' | 'cv';
  onClose: () => void;
}

export function ResultViewer({ content, type, onClose }: ResultViewerProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-${type}-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-container rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            Generated {type.toUpperCase()}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Copy size={20} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-auto flex-1">
          <pre className={cn(
            "whitespace-pre-wrap font-mono text-sm",
            "glass-container rounded-lg p-4 text-gray-300"
          )}>
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
}