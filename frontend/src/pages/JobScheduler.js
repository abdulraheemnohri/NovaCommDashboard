import React, { useState, useEffect } from 'react';
import { getScheduledJobs, createJob, deleteJob } from '../api/apiClient';

const JobScheduler = () => {
  const [jobs, setJobs] = useState([]);
  const [jobType, setJobType] = useState('');
  const [jobTarget, setJobTarget] = useState('');
  const [jobSchedule, setJobSchedule] = useState('');
  const [message, setMessage] = useState('');

  const fetchJobs = async () => {
    try {
      const response = await getScheduledJobs();
      setJobs(response.data);
    } catch (error) {
      setMessage(`Error fetching jobs: ${error.response?.data?.detail || error.message}`);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!jobType || !jobTarget || !jobSchedule) {
      setMessage('Please fill all job fields.');
      return;
    }

    try {
      await createJob({ type: jobType, target: jobTarget, schedule: jobSchedule });
      setMessage('Job created successfully!');
      setJobType('');
      setJobTarget('');
      setJobSchedule('');
      fetchJobs(); // Refresh list
    } catch (error) {
      setMessage(`Error creating job: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleDeleteJob = async (jobId) => {
    setMessage('');
    try {
      await deleteJob(jobId);
      setMessage(`Job ${jobId} deleted successfully!`);
      fetchJobs(); // Refresh list
    } catch (error) {
      setMessage(`Error deleting job: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Job Scheduler</h1>

      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Create New Job</h2>
        <form onSubmit={handleCreateJob}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobType">
              Job Type
            </label>
            <input
              type="text"
              id="jobType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobTarget">
              Job Target (e.g., node_id, firmware_version)
            </label>
            <input
              type="text"
              id="jobTarget"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={jobTarget}
              onChange={(e) => setJobTarget(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobSchedule">
              Schedule (e.g., daily, weekly, once)
            </label>
            <input
              type="text"
              id="jobSchedule"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={jobSchedule}
              onChange={(e) => setJobSchedule(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Job
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </div>

      <div className="mt-6 overflow-x-auto bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Scheduled Jobs</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">ID</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Target</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Schedule</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map(job => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap">{job.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.target}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.schedule}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobScheduler;
