import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/ReviewSection.css";

const StarDisplay = ({ rating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= rating ? "star filled" : "star"}>
        ★
      </span>
    ))}
  </div>
);

const StarInput = ({ value, onChange }) => (
  <div className="stars stars-input">
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className={s <= value ? "star filled" : "star"}
        onClick={() => onChange(s)}
      >
        ★
      </span>
    ))}
  </div>
);

const ReviewSection = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/reviews?productId=${productId}`);
      setReviews(res.data.result);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : null;

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please enter a comment.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await axios.post("/reviews", { productId, rating, comment });
      setRating(0);
      setComment("");
      fetchReviews();
    } catch {
      setError("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-section">
      <div className="review-section-header">
        <h3 className="review-section-title">Reviews</h3>
        {average && (
          <div className="review-average">
            <StarDisplay rating={Math.round(average)} />
            <span className="review-average-score">{average} / 5</span>
            <span className="review-count">({reviews.length})</span>
          </div>
        )}
      </div>

      {user?.role === "CUSTOMER" && (
        <div className="review-form">
          <p className="review-form-label">Leave a review</p>
          <StarInput value={rating} onChange={setRating} />
          <textarea
            className="review-textarea"
            placeholder="Comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
          {error && <p className="review-error">{error}</p>}
          <button
            className="btn-primary review-submit"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}

      <div className="review-list">
        {loading ? (
          <p className="review-loading">Loading...</p>
        ) : reviews.length === 0 ? (
          <p className="review-empty">There are no reviews for this product.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review-card">
              <div className="review-card-header">
                <StarDisplay rating={r.rating} />
                <span className="review-author">
                  {r.User?.firstName} {r.User?.lastName}
                </span>
                <span className="review-date">
                  {new Date(r.createdAt).toLocaleDateString("sr-RS")}
                </span>
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
