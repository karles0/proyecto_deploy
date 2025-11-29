import { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { followService } from '../../Service/followService';
import { useAuth } from '../../context/AuthContext';

interface FollowButtonProps {
  username: string;
  initialFollowing?: boolean | null;
  initialFollowerCount?: number;
  onFollowChange?: (isFollowing: boolean, followerCount: number) => void;
}

export default function FollowButton({ 
  username, 
  initialFollowing = null,
  initialFollowerCount = 0,
  onFollowChange 
}: FollowButtonProps) {
  const { username: currentUsername } = useAuth();
  const [isFollowing, setIsFollowing] = useState<boolean>(initialFollowing ?? false);
  const [loading, setLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);

  // No mostrar botón si es el mismo usuario
  if (currentUsername === username) {
    return null;
  }

  useEffect(() => {
    if (initialFollowing !== null) {
      setIsFollowing(initialFollowing);
    }
  }, [initialFollowing]);

  useEffect(() => {
    setFollowerCount(initialFollowerCount);
  }, [initialFollowerCount]);

  const handleToggleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      const response = await followService.toggleFollow(username);
      
      setIsFollowing(response.siguiendo);
      setFollowerCount(response.totalFollowers);
      
      if (onFollowChange) {
        onFollowChange(response.siguiendo, response.totalFollowers);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggleFollow}
        disabled={loading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${isFollowing 
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
            : 'bg-red-600 text-white hover:bg-red-700'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFollowing ? (
          <>
            <UserMinus className="w-4 h-4" />
            <span>Siguiendo</span>
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            <span>Seguir</span>
          </>
        )}
      </button>
      
      {/* ✅ Mostrar contador de seguidores */}
      <span className="text-sm text-gray-600">
        {followerCount} {followerCount === 1 ? 'seguidor' : 'seguidores'}
      </span>
    </div>
  );
}