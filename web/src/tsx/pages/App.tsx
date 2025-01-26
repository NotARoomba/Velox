import Credits from "../components/Credits";
import HoloText from "../components/HoloText";
import Letters from "../components/Letters";
import { Localizations } from "../utils/Localizations";
// import { GooglePlayButton, AppStoreButton } from "react-mobile-app-button";

export default function App() {
  return (
    <div className="bg-transparent dark:text-platinum text-night h-screen w-full flex flex-col justify-center">
      <HoloText className="text-9xl font-bold">Velox</HoloText>
      <div className="mx-auto">
        <p className="text-2xl dark:text-platinum text-night text-center font-bold w-90">
          {Localizations.description.split("\\")[0]}
        </p>
        <p className="text-2xl text-celtic_blue text-center font-bold ">
          {Localizations.description.split("\\")[1]}
        </p>
      </div>
      {/* <div className="flex gap-x-8">
        <AppStoreButton url="" />
        <GooglePlayButton url="" />
      </div> */}
      <p className="my-4 mx-auto font-bold text-xs">
        (free download coming soon)
      </p>
      <Credits />
      <Letters />
    </div>
  );
}
