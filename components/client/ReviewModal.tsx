"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Check } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  onSubmit: (rating: number, comment: string) => void;
}

export default function ReviewModal({ isOpen, onClose, productName, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit(rating, comment);
    // Reset form after submit
    setComment('');
    setRating(5);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-10"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-50/50">
              <div>
                <h3 className="font-display text-lg font-semibold text-gray-900">Write Product Review</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-[280px] truncate">{productName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                id="btn-close-review"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Star Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 hover:scale-115 transition-transform cursor-pointer"
                      id={`star-${star}`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating ?? rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-200 fill-transparent'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-mono text-gray-500 ml-2">
                    ({rating} / 5 Stars)
                  </span>
                </div>
              </div>

              {/* Review Comment Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Review Comment (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you liked or how we can improve this product..."
                  rows={4}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none placeholder:text-gray-400 transition-shadow"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-xl transition-colors"
                  id="btn-cancel-review"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all flex items-center gap-2 hover:scale-102 active:scale-98"
                  id="btn-submit-review"
                >
                  <Check className="w-4 h-4" />
                  Submit Review
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
