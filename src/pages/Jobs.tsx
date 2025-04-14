import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Bot, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useJobsStore, type Job } from '../store/jobs';
import { ResultViewer } from '../components/ResultViewer';

const flowIcons = {
  gemini_api: { icon: Brain, label: 'Gemini', color: 'text-blue-400' },
  grok_api: { icon: Bot, label: 'Grok', color: 'text-purple-400' },
  humanizer: { icon: Sparkles, label: 'Humanizer', color: 'text-amber-400' },
};

const ITEMS_PER_PAGE = 5;

export function Jobs() {
  const { jobs, fetchJobs, getJobResult, isLoading } = useJobsStore();
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [resultContent, setResultContent] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    fetchJobs().catch(console.error);
  }, [fetchJobs]);

  const handleViewResult = async (job: Job) => {
    try {
      const content = await getJobResult(job._id);
      setResultContent(content);
      setSelectedJob(job);
    } catch (error) {
      console.error('Failed to fetch job result:', error);
    }
  };

  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  console.log(jobs)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-6">
        {jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-400 py-12 glass-container rounded-xl"
          >
            No generation jobs found. Start by creating one in the Generate page.
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4"
          >
            {paginatedJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="gradient-border p-[1px]"
              >
                <div className="glass-container p-6 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">
                          {job.type.toUpperCase()}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : job.status === 'failed'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {JSON.parse(job.flow.replace(/'/g, '"')).map((flow: string) => {
                          const FlowIcon = flowIcons[flow as keyof typeof flowIcons]?.icon;
                          const color = flowIcons[flow as keyof typeof flowIcons]?.color;
                          return FlowIcon ? (
                            <div
                              key={flow}
                              className={`flex items-center gap-2 ${color}`}
                            >
                              <FlowIcon size={16} />
                              <span className="text-sm">
                                {flowIcons[flow as keyof typeof flowIcons]?.label}
                              </span>
                            </div>
                          ) : null;
                        })}
                      </div>

                      <div className="text-sm text-gray-400 space-y-1">
                        <p>Created: {new Date(job.created_at).toLocaleString()}</p>
                        {job.completed_at && (
                          <p>Completed: {new Date(job.completed_at).toLocaleString()}</p>
                        )}
                      </div>
                    </div>

                    {job.status === 'completed' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleViewResult(job)}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                      >
                        View Result
                      </motion.button>
                    )}
                  </div>

                  {job.base_prompt && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Job Description Preview
                      </h4>
                      <p className="text-sm text-gray-400 line-clamp-3">
                        {job.base_prompt}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg glass-container disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg glass-container disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {selectedJob && resultContent && (
          <ResultViewer
            content={resultContent}
            type={selectedJob.type}
            onClose={() => {
              setSelectedJob(null);
              setResultContent('');
            }}
          />
        )}
      </div>
    </AnimatePresence>
  );
}