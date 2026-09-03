'use client';

import { useState } from'react';
import { X, Copy, Check, Share2 } from'lucide-react';
import { Video } from'../../types';
import { shareVideo } from'../../lib/api';

interface ShareMenuProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareMenu({ video, isOpen, onClose }: ShareMenuProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = typeof window !=='undefined'
    ? `${window.location.origin}${window.location.pathname}?video=${video.id}`
    : `http://localhost:3000/?video=${video.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      await shareVideo({ videoId: video.id, platform:'copy_link' });
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy share link', e);
    }
  };

  const handleSocialShare = async (
    platform:'whatsapp' |'facebook' |'linkedin' |'x'
  ) => {
    let url ='';
    const text = encodeURIComponent(`Check out"${video.title}" on Socially Approved!`);
    const encodedShareUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case'whatsapp':
        url = `https://api.whatsapp.com/send?text=${text}%20${encodedShareUrl}`;
        break;
      case'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`;
        break;
      case'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`;
        break;
      case'x':
        url = `https://twitter.com/intent/tweet?text=${text}&url=${encodedShareUrl}`;
        break;
    }

    await shareVideo({ videoId: video.id, platform });
    window.open(url,'_blank','noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !=='undefined' && navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: shareUrl,
        });
        await shareVideo({ videoId: video.id, platform:'native' });
        onClose();
      } catch (e) {
        // User cancelled native share sheet
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-5 shadow-2xl text-slate-900 space-y-4 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" />
            <h3 id="share-title" className="text-base font-bold text-slate-900">
              Share Video
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share menu"
            className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share URL Box */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-transparent text-xs text-slate-700 font-mono focus:outline-none truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all flex-shrink-0 shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        </div>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-medium text-xs text-slate-800 border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            Open System Share Options
          </button>
        )}

        <div className="grid grid-cols-4 gap-3 pt-2 text-center text-xs">
          <button
            type="button"
            onClick={() => handleSocialShare('whatsapp')}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              WA
            </div>
            <span className="text-slate-600 text-[11px]">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialShare('x')}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              X
            </div>
            <span className="text-slate-600 text-[11px]">Twitter / X</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialShare('facebook')}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              FB
            </div>
            <span className="text-slate-600 text-[11px]">Facebook</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialShare('linkedin')}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              LN
            </div>
            <span className="text-slate-600 text-[11px]">LinkedIn</span>
          </button>
        </div>
      </div>
    </div>
  );
}
