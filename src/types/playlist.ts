
export interface HermeticTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  duration: number; // in seconds
  tags: string[];
  chakra: string;
  principle: string;
}

export interface HermeticPlaylist {
  id: string;
  principle: string;
  tracks: HermeticTrack[];
}
