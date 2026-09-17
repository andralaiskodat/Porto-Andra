import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPaperPlane, FaUser, FaEnvelope, FaComment, FaCamera, FaHeart, FaReply, 
  FaGithub, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaCheck, FaTimes, FaTrash
} from 'react-icons/fa';
import { useAdmin } from '../../contexts/AdminContext';
import NeuCard from '../ui/neumorphism/NeuCard';
import NeuButton from '../ui/neumorphism/NeuButton';
import { NeuInput, NeuTextarea } from '../ui/neumorphism/NeuInput';

export const NeuContact = () => {
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Comments State
  const [commentForm, setCommentForm] = useState({ name: '', message: '', photo: null, photoPreview: null });
  const [comments, setComments] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const { isAuthenticated } = useAdmin();

  // Load comments from localStorage
  useEffect(() => {
    try {
      const savedComments = localStorage.getItem('portfolioComments');
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    } catch (e) {
      console.warn('Error loading comments:', e);
    }
  }, []);

  const saveComments = (newComments) => {
    setComments(newComments);
    try {
      localStorage.setItem('portfolioComments', JSON.stringify(newComments));
    } catch (e) {
      console.warn('Error saving comments:', e);
    }
  };

  // Submit Contact Form
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingContact(true);

    const newMessage = {
      id: Date.now(),
      name: contactForm.name,
      email: contactForm.email,
      message: contactForm.message,
      timestamp: new Date().toISOString(),
      status: 'unread'
    };

    try {
      const savedMessages = localStorage.getItem('portfolioContactMessages');
      const messages = savedMessages ? JSON.parse(savedMessages) : [];
      localStorage.setItem('portfolioContactMessages', JSON.stringify([newMessage, ...messages]));
    } catch (err) {}

    await new Promise(resolve => setTimeout(resolve, 800));

    setContactSuccess(true);
    setContactForm({ name: '', email: '', message: '' });
    setIsSubmittingContact(false);

    setTimeout(() => setContactSuccess(false), 5000);
  };

  // Handle Photo Upload for Comment
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCommentForm(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Comment
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.message.trim()) return;

    setIsSubmittingComment(true);

    const newComment = {
      id: Date.now(),
      name: commentForm.name.trim(),
      message: commentForm.message.trim(),
      photo: commentForm.photoPreview,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    saveComments([newComment, ...comments]);
    setCommentForm({ name: '', message: '', photo: null, photoPreview: null });
    setIsSubmittingComment(false);
  };

  // Handle Like
  const handleLikeComment = (commentId) => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        return { ...c, likes: (c.likes || 0) + 1 };
      }
      return c;
    });
    saveComments(updated);
  };

  // Handle Reply
  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return;
    const updated = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...(c.replies || []),
            {
              id: Date.now(),
              name: isAuthenticated ? 'Fransisko Andrade (Author)' : 'Visitor',
              message: replyText.trim(),
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return c;
    });
    saveComments(updated);
    setReplyText('');
    setReplyTo(null);
  };

  // Handle Delete (Admin)
  const handleDeleteComment = (commentId) => {
    if (window.confirm('Delete this comment?')) {
      const updated = comments.filter(c => c.id !== commentId);
      saveComments(updated);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative font-poppins">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8ECF1] shadow-neu-inset text-xs font-semibold text-neu-accent uppercase tracking-wider">
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neu-primary tracking-tight">
            Let's Collaborate & Build
          </h2>
          <p className="text-neu-secondary text-sm sm:text-base max-w-xl mx-auto">
            Have a project in mind, an opportunity to discuss, or just want to say hi? Drop a message below.
          </p>
        </div>

        {/* Contact Info & Direct Message Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          
          {/* Left: Contact Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <NeuCard
              variant="raised"
              rounded="rounded-3xl"
              className="p-8 border border-white/80 space-y-6"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neu-accent">
                  Contact Information
                </span>
                <h3 className="text-2xl font-bold text-neu-primary mt-1">
                  Fransisko Andrade
                </h3>
                <p className="text-sm text-neu-secondary mt-1">
                  Available for freelance projects, full-time roles, and technical collaborations.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8ECF1] shadow-neu-inset flex items-center justify-center text-neu-accent flex-shrink-0">
                    <FaEnvelope />
                  </div>
                  <div>
                    <span className="text-xs text-neu-secondary font-medium uppercase">Email</span>
                    <p className="text-sm font-bold text-neu-primary">andralaiskodat8@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8ECF1] shadow-neu-inset flex items-center justify-center text-[#F2739E] flex-shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <span className="text-xs text-neu-secondary font-medium uppercase">Location</span>
                    <p className="text-sm font-bold text-neu-primary">Yogyakarta, Indonesia</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-300/40">
                <span className="text-xs font-semibold text-neu-secondary uppercase tracking-wider block mb-3">
                  Official Channels:
                </span>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/andralaiskodat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-[#ECF0F3] shadow-neu-flat flex items-center justify-center text-neu-primary hover:text-neu-accent hover:shadow-neu-hover active:shadow-neu-pressed transition-all"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href="https://www.instagram.com/anndraa8._"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-[#ECF0F3] shadow-neu-flat flex items-center justify-center text-neu-primary hover:text-[#F2739E] hover:shadow-neu-hover active:shadow-neu-pressed transition-all"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/fransisko"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-[#ECF0F3] shadow-neu-flat flex items-center justify-center text-neu-primary hover:text-[#0077b5] hover:shadow-neu-hover active:shadow-neu-pressed transition-all"
                  >
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </NeuCard>
          </div>

          {/* Right: Contact Form with Inset Inputs */}
          <div className="lg:col-span-7">
            <NeuCard
              variant="raised"
              rounded="rounded-3xl"
              className="p-8 sm:p-10 border border-white/80"
            >
              <h3 className="text-2xl font-bold text-neu-primary mb-2">Send a Direct Message</h3>
              <p className="text-sm text-neu-secondary mb-6">
                Fill out this form and I will respond to your inquiry as soon as possible.
              </p>

              {contactSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-neu-inset text-emerald-800 text-sm flex items-center gap-3">
                  <FaCheck className="text-emerald-600 flex-shrink-0" />
                  <span>Pesan berhasil dikirim! Terima kasih telah menghubungi saya.</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-5">
                <NeuInput
                  label="Your Name"
                  id="neu-name"
                  icon={FaUser}
                  placeholder="e.g. John Doe"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />

                <NeuInput
                  label="Email Address"
                  id="neu-email"
                  type="email"
                  icon={FaEnvelope}
                  placeholder="e.g. john@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />

                <NeuTextarea
                  label="Your Message"
                  id="neu-message"
                  rows={4}
                  placeholder="Describe your project, inquiry, or question..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                />

                <NeuButton
                  type="submit"
                  variant="gradient"
                  size="lg"
                  disabled={isSubmittingContact}
                  className="w-full rounded-2xl font-bold mt-2"
                >
                  <FaPaperPlane className="text-xs" />
                  <span>{isSubmittingContact ? 'Sending Message...' : 'Send Message'}</span>
                </NeuButton>
              </form>
            </NeuCard>
          </div>

        </div>

        {/* Public Discussion / Comments Section in Soft Neumorphism */}
        <div className="pt-6 border-t border-slate-300/40">
          <div className="text-center space-y-2 mb-10">
            <h3 className="text-2xl font-bold text-neu-primary">Visitor Discussion & Comments</h3>
            <p className="text-sm text-neu-secondary">
              Leave feedback, comments, or say hello to the community!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Comment Form */}
            <div className="lg:col-span-5">
              <NeuCard
                variant="raised"
                rounded="rounded-3xl"
                className="p-6 sm:p-7 border border-white/80"
              >
                <h4 className="font-bold text-lg text-neu-primary mb-4 flex items-center gap-2">
                  <FaComment className="text-neu-accent" />
                  <span>Post a Comment</span>
                </h4>

                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <NeuInput
                    label="Name"
                    id="comment-name"
                    placeholder="Your display name"
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    required
                  />

                  <NeuTextarea
                    label="Comment"
                    id="comment-msg"
                    rows={3}
                    placeholder="Write your feedback..."
                    value={commentForm.message}
                    onChange={(e) => setCommentForm({ ...commentForm, message: e.target.value })}
                    required
                  />

                  {/* Photo upload */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neu-secondary ml-1 mb-1.5">
                      Add Avatar / Image (Optional)
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E8ECF1] shadow-neu-inset cursor-pointer text-xs text-neu-secondary hover:text-neu-primary transition-colors">
                      <FaCamera className="text-neu-accent" />
                      <span>{commentForm.photo ? 'Change Selected Photo' : 'Select Photo (Max 5MB)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {commentForm.photoPreview && (
                      <div className="mt-2 relative w-16 h-16 rounded-xl overflow-hidden shadow-neu-inset p-1 bg-[#E8ECF1]">
                        <img
                          src={commentForm.photoPreview}
                          alt="preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setCommentForm(prev => ({ ...prev, photo: null, photoPreview: null }))}
                          className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px]"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  <NeuButton
                    type="submit"
                    variant="gradient"
                    size="md"
                    disabled={isSubmittingComment}
                    className="w-full rounded-xl font-semibold"
                  >
                    Publish Comment
                  </NeuButton>
                </form>
              </NeuCard>
            </div>

            {/* Comments Feed */}
            <div className="lg:col-span-7 space-y-5">
              {comments.length === 0 ? (
                <NeuCard variant="inset" rounded="rounded-3xl" className="p-8 text-center text-neu-secondary">
                  <FaComment className="text-3xl mx-auto mb-2 text-neu-accent/50" />
                  <p className="text-sm font-medium">No comments yet. Be the first to leave a thought!</p>
                </NeuCard>
              ) : (
                comments.map((comment) => (
                  <NeuCard
                    key={comment.id}
                    variant="raised"
                    rounded="rounded-2xl"
                    className="p-5 border border-white/80 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E8ECF1] shadow-neu-inset flex items-center justify-center text-neu-accent overflow-hidden font-bold text-sm">
                          {comment.photo ? (
                            <img src={comment.photo} alt={comment.name} className="w-full h-full object-cover" />
                          ) : (
                            comment.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-neu-primary">{comment.name}</h5>
                          <span className="text-[10px] text-neu-secondary">
                            {new Date(comment.timestamp).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {isAuthenticated && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:text-red-700 text-xs p-1"
                          title="Delete Comment"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-neu-primary leading-relaxed pl-13">
                      {comment.message}
                    </p>

                    {/* Actions: Like & Reply */}
                    <div className="flex items-center gap-4 pl-13 pt-1 text-xs">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className="flex items-center gap-1.5 text-neu-secondary hover:text-[#F2739E] transition-colors"
                      >
                        <FaHeart className={comment.likes > 0 ? 'text-[#F2739E]' : ''} />
                        <span>{comment.likes || 0}</span>
                      </button>

                      <button
                        onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                        className="flex items-center gap-1.5 text-neu-secondary hover:text-neu-accent transition-colors"
                      >
                        <FaReply />
                        <span>Reply</span>
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-12 pt-2 space-y-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="p-3 rounded-xl bg-[#E8ECF1] shadow-neu-inset text-xs space-y-1">
                            <div className="flex items-center justify-between font-semibold text-neu-primary">
                              <span>{reply.name}</span>
                              <span className="text-[9px] text-neu-secondary">
                                {new Date(reply.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-neu-secondary">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input Box */}
                    {replyTo === comment.id && (
                      <div className="pl-12 pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#E8ECF1] shadow-neu-inset border-none focus:outline-none text-neu-primary"
                        />
                        <NeuButton
                          onClick={() => handleAddReply(comment.id)}
                          variant="gradient"
                          size="sm"
                          className="rounded-xl text-xs py-2 px-3"
                        >
                          Send
                        </NeuButton>
                      </div>
                    )}
                  </NeuCard>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default NeuContact;
