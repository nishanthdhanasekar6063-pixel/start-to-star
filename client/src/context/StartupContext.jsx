import { createContext, useState } from "react";

export const StartupContext = createContext();

function StartupProvider({ children }) {
  const [startup, setStartup] = useState({
    startupName: "",
    founder: "",
    email: "",
    industry: "",
    funding: "",
    description: "",
    website: "",
  });

  return (
    <StartupContext.Provider value={{ startup, setStartup }}>
      {children}
    </StartupContext.Provider>
  );
}

export default StartupProvider;