import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Bot, Sparkles, Star } from 'lucide-react';

const publicGenerations = [
  {
    id: 1,
    type: 'email',
    title: 'Senior Software Engineer Application',
    company: 'Tech Giant Inc.',
    flow: ['gemini_api', 'humanizer'],
    rating: 5,
    feedback: "The email was perfectly tailored to the job requirements. Got an interview within 2 days!",
    user: {
      name: "Alex Thompson",
      role: "Software Engineer"
    }
  },
  {
    id: 2,
    type: 'cv',
    title: 'Product Manager Resume',
    company: 'StartupCo',
    flow: ['grok_api'],
    rating: 5,
    feedback: "The AI understood exactly what to highlight in my experience. Very impressed!",
    user: {
      name: "Sarah Chen",
      role: "Product Manager"
    }
  },
  {
    id: 3,
    type: 'email',
    title: 'Marketing Director Application',
    company: 'Global Brand',
    flow: ['gemini_api', 'grok_api', 'humanizer'],
    rating: 5,
    feedback: "Used both AIs for the perfect blend of professionalism and personality. Got the job!",
    user: {
      name: "Michael Brown",
      role: "Marketing Director"
    }
  }
];

const flowIcons = {
  gemini_api: { icon: Brain, label: 'Gemini', color: 'text-blue-400' },
  grok_api: { icon: Bot, label: 'Grok', color: 'text-purple-400' },
  humanizer: { icon: Sparkles, label: 'Humanizer', color: 'text-amber-400' },
};

export function PublicGenerations() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">
        Recent Public Generations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicGenerations.map((gen, index) => (
          <motion.div
            key={gen.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-container rounded-xl p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400">
                  {gen.type.toUpperCase()}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {gen.title}
                </h3>
                <p className="text-sm text-gray-400">{gen.company}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {gen.flow.map(flow => {
                const FlowIcon = flowIcons[flow as keyof typeof flowIcons].icon;
                const color = flowIcons[flow as keyof typeof flowIcons].color;
                return (
                  <div
                    key={flow}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 ${color}`}
                  >
                    <FlowIcon size={14} />
                    <span className="text-xs">
                      {flowIcons[flow as keyof typeof flowIcons].label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-1">
              {Array.from({ length: gen.rating }).map((_, i) => (
                <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>

            <blockquote className="text-sm text-gray-300 italic">
              "{gen.feedback}"
            </blockquote>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                  {gen.user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{gen.user.name}</p>
                  <p className="text-xs text-gray-400">{gen.user.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}