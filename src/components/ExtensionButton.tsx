import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Brain, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface ExtensionButtonProps {
  name: string;
  selected: boolean;
  onClick: () => void;
}

const extensionConfig = {
  gemini_api: {
    icon: Brain,
    label: 'Gemini',
    color: 'bg-blue-500',
  },
  grok_api: {
    icon: Bot,
    label: 'Grok',
    color: 'bg-purple-500',
  },
  humanizer: {
    icon: Sparkles,
    label: 'Humanizer',
    color: 'bg-amber-500',
  },
};

export function ExtensionButton({ name, selected, onClick }: ExtensionButtonProps) {
  const config = extensionConfig[name as keyof typeof extensionConfig];
  const Icon = config.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
        'border-2',
        selected ? [
          config.color,
          'border-transparent text-white',
          'shadow-lg shadow-current/25',
        ] : [
          'bg-white dark:bg-gray-800',
          'border-gray-200 dark:border-gray-700',
          'text-gray-700 dark:text-gray-300',
          'hover:border-current',
        ]
      )}
    >
      <Icon size={20} className={selected ? 'text-white' : 'text-current'} />
      <span className="font-medium">{config.label}</span>
      
      {selected && (
        <motion.div
          layoutId="extension-active"
          className="absolute inset-0 -z-10 rounded-lg"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
}