import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Slider } from "@/components/ui/slider";
import {
  Laptop2,
  ListMusic,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { currentSong, playPrevious, togglePlay, isPlaying, playNext } =
    usePlayerStore();

  useEffect(() => {
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;

    if (!audio) return;

    function updateTime() {
      setCurrentTime(audio!.currentTime);
    }

    function updateDuration() {
      setDuration(audio!.duration);
    }

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const handleSeek = (value: number | readonly number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime =
        typeof value === "number" ? value : value[0];
    }
  };

  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
        <div className="hidden sm:flex items-center gap-4 min-w-45 w-[30%]">
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt=""
                className="w-14 h-14 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate hover:underline cursor-pointer">
                  {currentSong.title}
                </div>
                <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
            >
              <Shuffle className="h-4 aspect-square" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className="h-4 aspect-square" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:bg-white/80 text-black rounded-full bg-white h-8 aspect-square"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="h-5 aspect-square" />
              ) : (
                <Play className="h-5 aspect-square" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className="h-4 aspect-square" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
            >
              <Repeat className="h-4 aspect-square" />
            </Button>
          </div>
          <div className="hidden sm:flex items-center gap-2 w-full">
            <div className="text-xs text-zinc-400">
              {formatTime(currentTime)}
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="w-full hover:cursor-grab active:cursor-grabbing"
              onValueChange={handleSeek}
            />
            <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 min-w-45 w-[30%] justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="hover:text-white text-zinc-400"
          >
            <Mic2 className="w-4 aspect-square" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="hover:text-white text-zinc-400"
          >
            <ListMusic className="h-4 aspect-square" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
            >
              <Volume1 className="h-4 aspect-square" />
            </Button>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="w-24! hover:cursor-grab active:cursor-grabbing"
              onValueChange={(value) => {
                const newVol = typeof value === "number" ? value : value[0];
                setVolume(newVol);
                if (audioRef.current) {
                  audioRef.current.volume = newVol / 100;
                }
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
