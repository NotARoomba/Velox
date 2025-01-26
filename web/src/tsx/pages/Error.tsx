import { Link } from "react-router-dom";
import Letters from "../components/Letters";
import { Localizations } from "../utils/Localizations";

export default function Error() {
  return (
    <div className="flex  flex-col h-screen w-screen justify-center overflow-y-hidden bg-transparent gap-8 my-auto ">
      <p className="text-center w-full text-9xl dark:text-platinum text-night font-bold mb-0 font-sans">
        404
      </p>
      <Link
        to="/"
        className="text-2xl text-center justify-center font-bold mx-auto bg-celtic_blue text-platinum hover:bg-celtic_blue/75 hover:cursor-pointer transition-all duration-300 p-3 px-5 min-w-56 w-56 rounded-xl"
      >
        {Localizations.home}
      </Link>
      <Letters />
    </div>
  );
}
