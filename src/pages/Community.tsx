
import React from 'react';
import Layout from '@/components/Layout';
import { useCommunity } from '@/hooks/useCommunity';

const Community: React.FC = () => {
  const { posts, loading, likePost, addComment, getUserProfile, postTypes, createNewPost } = useCommunity();
  const userProfile = getUserProfile();

  return (
    <Layout pageTitle="Community | Sacred Shifter">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
            Sacred Shifter Community
          </h1>
          
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-purple-500/30">
            <p className="text-white/80">
              Connect with fellow Sacred Shifters, share insights, and explore collective consciousness expansion.
            </p>
          </div>
          
          {/* Community Feed */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-10">
                <div className="w-8 h-8 border-4 border-t-purple-500 border-r-purple-300 border-b-purple-200 border-l-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/60">Loading community posts...</p>
              </div>
            ) : (
              <>
                {/* New Post Form */}
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                  <h3 className="text-lg font-medium mb-4">Share Your Insights</h3>
                  <textarea 
                    className="w-full bg-black/60 border border-purple-500/30 rounded-lg p-4 text-white/90 min-h-[120px]" 
                    placeholder="Share your insights, experiences, or ask a question..."
                  ></textarea>
                  <div className="mt-4 flex justify-between items-center">
                    <select className="bg-black/60 border border-purple-500/30 rounded-lg px-3 py-2 text-white/90">
                      {postTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
                      Share
                    </button>
                  </div>
                </div>
                
                {/* Post List */}
                {posts.map(post => (
                  <div key={post.id} className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {post.author.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{post.author.name}</h4>
                        <p className="text-xs text-white/60">
                          {new Date(post.createdAt).toLocaleDateString()} • {post.postType}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-white/90">{post.content}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <button 
                        onClick={() => likePost(post.id)}
                        className="flex items-center gap-2 text-white/60 hover:text-purple-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{post.likes}</span>
                      </button>
                      <span className="text-sm text-white/60">{post.comments.length} comments</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
