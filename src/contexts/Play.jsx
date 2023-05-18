import { createContext, useContext, useState } from "react";

const Context = createContext();

export const PlayProvider = ({ children }) => {
  const [play, setPlay] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  return (
    <Context.Provider
      value={{
        play,
        setPlay,
        hasScroll,
        setHasScroll,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export const usePlay = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("usePlay must be used with");
  }
  return context;
};
