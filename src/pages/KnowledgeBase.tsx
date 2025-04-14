import React from 'react';
import { Trash2 } from 'lucide-react';
import { useKnowledgeBaseStore } from '../store/knowledge-base';

export function KnowledgeBase() {
  const [resumeData, setResumeData] = React.useState('');
  const [additionalData, setAdditionalData] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const { entries, fetchEntries, addEntry, deleteEntry, isLoading } = useKnowledgeBaseStore();

  React.useEffect(() => {
    fetchEntries().catch(console.error);
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await addEntry(resumeData, additionalData);
      setResumeData('');
      setAdditionalData('');
    } catch (err) {
      setError('Failed to save knowledge base entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id);
    } catch (err) {
      setError('Failed to delete knowledge base entry');
    }
  };

  if (isLoading) {
    return <div>Loading knowledge base...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Add New Resume
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resume Data
            </label>
            <textarea
              value={resumeData}
              onChange={(e) => setResumeData(e.target.value)}
              required
              rows={6}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your resume content here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Information (Optional)
            </label>
            <textarea
              value={additionalData}
              onChange={(e) => setAdditionalData(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional information..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Resume'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Saved Resumes
        </h3>

        {entries.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 py-8">
            No resumes found. Add your first resume using the form above.
          </div>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {entry.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Added: {new Date(entry.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}