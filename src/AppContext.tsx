import React, { createContext, useContext, useState } from 'react';

export type Photo = { uri: string; takenAt: string };
export type Place = { lat: number; lng: number; label: string; at: string };

type Ctx = {
  photos: Photo[];
  addPhoto: (p: Photo) => void;
  removePhoto: (uri: string) => void;
  place: Place | null;
  setPlace: (p: Place) => void;
};

const AppContext = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [place, setPlace] = useState<Place | null>(null);
  return (
    <AppContext.Provider
      value={{
        photos,
        addPhoto: (p) => setPhotos((prev) => [p, ...prev]),
        removePhoto: (uri) => setPhotos((prev) => prev.filter((x) => x.uri !== uri)),
        place,
        setPlace,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
