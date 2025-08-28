'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { apiService, AnalyzeResponse } from '@/lib/api';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validationError = apiService.validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const validationError = apiService.validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile || !jobUrl) {
      setError('Please provide both a resume PDF and job URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiService.analyzeResume(selectedFile, jobUrl);
      setResult(response);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to connect to the server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setJobUrl('');
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg">
              <Image
                src="/file.svg"
                alt="Resume Analysis"
                width={32}
                height={32}
                className="dark:invert"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Resume Assistant
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload your resume and provide a job description URL to get personalized suggestions 
            on how to improve your resume for that specific role.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!result ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Upload Resume (PDF)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      selectedFile
                        ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="mb-4">
                          <Image
                            src="/file.svg"
                            alt="Upload"
                            width={48}
                            height={48}
                            className="dark:invert opacity-60"
                          />
                        </div>
                        {selectedFile ? (
                          <div className="text-green-600 dark:text-green-400">
                            <p className="font-semibold">{selectedFile.name}</p>
                            <p className="text-sm">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Drop your PDF here or click to browse
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Maximum file size: 10MB
                            </p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="job-url" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Job Description URL
                  </label>
                  <input
                    type="url"
                    id="job-url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://example.com/job-posting"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Paste the URL of the job posting you&apos;re applying for
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="text-red-600 dark:text-red-400">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-red-800 dark:text-red-200">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !selectedFile || !jobUrl}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing Resume...
                    </div>
                  ) : (
                    'Analyze Resume'
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Analysis Results
                </h2>
                <button
                  onClick={resetForm}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
                >
                  Analyze Another
                </button>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-green-800 dark:text-green-200 font-semibold">
                    {result.message}
                  </p>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Suggestions:
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-sans">
                    {result.suggestions}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-16 text-gray-500 dark:text-gray-400">
          <p>Built with Next.js and Go</p>
        </footer>
      </div>
    </div>
  );
}