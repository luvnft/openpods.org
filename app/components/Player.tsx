import { useEffect, useRef, useState } from 'react';

interface PlayerProps {
  audioUrl: string;
  name: string;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  setPlayerEnabled: (value: boolean) => void; // Make sure it's defined in the interface
}

export default function Player({audioUrl,name,isPlaying,setIsPlaying,setPlayerEnabled,}: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const storedIsPlaying = localStorage.getItem('playerIsPlaying');
    if (storedIsPlaying) {
      setIsPlaying(storedIsPlaying === 'true');
    }

    const storedCurrentTime = localStorage.getItem('playerCurrentTime');
    if (storedCurrentTime) {
      setCurrentTime(parseFloat(storedCurrentTime));
    }
  }, [setIsPlaying]);

  useEffect(() => {
    localStorage.setItem('playerIsPlaying', isPlaying.toString());
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current!.duration);
        setIsLoading(false);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current!.currentTime);
        localStorage.setItem('playerCurrentTime', audioRef.current!.currentTime.toString());
      };

      const handleSeeked = () => {
        setIsLoading(false);
      };

      const handlePlay = () => {
        setIsPlaying(true);
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      const audioElement = audioRef.current;
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('seeked', handleSeeked);
      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);

      return () => {
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('seeked', handleSeeked);
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(error => {
          console.error('Error playing the audio:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setPlayerEnabled(false); // Set playerEnabled to false to hide the player
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      setIsLoading(true);
      audioRef.current.currentTime = parseFloat(event.target.value);
      setCurrentTime(parseFloat(event.target.value));
    }
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [
      h > 0 ? h : null,
      m > 0 ? (h > 0 && m < 10 ? '0' + m : m) : '00',
      s < 10 ? '0' + s : s
    ].filter(Boolean).join(':');
  };

  return (
    <>
      <section className="fixed bottom-0 left-0 right-0 bg-slate-900">
        <audio src={audioUrl} ref={audioRef} preload="metadata" autoPlay></audio>
        <div className="flex flex-row justify-between pt-3">
          <div className="flex place-items-end pb-1 pl-2">
            <h1 className="font-bold">{name}</h1>
          </div>
          <button className="btn btn-circle ml-2 mr-2 btn-xs btn-primary text-white" onClick={handleClose}>
            X
          </button>
        </div>
        <div className="flex justify-center">
          <input
            type='range'
            min="0"
            value={currentTime}
            max={duration}
            className="range range-primary range-md ml-3 mr-3"
            onChange={handleSliderChange}
          />
        </div>
        <div className="flex flex-row justify-between">
          <p className="ml-3 opacity-50">{formatDuration(currentTime)}</p>
          <p className="mr-3 opacity-50">{formatDuration(duration)}</p>
        </div>
        <div className="flex justify-center">
          {isLoading ? (<section className="flex mb-3 mt-2 justify-center"><div className="loading loading-spinner bg-white loading-lg"></div></section>)
          : (
            <div onClick={togglePlayPause}>
              {isPlaying ? (
                <button className="btn btn-circle bg-white mb-3 hover:bg-white">
                  <svg fill="#000000" height="24" width="24" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.607 47.607">
                    <g>
                      <path d="M17.991,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C4.729,2.969,7.698,0,11.36,0
                        l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z"/>
                      <path d="M42.877,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631
                        C29.616,2.969,32.585,0,36.246,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z"/>
                    </g>
                  </svg>
                </button>
              ) : (
                <button className="btn btn-circle bg-white mb-3 hover:bg-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                    <path d="M3 22V2l18 10-18 10z"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
