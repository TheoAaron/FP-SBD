'use client';
import React, { useState } from 'react';
import StarRating from '@/components/StarRating';
import { Star } from 'lucide-react';

export interface Review {
  id: number;
  username: string;
  date: string;
  rating: number;
  comment: string;
}

const initialReviews: Review[] = [
  { id: 1, username: 'User1234567', date: '2025-06-01', rating: 4, comment: 'ARULLLLLLLLLLLLLLLLLLLLLLLLL' },
  { id: 2, username: 'User987654', date: '2025-06-05', rating: 5, comment: 'Great product, highly recommend!' },
  { id: 3, username: 'User456789', date: '2025-06-10', rating: 3, comment: 'Average quality, could be better.' },
  { id: 4, username: 'User321654', date: '2025-06-15', rating: 2, comment: 'Not what I expected.' },
  { id: 5, username: 'User222333', date: '2025-06-18', rating: 5, comment: 'Excellent build quality.' },
  { id: 6, username: 'User444555', date: '2025-06-20', rating: 4, comment: 'Good value for money.' },
  { id: 7, username: 'User666777', date: '2025-06-22', rating: 3, comment: 'It works, but has minor issues.' },
  { id: 8, username: 'User888999', date: '2025-06-25', rating: 5, comment: 'Exceeded my expectations!' },
  { id: 9, username: 'User000111', date: '2025-06-27', rating: 4, comment: 'Solid performance overall.' },
  { id: 10, username: 'User222444', date: '2025-06-29', rating: 1, comment: 'Stopped working after a week.' }
];

export default function UserReview() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showModal, setShowModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Review = {
      id: reviews.length + 1,
      username: 'Anonymous',
      date: new Date().toISOString().slice(0, 10),
      rating: newRating,
      comment: newComment
    };
    setReviews([next, ...reviews]);
    setNewRating(5);
    setNewComment('');
    setShowModal(false);
  };

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded shadow p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StarRating rating={avgRating} />
          <span className="text-sm text-gray-500">
            Penilaian Produk ({reviews.length} Reviews)
          </span>
        </div>
        <button onClick={() => setShowModal(true)}>
          <img
            src="/image 64.png"
            alt="Add Review"
            className="w-16 h-16 object-cover rounded"
          />
        </button>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded shadow p-4 space-y-6 h-60 overflow-y-auto">
        {reviews.map(review => (
          <div key={review.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{review.username}</span>
              <span>{review.date}</span>
            </div>
            <StarRating rating={review.rating} />
            <p className="text-gray-700 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <form
            className="z-60 bg-white rounded p-6 w-full max-w-md space-y-4"
            onSubmit={handleAddReview}
          >
            <h2 className="text-lg font-semibold">Tambah Review</h2>
            <div>
              <label className="block text-sm mb-1">Rating</label>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(n => (
                  <Star
                    key={n}
                    className={
                      `w-6 h-6 cursor-pointer ${n <= newRating ? 'text-yellow-400' : 'text-gray-300'}`
                    }
                    onClick={() => setNewRating(n)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Komentar</label>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                rows={4}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-red-500 text-white"
              >
                Kirim
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}