import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useJobsStore, type Job } from '../store/jobs';
import { ResultViewer } from '../components/ResultViewer';
import { JobCard } from '../components/JobCard';

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
            {paginatedJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onViewResult={() => handleViewResult(job)}
              />
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