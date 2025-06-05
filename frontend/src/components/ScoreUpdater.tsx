import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ScoreUpdaterProps {
  userId: string;
  currentScore: number;
  onScoreUpdate: (newScore: number) => void;
}

const ScoreUpdater = ({ userId, currentScore, onScoreUpdate }: ScoreUpdaterProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newScore, setNewScore] = useState(currentScore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { csrfToken } = useAuth();

  const handleUpdateScore = async () => {
    if (newScore === currentScore) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/score/update/${userId}`, {
        method: 'PUT',
       credentials: "include",
        headers: {
            "Content-Type": "application/json",
            'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ score: newScore }),
      });
      if (!response.ok) {
        throw new Error('Failed to update score');
      }

      await response.json();
      onScoreUpdate(newScore);
      setIsEditing(false);
    } catch {
      setError('Failed to update score');
      setNewScore(currentScore); // Reset to original value
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewScore(currentScore);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="flex items-center gap-2">
      {!isEditing ? (
        <>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
            Score: {currentScore}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors"
            title="Change Score"
          >
            ✏️
          </button>
        </>
      ) : (
        <div className="flex items-center gap-2">          <input
            type="number"
            value={newScore}
            onChange={(e) => setNewScore(Number(e.target.value))}
            className="w-20 px-2 py-1 text-sm text-gray-800 rounded border-none outline-none"
            min="-100"
            max="100"
            disabled={isLoading}
            placeholder="Score"
            title="Enter new score"
          />
          <button
            onClick={handleUpdateScore}
            disabled={isLoading}
            className="px-2 py-1 bg-green-500 hover:bg-green-600 rounded text-xs transition-colors disabled:opacity-50"
          >
            {isLoading ? '⏳' : '✓'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded text-xs transition-colors disabled:opacity-50"
          >
            ✕
          </button>
        </div>
      )}
      {error && (
        <span className="text-red-200 text-xs">{error}</span>
      )}
    </div>
  );
};

export default ScoreUpdater;