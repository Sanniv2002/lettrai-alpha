import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Calendar } from 'lucide-react';
import { fetchApi } from '../lib/utils';
import { useKnowledgeBaseStore, type KnowledgeBase } from '../store/knowledge-base';
import { ExtensionSequence } from '../components/ExtensionSequence';

type ToneType = 'professional' | 'casual' | 'friendly';
type LengthType = 'short' | 'medium' | 'long';

const toneOptions: { value: ToneType; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
];

const lengthOptions: { value: LengthType; label: string; description: string }[] = [
  { value: 'short', label: 'Short', description: 'Concise and to the point' },
  { value: 'medium', label: 'Medium', description: 'Balanced and descriptive' },
  { value: 'long', label: 'Long', description: 'Detailed and comprehensive' },
];

export function Generate() {
  const [type, setType] = React.useState<'email' | 'cv'>('email');
  const [tone, setTone] = React.useState<ToneType>('professional');
  const [length, setLength] = React.useState<LengthType>('medium');
  const [jobDescription, setJobDescription] = React.useState('');
  const [selectedKbId, setSelectedKbId] = React.useState('');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [includeHumanizer, setIncludeHumanizer] = useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showRedirect, setShowRedirect] = React.useState(false);
  const [isResumeDropdownOpen, setIsResumeDropdownOpen] = useState(false);

  const handleUpdateSequence = (model: string | null, humanizer: boolean) => {
    setSelectedModel(model);
    setIncludeHumanizer(humanizer);
  };

  const navigate = useNavigate();
  const { entries, fetchEntries, isLoading } = useKnowledgeBaseStore();

  React.useEffect(() => {
    fetchEntries().catch(console.error);
  }, [fetchEntries]);

  const selectedResume = entries.find(entry => entry.id === selectedKbId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedKbId) {
      setError('Please select a resume');
      return;
    }
    
    if (!selectedModel) {
      setError('Please select an AI model');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const extensions = [selectedModel];
      if (includeHumanizer) {
        extensions.push('humanizer');
      }

      await fetchApi('/api/generate/', {
        method: 'POST',
        body: {
          type,
          tone,
          length,
          job_data: jobDescription,
          kb_id: selectedKbId,
          extensions,
        },
      });
      setShowRedirect(true);
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    } catch (err) {
      setError('Failed to start generation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {showRedirect ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <div className="glass-container p-8 rounded-2xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center"
            >
              <ArrowRight size={32} className="text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">Generation Started!</h3>
            <p className="text-gray-400">
              Redirecting you to My Jobs to see the progress...
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-5xl mx-auto"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-8">
            {/* Top Section - Type, Tone, Length */}
            <div className="glass-container p-6 rounded-xl space-y-6">
              <h2 className="text-lg font-semibold text-white">Content Settings</h2>
              
              {/* Type Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Type
                </label>
                <div className="flex gap-4">
                  {['email', 'cv'].map(value => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setType(value as 'email' | 'cv')}
                      className={`
                        flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200
                        ${type === value
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50'
                        }
                      `}
                    >
                      {value.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Tone
                </label>
                <div className="flex gap-4">
                  {toneOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTone(option.value)}
                      className={`
                        flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200
                        ${tone === option.value
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Length
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {lengthOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setLength(option.value)}
                      className={`
                        p-4 rounded-lg text-left transition-all duration-200
                        ${length === option.value
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50'
                        }
                      `}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm opacity-80">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Section - Resume and Job Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resume Selection */}
              <div className="glass-container p-6 rounded-xl space-y-4">
                <h2 className="text-lg font-semibold text-white">Resume Selection</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsResumeDropdownOpen(!isResumeDropdownOpen)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-gray-400" size={20} />
                        <span className="text-gray-300">
                          {selectedResume ? selectedResume.name : 'Select a resume...'}
                        </span>
                      </div>
                    </button>

                    {isResumeDropdownOpen && (
                      <div className="absolute z-10 w-full mt-2 bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl">
                        {entries.map((entry: KnowledgeBase) => (
                          <button
                            key={entry.id}
                            type="button"
                            onClick={() => {
                              setSelectedKbId(entry.id);
                              setIsResumeDropdownOpen(false);
                            }}
                            className="w-full p-3 hover:bg-white/5 transition-colors flex items-start gap-3"
                          >
                            <FileText className="text-gray-400 mt-1" size={20} />
                            <div className="text-left">
                              <div className="font-medium text-white">{entry.name}</div>
                              <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                <Calendar size={14} />
                                <span>
                                  {new Date(entry.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedResume && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="text-blue-400" size={16} />
                        <h3 className="font-medium text-white">Selected Resume</h3>
                      </div>
                      <div className="text-sm text-gray-400">
                        <p className="mb-1">Name: {selectedResume.name}</p>
                        <p className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>
                            Added: {new Date(selectedResume.created_at).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div className="glass-container p-6 rounded-xl space-y-4">
                <h2 className="text-lg font-semibold text-white">Job Description</h2>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Paste the job description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/20 transition-all duration-200"
                    placeholder="Paste the job description here..."
                  />
                </div>
              </div>
            </div>

            {/* Bottom Section - AI Configuration */}
            <div className="glass-container p-6 rounded-xl space-y-4">
              <h2 className="text-lg font-semibold text-white">AI Configuration</h2>
              <ExtensionSequence
                selectedModel={selectedModel}
                includeHumanizer={includeHumanizer}
                onUpdateSequence={handleUpdateSequence}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedModel || !selectedKbId || !jobDescription.trim()}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium shadow-lg shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? 'Generating...' : 'Generate'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}