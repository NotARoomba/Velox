import { Link } from "react-router-dom";
import { Localizations } from "../utils/Localizations";

export default function Credits() {
  return (
    <div className="absolute flex justify-center align-middle bottom-1 left-1/2 -translate-x-1/2 dark:text-platinum text-night  ">
      <Link
        className="h-min max-h-fit m-2 my-auto hover:underline text-center"
        to={`/policy_${Localizations.getLanguage()}.pdf`}
      >
        Privacy Policy
      </Link>
      <p className="m-2 my-auto">•</p>
      <p className="m-2 my-auto font-bold">NotARoomba</p>
      <p className="m-2 my-auto">•</p>
      <Link
        className="h-min max-h-fit m-2 my-auto hover:underline"
        to="https://github.com/NotARoomba/Velox"
      >
        GitHub
      </Link>
    </div>
  );
}
