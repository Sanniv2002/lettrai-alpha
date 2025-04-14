import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Bot, Sparkles, ArrowRight } from 'lucide-react';

interface ExtensionSequenceProps {
  selectedExtensions: string[];
  onExtensionToggle: (extension: string) => void;
}

const REQUIRED_FIRST = ['gemini_api', 'grok_api'];
const OPTIONAL_SECOND = ['humanizer'];

const extensionConfig = {
  gemini_api: {
    icon: Brain,
    label: 'Gemini',
    color: 'bg-blue-500',
    description: 'Generate content using Google\'s Gemini AI',
  },
  grok_api: {
    icon: Bot,
    label: 'Grok',
    color: 'bg-purple-500',
    description: 'Generate content using xAI\'s Grok',
  },
  humanizer: {
    icon: Sparkles,
    label: 'Humanizer',
    color: 'bg-amber-500',
    description: 'Make the generated content more human-like',
  },
};

export function ExtensionSequence({ selectedExtensions, onExtensionToggle }: ExtensionSequenceProps) {
  const hasRequiredExtension = selectedExtensions.some(ext => REQUIRED_FIRST.includes(ext));

  const handleExtensionClick = (ext: string) => {
    if (REQUIRED_FIRST.includes(ext)) {
      if (selectedExtensions.includes(ext)) {
        // Remove the extension
        onExtensionToggle(selectedExtensions.filter(e => e !== ext));
      } else {
        // Replace any other required extension with this one
        const newExtensions = selectedExtensions.filter(e => !REQUIRED_FIRST.includes(e));
        onExtensionToggle([...newExtensions, ext]);
      }
    } else if (OPTIONAL_SECOND.includes(ext) && hasRequiredExtension) {
      // Toggle the humanizer extension
      if (selectedExtensions.includes(ext)) {
        onExtensionToggle(selectedExtensions.filter(e => e !== ext));
      } else {
        onExtensionToggle([...selectedExtensions, ext]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-xs">1</span>
          <span>Select one of these required extensions</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REQUIRED_FIRST.map((ext) => {
            const config = extensionConfig[ext as keyof typeof extensionConfig];
            const Icon = config.icon;
            const isSelected = selectedExtensions.includes(ext);

            return (
              <motion.button
                key={ext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExtensionClick(ext)}
                className={`
                  relative flex items-start gap-3 p-4 rounded-lg transition-all duration-200
                  ${isSelected ? [
                    config.color,
                    'shadow-lg shadow-current/25 text-white',
                  ].join(' ') : [
                    'glass-container',
                    'hover:border-current',
                  ].join(' ')}
                `}
              >
                <Icon size={24} className={isSelected ? 'text-white' : 'text-current'} />
                <div className="text-left">
                  <div className="font-medium">{config.label}</div>
                  <div className="text-sm opacity-80">{config.description}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-white/10" />
        <ArrowRight className="text-gray-400" />
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-xs">2</span>
          <span>Optionally add humanization</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {OPTIONAL_SECOND.map((ext) => {
            const config = extensionConfig[ext as keyof typeof extensionConfig];
            const Icon = config.icon;
            const isSelected = selectedExtensions.includes(ext);
            const isDisabled = !hasRequiredExtension;

            return (
              <motion.button
                key={ext}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                onClick={() => !isDisabled && handleExtensionClick(ext)}
                disabled={isDisabled}
                className={`
                  relative flex items-start gap-3 p-4 rounded-lg transition-all duration-200
                  ${isSelected ? [
                    config.color,
                    'shadow-lg shadow-current/25 text-white',
                  ].join(' ') : [
                    'glass-container',
                    !isDisabled && 'hover:border-current',
                    isDisabled && 'opacity-50 cursor-not-allowed',
                  ].join(' ')}
                `}
              >
                <Icon size={24} className={isSelected ? 'text-white' : 'text-current'} />
                <div className="text-left">
                  <div className="font-medium">{config.label}</div>
                  <div className="text-sm opacity-80">{config.description}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}