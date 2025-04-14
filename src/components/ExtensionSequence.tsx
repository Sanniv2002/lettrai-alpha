import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Bot, Sparkles, ArrowRight, Cpu, Stars } from 'lucide-react';

interface ExtensionSequenceProps {
  selectedModel: string | null;
  includeHumanizer: boolean;
  onUpdateSequence: (model: string | null, humanizer: boolean) => void;
}

const REQUIRED_FIRST = ['gemini_api', 'grok_api', 'openai_api', 'deepseek_api'];
const HUMANIZER = 'humanizer';

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
  openai_api: {
    icon: Stars,
    label: 'OpenAI',
    color: 'bg-green-500',
    description: 'Generate content using OpenAI\'s GPT models',
  },
  deepseek_api: {
    icon: Cpu,
    label: 'DeepSeek',
    color: 'bg-orange-500',
    description: 'Generate content using DeepSeek\'s AI models',
  },
  humanizer: {
    icon: Sparkles,
    label: 'Humanizer',
    color: 'bg-amber-500',
    description: 'Make the generated content more human-like',
  },
};

export function ExtensionSequence({
  selectedModel,
  includeHumanizer,
  onUpdateSequence,
}: ExtensionSequenceProps) {
  const handleModelClick = (model: string) => {
    const newModel = model === selectedModel ? null : model;
    onUpdateSequence(newModel, includeHumanizer);
  };

  const handleHumanizerToggle = () => {
    if (!selectedModel) return;
    onUpdateSequence(selectedModel, !includeHumanizer);
  };

  return (
    <div className="space-y-6">
      {/* Required Model */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-xs">1</span>
          <span>Select one required AI model</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REQUIRED_FIRST.map((ext) => {
            const config = extensionConfig[ext as keyof typeof extensionConfig];
            const Icon = config.icon;
            const isSelected = selectedModel === ext;

            return (
              <motion.button
                key={ext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModelClick(ext)}
                className={`
                  relative flex items-start gap-3 p-4 rounded-lg transition-all duration-200
                  ${isSelected
                    ? `${config.color} shadow-lg shadow-current/25 text-white`
                    : 'glass-container hover:border-current'}
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

      {/* Optional Humanizer */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-xs">2</span>
          <span>Optionally add humanization</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <motion.button
            whileHover={selectedModel ? { scale: 1.02 } : {}}
            whileTap={selectedModel ? { scale: 0.98 } : {}}
            onClick={handleHumanizerToggle}
            disabled={!selectedModel}
            className={`
              relative flex items-start gap-3 p-4 rounded-lg transition-all duration-200
              ${includeHumanizer
                ? `${extensionConfig[HUMANIZER].color} shadow-lg shadow-current/25 text-white`
                : `glass-container ${
                    selectedModel ? 'hover:border-current' : 'opacity-50 cursor-not-allowed'
                  }`}
            `}
          >
            <Sparkles size={24} className={includeHumanizer ? 'text-white' : 'text-current'} />
            <div className="text-left">
              <div className="font-medium">{extensionConfig[HUMANIZER].label}</div>
              <div className="text-sm opacity-80">{extensionConfig[HUMANIZER].description}</div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}