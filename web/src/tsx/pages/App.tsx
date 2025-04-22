import { useEffect, useState } from "react";
import HoloText from "../components/HoloText";
import Letters from "../components/Letters";
import { Localizations } from "../utils/Localizations";
import { GooglePlayButton, AppStoreButton } from "react-mobile-app-button";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import FeatureGrid from "../components/FeatureGrid";
import Footer from "../components/Footer";

export default function App() {
  const [isDarkMode, setDarkMode] = useState(true);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    document.body.classList.toggle("dark");
  };

  useEffect(() => {
    document.body.classList.add("dark");
  }, []);

  return (
    <div className="bg-transparent dark:text-platinum text-night h-full w-full flex flex-col justify-center">
      <div className="h-screen flex flex-col w-full justify-center">
        <HoloText className="text-9xl font-bold">Velox</HoloText>
        <div className="mx-auto">
          <p className="text-xl md:text-2xl dark:text-platinum text-night text-center font-bold w-90">
            {Localizations.description.split("\\")[0]}
          </p>
          <p className="text-xl md:text-2xl text-celtic_blue text-center font-bold ">
            {Localizations.description.split("\\")[1]}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 mx-auto mt-6 justify-center">
          <AppStoreButton
            width={190}
            theme={isDarkMode ? "dark" : "light"}
            url="https://apps.apple.com/us/app/id6744847060"
          />
          <GooglePlayButton
            width={190}
            theme={isDarkMode ? "dark" : "light"}
            url="https://play.google.com/store/apps/details?id=com.notaroomba.makinator"
          />
        </div>
        {/* <p className="my-4 mx-auto font-bold text-xs">
          (app store links coming soon)
        </p> */}
      </div>
      <div className="min-h-screen flex flex-col w-full justify-center">
        <HoloText className="text-9xl font-bold">
          {Localizations.features}
        </HoloText>
        <FeatureGrid />
      </div>
      <Footer />
      {/* <Credits /> */}
      <Letters />
      <div className="absolute top-2 right-2">
        <DarkModeSwitch
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size={40}
        />
      </div>
    </div>
  );
}
