import React from 'react';
import { X, Copy, Download, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { Tooltip } from './Tooltip';

interface ResultViewerProps {
  content: string;
  type: 'email' | 'cv';
  onClose: () => void;
}

export function ResultViewer({ content, type, onClose }: ResultViewerProps) {
  const [viewMode, setViewMode] = React.useState<'formatted' | 'plain'>('plain');

  const handleCopy = () => {
    const textToCopy = viewMode === 'plain' ? content : content;
    navigator.clipboard.writeText(textToCopy);
  };

  const handleDownload = () => {
    const textToDownload = viewMode === 'plain' ? content : content;
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-${type}-${new Date().toISOString()}.${viewMode === 'plain' ? 'txt' : 'md'}`;
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
            <Tooltip content={viewMode === 'formatted' ? 'View plain text' : 'View formatted text'}>
              <button
                onClick={() => setViewMode(viewMode === 'formatted' ? 'plain' : 'formatted')}
                className={cn(
                  "p-2 transition-colors rounded-lg",
                  viewMode === 'formatted' ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                )}
              >
                <FileText size={20} />
              </button>
            </Tooltip>
            <Tooltip content="Copy to clipboard">
              <button
                onClick={handleCopy}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg"
              >
                <Copy size={20} />
              </button>
            </Tooltip>
            <Tooltip content="Download file">
              <button
                onClick={handleDownload}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg"
              >
                <Download size={20} />
              </button>
            </Tooltip>
            <Tooltip content="Close">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg"
              >
                <X size={20} />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="p-6 overflow-auto flex-1">
          {viewMode === 'formatted' ? (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <pre className={cn(
              "whitespace-pre-wrap font-mono text-sm",
              "glass-container rounded-lg p-4 text-gray-300"
            )}>
              {content}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}