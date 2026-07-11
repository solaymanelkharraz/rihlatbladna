import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { 
  FaBullhorn, 
  FaPlus, 
  FaTrash, 
  FaCommentAlt, 
  FaHeart, 
  FaEllipsisH, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaShare, 
  FaUpload, 
  FaCheck, 
  FaTimes,
  FaReply
} from 'react-icons/fa';

const AgencyPostsPage = () => {
  const { 
    user, 
    posts, 
    deletePost, 
    updatePost,
    toggleLikePost, 
    addCommentToPost, 
    deleteCommentFromPost, 
    showAlert 
  } = useAuth();

  const [openMenuPostId, setOpenMenuPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState('');
  const [replyTexts, setReplyTexts] = useState({});
  const [replyingTo, setReplyingTo] = useState({}); // { [postId]: { commentId, userName } }
  const fileInputRefs = useRef({});

  const myPosts = (posts || []).filter(p => p.agencyId === user?.id);

  const handleStartEdit = (post) => {
    setEditingPostId(post.id);
    setEditContent(post.content || '');
    setEditImage(post.image || '');
    setOpenMenuPostId(null);
  };

  const handleSaveEdit = async (postId) => {
    if (!editContent.trim()) {
      showAlert("Validation Error", "Post content cannot be empty.", "error");
      return;
    }
    const res = await updatePost(postId, { content: editContent.trim(), image: editImage });
    if (res.success) {
      setEditingPostId(null);
      showAlert("Success", "Post updated successfully!", "success");
    }
  };

  // Handle local file upload during edit using FileReader
  const handleEditFileUpload = (postId, file) => {
    if (!file || !file.type.startsWith('image/')) {
      showAlert("Invalid File", "Please select a valid image file.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 1000;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) { height = Math.round((height * MAX_SIZE) / width); width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width = Math.round((width * MAX_SIZE) / height); height = MAX_SIZE; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height);
        setEditImage(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleReplySubmit = async (e, postId) => {
    e.preventDefault();
    const rawText = replyTexts[postId] || '';
    if (!rawText.trim()) return;

    let finalText = rawText.trim();
    if (replyingTo[postId]) {
      finalText = `@${replyingTo[postId].userName} ${finalText}`;
    }

    const res = await addCommentToPost(postId, finalText);
    if (res.success) {
      setReplyTexts(prev => ({ ...prev, [postId]: '' }));
      setReplyingTo(prev => {
        const copy = { ...prev };
        delete copy[postId];
        return copy;
      });
      showAlert("Success", "Reply posted!", "success");
    }
  };

  const handleStartReply = (postId, comment) => {
    setReplyingTo(prev => ({ ...prev, [postId]: { commentId: comment.id, userName: comment.userName } }));
    document.getElementById(`reply_input_${postId}`)?.focus();
  };

  const renderCommentText = (text) => {
    if (text.startsWith('@')) {
      const spaceIdx = text.indexOf(' ');
      if (spaceIdx > 1) {
        const mention = text.substring(0, spaceIdx);
        const rest = text.substring(spaceIdx + 1);
        return (
          <span>
            <span className="text-blue-600 font-extrabold bg-blue-50 px-1.5 py-0.5 rounded-md mr-1">{mention}</span>
            {rest}
          </span>
        );
      }
    }
    return text;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex selection:bg-blue-500 selection:text-white" onClick={() => setOpenMenuPostId(null)}>
      <Sidebar />

      <div className="flex-1 lg:ml-64 pt-24 pb-12 px-6 lg:p-10 overflow-y-auto">
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <FaBullhorn className="text-orange-500" /> Manage Feed Posts
              </h1>
              <p className="text-slate-500 text-sm mt-1">Review community interactions, answer comments, and manage your Instagram-style feed updates.</p>
            </div>
            <Link
              to="/agency/story"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all shrink-0"
            >
              <FaPlus /> + Create Post / Story
            </Link>
          </div>

          {/* Posts Feed (Instagram Style) */}
          <div className="space-y-8">
            {myPosts.length > 0 ? (
              myPosts.map((post) => {
                const hasLiked = user && post.likes && post.likes.includes(user.id);
                const isEditing = editingPostId === post.id;
                const currentReplying = replyingTo[post.id];

                return (
                  <div 
                    key={post.id} 
                    className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    
                    {/* Post Header */}
                    <div className="p-6 flex justify-between items-center">
                      <div className="flex items-center gap-4 cursor-pointer group">
                        <img src={post.avatar || user?.avatar || '/MorP.jpg'} alt={post.agencyName} className="w-12 h-12 rounded-[1rem] shadow-xs border border-slate-100 group-hover:scale-105 transition-transform object-cover" />
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">{post.agencyName || user?.name}</h4>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                            {post.time || 'Recently'} <span className="w-1 h-1 rounded-full bg-slate-300"></span> <FaMapMarkerAlt className="text-blue-400" /> {post.location || user?.location || 'Morocco'}
                          </p>
                        </div>
                      </div>

                      {/* Three Dots Action Icon */}
                      <div className="relative">
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuPostId(openMenuPostId === post.id ? null : post.id);
                          }}
                          className="text-slate-400 hover:text-slate-800 transition-colors p-2.5 rounded-full hover:bg-slate-50 cursor-pointer border-none bg-transparent text-lg flex items-center justify-center"
                          title="Actions Menu"
                        >
                          <FaEllipsisH />
                        </button>

                        {/* Three Dots Dropdown Box */}
                        {openMenuPostId === post.id && (
                          <div className="absolute right-0 top-11 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 w-44 z-20 text-left animate-fade-in">
                            <button 
                              type="button"
                              onClick={() => handleStartEdit(post)}
                              className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer border-none bg-transparent flex items-center gap-2.5"
                            >
                              <FaEdit className="text-blue-500" /> Edit Post
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this post?")) {
                                  deletePost(post.id);
                                }
                                setOpenMenuPostId(null);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-500 font-bold text-xs transition-colors cursor-pointer border-none bg-transparent flex items-center gap-2.5"
                            >
                              <FaTrash className="text-red-500" /> Delete Post
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Post Image & Inline Editing Mode */}
                    {isEditing ? (
                      <div className="p-6 bg-slate-50/80 border-y border-slate-200/80 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Inline Post Editor</span>
                          <button onClick={() => setEditingPostId(null)} className="text-xs font-bold text-red-500 hover:text-red-600 border-none bg-transparent cursor-pointer">Cancel</button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Edit Caption</label>
                          <textarea 
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={3}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Edit Photo / Upload New</label>
                          <div className="flex items-center gap-3">
                            <input 
                              type="file"
                              accept="image/*"
                              ref={(el) => fileInputRefs.current[post.id] = el}
                              onChange={(e) => e.target.files && e.target.files[0] && handleEditFileUpload(post.id, e.target.files[0])}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[post.id]?.click()}
                              className="bg-white border border-slate-300 hover:border-blue-500 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all shrink-0"
                            >
                              <FaUpload className="text-blue-500" /> Browse from Device
                            </button>
                            <input 
                              type="text"
                              value={editImage.startsWith('data:image') ? 'Uploaded Custom Photo from Device' : editImage}
                              onChange={(e) => !editImage.startsWith('data:image') && setEditImage(e.target.value)}
                              readOnly={editImage.startsWith('data:image')}
                              placeholder="Or direct image URL..."
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {editImage && (
                          <div className="h-44 rounded-xl overflow-hidden bg-slate-200 border border-slate-300/60 shadow-xs max-w-sm">
                            <img src={editImage} alt="Edit preview" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                          <button 
                            onClick={() => setEditingPostId(null)}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer border-none"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleSaveEdit(post.id)}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer border-none shadow-sm flex items-center gap-1.5"
                          >
                            <FaCheck /> Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group bg-slate-100">
                        <img src={post.image || '/Sahara Desert Adventure.jpg'} alt="Post" className="w-full h-96 object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                      </div>
                    )}

                    {/* Actions & Content Footer */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={() => toggleLikePost(post.id)}
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all duration-300 active:scale-75 cursor-pointer border-none ${hasLiked ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                            title="Like post"
                          >
                            <FaHeart />
                          </button>
                          <button 
                            type="button"
                            onClick={() => document.getElementById(`reply_input_${post.id}`)?.focus()}
                            className="w-11 h-11 rounded-full flex items-center justify-center text-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-colors cursor-pointer border-none"
                            title="Comment"
                          >
                            <FaCommentAlt className="text-base" />
                          </button>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(window.location.href);
                            showAlert("Copied", "Post link copied to clipboard!", "info");
                          }}
                          className="w-11 h-11 rounded-full flex items-center justify-center text-base bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer border-none"
                          title="Share post"
                        >
                          <FaShare />
                        </button>
                      </div>
                      
                      {/* Likes Counter */}
                      <p className="text-sm font-black text-slate-900 mb-2">{post.likes?.length || 0} likes</p>
                      
                      {/* Caption */}
                      <p className="text-[14px] text-slate-700 leading-relaxed mb-4">
                        <span className="font-extrabold text-slate-900 mr-2 cursor-pointer hover:underline">{post.agencyName || user?.name}</span>
                        {post.content}
                      </p>
                      
                      {/* Comments Thread */}
                      {post.comments && post.comments.length > 0 ? (
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Traveler Comments ({post.comments.length})</p>
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-2.5 text-xs group/comment">
                              <img src={comment.avatar || comment.userAvatar || '/MorP.jpg'} alt="Avatar" className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                              <div className="bg-slate-50 p-3 rounded-2xl flex-1 flex flex-col justify-between items-start border border-slate-200/60">
                                <div className="w-full flex justify-between items-baseline mb-1">
                                  <span className="font-black text-slate-800 text-xs">{comment.userName}</span>
                                  <span className="text-[10px] text-slate-400">{new Date(comment.timestamp || comment.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                                
                                <p className="text-slate-700 font-medium leading-relaxed mb-2">
                                  {renderCommentText(comment.text)}
                                </p>

                                <div className="flex items-center gap-3 mt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleStartReply(post.id, comment)}
                                    className="text-[11px] font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer border-none bg-transparent p-0"
                                  >
                                    <FaReply className="text-[9px]" /> Reply to @{comment.userName}
                                  </button>

                                  <button 
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm("Delete this comment?")) {
                                        deleteCommentFromPost(post.id, comment.id);
                                      }
                                    }}
                                    className="opacity-0 group-hover/comment:opacity-100 text-red-400 hover:text-red-500 text-[10px] font-bold transition-opacity cursor-pointer border-none bg-transparent p-0"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-slate-100 text-slate-400 text-xs italic">
                          No comments yet.
                        </div>
                      )}

                      {/* Add Comment / Specified Reply Bottom Bar */}
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        {currentReplying && (
                          <div className="flex items-center justify-between bg-blue-50/90 px-3 py-1.5 rounded-xl mb-2 text-xs text-blue-800 font-bold border border-blue-200/60 animate-fade-in">
                            <span className="flex items-center gap-1.5">
                              <FaReply className="text-blue-600 text-[10px]" /> Replying to <span className="underline font-black">@{currentReplying.userName}</span>
                            </span>
                            <button 
                              type="button" 
                              onClick={() => setReplyingTo(prev => { const copy = { ...prev }; delete copy[post.id]; return copy; })}
                              className="text-red-500 hover:text-red-700 font-extrabold bg-transparent border-none cursor-pointer p-0.5 text-xs flex items-center gap-1"
                            >
                              <FaTimes /> Cancel
                            </button>
                          </div>
                        )}

                        <form onSubmit={(e) => handleReplySubmit(e, post.id)} className="flex items-center gap-3">
                          <img src={user?.avatar || "/MorP.jpg"} alt="Me" className="w-8 h-8 rounded-full object-cover shrink-0" />
                          <input 
                            id={`reply_input_${post.id}`}
                            type="text" 
                            value={replyTexts[post.id] || ''}
                            onChange={(e) => setReplyTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder={currentReplying ? `Write a response to @${currentReplying.userName}...` : "Add a comment or answer travelers..."} 
                            className="flex-1 bg-transparent outline-none text-xs font-medium placeholder:text-slate-400 text-slate-700" 
                          />
                          <button 
                            type="submit" 
                            className="text-blue-600 font-bold text-xs hover:text-blue-700 transition-colors cursor-pointer border-none bg-transparent px-2 py-1"
                          >
                            Post
                          </button>
                        </form>
                      </div>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 border border-blue-100">
                  <FaBullhorn />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No Feed Posts Published Yet</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">Create your first Instagram-style feed update or 24-hour story to engage travelers.</p>
                <Link
                  to="/agency/story"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md inline-flex items-center gap-2 transition-all"
                >
                  <FaPlus /> Create First Update
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AgencyPostsPage;
