import React, { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";

function VideoCarousel() {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });
  const [loadedData, setLoadedData] = useState([]);

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  function handleProcess(type, i) {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;
      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;
      case "video-reset":
        setVideo((pre) => ({ ...pre, isLastVideo: false, videoId: 0 }));
        break;
      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: true }));
        break;
      case "pause":
        setVideo((pre) => ({
          ...pre,
          isPlaying: false,
          videoId: i ?? pre.videoId,
        }));
        break;
      default:
        return video;
    }
  }

  function handleLoadedMetaData(i, e) {
    setLoadedData((pre) => [...pre, e]);
  }

  useGSAP(
    () => {
      gsap.to("#slider", {
        transform: `translateX(${-100 * videoId}%)`,
        duration: 2,
        ease: "power2.inOut",
      });

      gsap.to("#video", {
        scrollTrigger: {
          trigger: "#video",
          toggleActions: "restart none none none",
        },
        onComplete: () => {
          setVideo((pre) => ({ ...pre, startPlay: true, isPlaying: true }));
        },
      });
    },
    {
      dependencies: [isEnd, videoId],
    },
  );

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else if (startPlay) {
        videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  useEffect(() => {
    if (!startPlay) return;
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      //anmate the progress of the video
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);

          if (progress !== currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                    ? "10vw"
                    : "4vw",
            });
          }

          gsap.to(span[videoId], {
            width: `${currentProgress}%`,
            backgroundColor: "white",
          });
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], { backgroundColor: "#afafaf" });
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration,
        );
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]);

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center overflow-hidden rounded-3xl  bg-black">
                <video
                  id="video"
                  playsInline
                  preload="auto"
                  muted
                  ref={(ref) => {
                    videoRef.current[i] = ref;
                  }}
                  className={`${list.id === 2 && "translate-x-44"} pointer-events-none`}
                  onEnded={() => {
                    if (i !== hightlightsSlides.length - 1) {
                      handleProcess("video-end", i);
                    } else {
                      handleProcess("video-last");
                    }
                  }}
                  onPlay={() => {
                    setVideo((pre) => ({ ...pre, isPlaying: true }));
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((txt) => (
                  <p key={txt} className="md:text-2xl text-xl font-medium">
                    {txt}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {hightlightsSlides.map((_, i) => (
            <span
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
              className="relative mx-2 w-3 h-3 bg-gray-200 rounded-full cursor-pointer"
              onClick={() => {
                handleProcess("pause", i);
              }}
            >
              <span
                className="absolute rounded-full w-full h-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              ></span>
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt=""
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                  ? () => handleProcess("play")
                  : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
}

export default VideoCarousel;
