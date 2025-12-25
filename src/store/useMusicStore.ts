import { create } from 'zustand';

export interface Track {
  id: string;
  name: string;
  artist_name: string;
  image: string;
  audio: string;
  duration: number;
}

interface MusicState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  volume: number;
  currentTime: number;
  
  // Actions
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  addToQueue: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  volume: 1, // 0 to 1
  currentTime: 0,

  playTrack: (track) => {
    const { currentTrack, queue } = get();
    // If playing the same track, just ensure playing
    if (currentTrack?.id === track.id) {
       set({ isPlaying: true });
       return;
    }
    
    // Add to queue if not empty and not in queue? 
    // For simplicity, if we play a track from a list, we might want to set the context (queue).
    // For now, let's just set the playing track.
    set({ currentTrack: track, isPlaying: true });
  },

  pauseTrack: () => set({ isPlaying: false }),
  
  resumeTrack: () => set({ isPlaying: true }),

  nextTrack: () => {
    const { currentTrack, queue } = get();
    if (!currentTrack || queue.length === 0) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      set({ currentTrack: queue[nextIndex], isPlaying: true });
    } else {
        // Option: Loop back to start or stop? Let's stop for now or loop if we add repeat mode.
        set({ isPlaying: false });
    }
  },

  prevTrack: () => {
    const { currentTrack, queue } = get();
    if (!currentTrack || queue.length === 0) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      set({ currentTrack: queue[prevIndex], isPlaying: true });
    }
  },

  setVolume: (volume) => set({ volume }),
  
  setCurrentTime: (currentTime) => set({ currentTime }),
  
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  
  setQueue: (tracks) => set({ queue: tracks }),
}));
