import React from "react";
import { create } from "zustand";
import type { Song } from "@/types";
import { useChatStore } from "./useChatStore";

type PlayerStore = {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,

  initializeQueue: (songs) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },
  playAlbum: (songs, startIndex = 0) => {
    if (songs.length === 0) return;

    const socket = useChatStore.getState().socket;
    const song = songs[startIndex];

    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },
  setCurrentSong: (song) => {
    if (!song) return;

    const socket = useChatStore.getState().socket;

    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIndex = get().queue.findIndex((s) => s._id === song._id);

    set({
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
      currentSong: song,
      isPlaying: true,
      queue: songIndex === -1 ? [] : get().queue,
    });
  },
  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;
    const song = get().currentSong;

    const socket = useChatStore.getState().socket;

    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity:
          willStartPlaying && song
            ? `Playing ${song.title} by ${song.artist}`
            : "Idle",
      });
    }

    set({
      isPlaying: willStartPlaying,
    });
  },
  playNext: () => {
    const { currentIndex, queue } = get();
    const socket = useChatStore.getState().socket;

    const nextIdx = currentIndex + 1;
    let nextSong = null;

    if (nextIdx < queue.length) {
      set({
        currentSong: queue[nextIdx],
        currentIndex: nextIdx,
        isPlaying: true,
      });
      nextSong = queue[nextIdx];
    } else {
      set({ isPlaying: false });
    }

    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: nextSong
          ? `Playing ${nextSong.title} by ${nextSong.artist}`
          : "Idle",
      });
    }
  },
  playPrevious: () => {
    const { currentIndex, queue } = get();

    const socket = useChatStore.getState().socket;

    const nextIdx = currentIndex - 1;
    let nextSong = null;

    if (nextIdx >= 0) {
      set({
        currentSong: queue[nextIdx],
        currentIndex: nextIdx,
        isPlaying: true,
      });
      nextSong = queue[nextIdx];
    } else {
      set({ isPlaying: false });
    }

    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: nextSong
          ? `Playing ${nextSong.title} by ${nextSong.artist}`
          : "Idle",
      });
    }
  },
}));
