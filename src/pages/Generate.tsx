import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fetchApi } from '../lib/utils';
import { useKnowledgeBaseStore, type KnowledgeBase } from '../store/knowledge-base';
import { ExtensionSequence } from '../components/ExtensionSequence';

export function Generate() {
  const [type, setType] = React.useState<'email' | 'cv'>('email');
  const [jobDescription, setJobDescription] = React.useState('');
  const [selectedKbId, setSelectedKbId] = React.useState('');
  const [selectedExtensions, setSelectedExtensions] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showRedirect, setShowRedirect] = React.useState(false);
  
  const navigate = useNavigate();
  const { entries, fetchEntries, isLoading } = useKnowledgeBaseStore();

  React.useEffect(() => {
    fetchEntries().catch(console.error);
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExtensions.length === 0) {
      setError('Please select at least one AI model');
      return;
    }
    
    setError('');
    setIsSubmitting(true);

    try {
      await fetchApi('/api/generate/', {
        method: 'POST',
        body: {
          type,
          job_data: jobDescription,
          kb_id: selectedKbId,
          extensions: selectedExtensions,
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
          className="max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg"
              >
                {error}
              </motion.div>
            )}

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
                      flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${type === value
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                        : 'glass-container hover:border-purple-500/50'
                      }
                    `}
                  >
                    {value.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                required
                className="w-full px-4 py-3 glass-container rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/20 transition-all duration-200"
                placeholder="Paste the job description here..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Select Resume (Knowledge Base)
              </label>
              <select
                value={selectedKbId}
                onChange={(e) => setSelectedKbId(e.target.value)}
                required
                className="w-full px-4 py-3 glass-container rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/20 transition-all duration-200"
              >
                <option value="">Select a resume...</option>
                {entries.map((entry: KnowledgeBase) => (
                  <option key={entry.id} value={entry.id}>
                    {entry?.name || entry.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Extensions
              </label>
              <ExtensionSequence
                selectedExtensions={selectedExtensions}
                onExtensionToggle={setSelectedExtensions}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium shadow-lg shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? 'Generating...' : 'Generate'}
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}