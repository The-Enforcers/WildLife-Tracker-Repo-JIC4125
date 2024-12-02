import React, { useState, useEffect } from 'react';

const AdminPage = () => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const showStatus = (message) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(''), 3000); // Clear message after 3 seconds
  };

  const fetchReportedPosts = async (page) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`https://localhost:5001/api/admin/reported-posts?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch reported posts');
      }
      
      const data = await response.json();
      setReportedPosts(data.posts);
      setTotalPages(data.pagination.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load reported posts');
      setLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      const response = await fetch(`https://localhost:5001/api/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error('Failed to ban user');
      
      showStatus('User banned successfully');
      fetchReportedPosts(currentPage);
    } catch (err) {
      showStatus('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      const response = await fetch(`https://localhost:5001/api/admin/users/${userId}/unban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error('Failed to unban user');
      
      showStatus('User unbanned successfully');
      fetchReportedPosts(currentPage);
    } catch (err) {
      showStatus('Failed to unban user');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`https://localhost:5001/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete post');
      
      showStatus('Post deleted successfully');
      fetchReportedPosts(currentPage);
    } catch (err) {
      showStatus('Failed to delete post');
    }
  };

  useEffect(() => {
    fetchReportedPosts(currentPage);
  }, [currentPage]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-4">
      {statusMessage && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded shadow-lg">
          {statusMessage}
        </div>
      )}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Reported Posts Administration</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportedPosts.map((post) => (
                <tr key={post._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{post.authorId.displayName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{post.reportCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-x-2">
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete Post
                      </button>
                      {post.authorId.isBanned ? (
                        <button
                          onClick={() => handleUnbanUser(post.authorId._id)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Unban User
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBanUser(post.authorId._id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Ban User
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;