import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Bot, Sparkles } from 'lucide-react';

interface JobCardProps {
  job: {
    _id: string;
    type: string;
    status: 'completed' | 'failed' | 'pending';
    created_at: string;
    completed_at?: string;
    flow: string;
    base_prompt?: string;
  };
  onViewResult?: () => void;
}

const flowIcons = {
  gemini_api: { icon: Brain, label: 'Gemini', color: 'text-blue-400' },
  grok_api: { icon: Bot, label: 'Grok', color: 'text-purple-400' },
  humanizer: { icon: Sparkles, label: 'Humanizer', color: 'text-amber-400' },
};

const statusConfig = {
  completed: { className: 'bg-green-500/20 text-green-400', label: 'Completed' },
  failed: { className: 'bg-red-500/20 text-red-400', label: 'Failed' },
  pending: { className: 'bg-yellow-500/20 text-yellow-400', label: 'Pending' },
};

export function JobCard({ job, onViewResult }: JobCardProps) {
  const flowArray = JSON.parse(job.flow.replace(/'/g, '"'));
  const status = statusConfig[job.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-border p-[1px] rounded-xl overflow-hidden"
    >
      <div className="glass-container p-6 rounded-xl">
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-white">
                {job.type.toUpperCase()}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
                {status.label}
              </span>
            </div>
            {job.status === 'completed' && onViewResult && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onViewResult}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
              >
                View Result
              </motion.button>
            )}
          </div>

          {/* Flow Icons */}
          <div className="flex items-center gap-4">
            {flowArray.map((flow: string) => {
              const flowConfig = flowIcons[flow as keyof typeof flowIcons];
              if (!flowConfig) return null;
              
              const FlowIcon = flowConfig.icon;
              return (
                <div
                  key={flow}
                  className={`flex items-center gap-2 ${flowConfig.color}`}
                >
                  <FlowIcon size={16} />
                  <span className="text-sm">{flowConfig.label}</span>
                </div>
              );
            })}
          </div>

          {/* Timestamps */}
          <div className="text-sm text-gray-400 space-y-1">
            <p>Created: {new Date(job.created_at).toLocaleString()}</p>
            {job.completed_at && (
              <p>Completed: {new Date(job.completed_at).toLocaleString()}</p>
            )}
          </div>

          {/* Job Description Preview */}
          {job.base_prompt && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Job Description Preview
              </h4>
              <p className="text-sm text-gray-400 line-clamp-3">
                {job.base_prompt}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}