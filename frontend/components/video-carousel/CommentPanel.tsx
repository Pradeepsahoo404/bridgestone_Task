'use client';

import { useState, useEffect } from'react';
import { useQuery, useMutation, useQueryClient } from'@tanstack/react-query';
import { X, Send, MessageCircle, Loader2 } from'lucide-react';
import { fetchComments, createComment } from'../../lib/api';
import { QUERY_KEYS } from'../../lib/constants';

interface CommentPanelProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentPanel({ videoId, isOpen, onClose }: CommentPanelProps) {
  const queryClient = useQueryClient();
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: comments = [], isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.COMMENTS, videoId],
    queryFn: () => fetchComments(videoId),
    enabled: isOpen && !!videoId,
  });

  const mutation = useMutation({
    mutationFn: (input: { author: string; message: string }) => createComment(videoId, input),
    onSuccess: () => {
      setMessage('');
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS, videoId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VIDEOS] });
    },
    onError: (err: Error) => {
      setErrorMsg(err.message ||'Failed to post comment. Please try again.');
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key ==='Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedAuthor = author.trim() ||'Guest User';
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setErrorMsg('Please write a comment before submitting.');
      return;
    }

    mutation.mutate({ author: trimmedAuthor, message: trimmedMessage });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comment-panel-title"
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center sm:justify-end bg-black/50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="comment-panel relative w-full sm:w-[380px] h-[72vh] sm:h-full bg-[#161616] sm:border-l border-white/10 rounded-t-3xl sm:rounded-none p-5 shadow-2xl flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/25 sm:hidden" />

        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-white" />
            <h3 id="comment-panel-title" className="text-base font-semibold text-white">
              Comments ({comments.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comments panel"
            className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar-dark">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-white/50 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-white" />
              <span className="text-xs">Loading comments...</span>
            </div>
          ) : isError ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center font-medium">
              Failed to load comments. Please close and re-open.
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-white/40 gap-2">
              <MessageCircle className="w-8 h-8 opacity-40" />
              <p className="text-xs">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{comment.author}</span>
                  <span className="text-white/40 text-[10px]">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed break-words">
                  {comment.message}
                </p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-white/10 pt-4 space-y-3">
          {errorMsg && (
            <div className="text-xs text-rose-300 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 font-medium">
              {errorMsg}
            </div>
          )}

          <input
            type="text"
            placeholder="Your name (default: Guest User)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30"
          />

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={mutation.isPending || !message.trim()}
              aria-label="Submit comment"
              className="p-2.5 rounded-full bg-white hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold transition-all flex items-center justify-center"
            >
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
