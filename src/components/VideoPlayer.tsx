import React from 'react';

interface VideoPlayerProps {
  videoHash: string;
  fallbackUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoHash, fallbackUrl }) => {
  // This component can be extended to handle IPFS video playback
  return (
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={fallbackUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      {/* Hidden video element for future IPFS implementation */}
      <video 
        className="hidden"
        controls
        data-ipfs-hash={videoHash}
      >
        <source type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoPlayer