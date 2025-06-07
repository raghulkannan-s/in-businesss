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

  const getScoreColor = (score: number) => {
    if (score > 0) return 'text-green-700 bg-green-100 border-green-300';
    if (score === 0) return 'text-blue-700 bg-blue-100 border-blue-300 ';
    return 'text-red-700 bg-red-100 border-red-300';
  };

  const getScoreIcon = (score: number) => {
    if (score > 0) return '⭐';
    if (score === 0) return '👍';
    return '⚠️';
  };

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
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300">
      {!isEditing ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">{getScoreIcon(currentScore)}</div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Current Score</p>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-lg font-bold text-xl border-2 ${getScoreColor(currentScore)}`}>
                  {currentScore}
                </span>
                <div className="text-xs text-gray-400 font-medium">
                  {currentScore > 0 ? 'Excellent' :
                   currentScore === 0 ? 'Good' : 'Poor'}
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            title="Edit Score"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Score
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Update Score</h4>
              <p className="text-sm text-gray-500">Enter a value between -100 and 100</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label htmlFor="score-input" className="block text-sm font-medium text-gray-700 mb-2">
                New Score
              </label>
              <input
                id="score-input"
                type="number"
                value={newScore}
                onChange={(e) => setNewScore(Number(e.target.value))}
                className="w-full px-4 py-3 text-lg font-semibold text-gray-800 bg-white border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
                min="-100"
                max="100"
                disabled={isLoading}
                placeholder="Enter score..."
                title="Enter new score"
              />
            </div>
            
            <div className="flex gap-2 mt-7">
              <button
                onClick={handleUpdateScore}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save
                  </>
                )}
              </button>
              
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreUpdater;