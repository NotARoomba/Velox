import { Github, Mail, Globe, ShieldCheck } from "lucide-react";
import { Localizations } from "../utils/Localizations";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center gap-4 p-6 text-center text-night dark:text-platinum">
      <div className="flex items-center gap-2 text-lg font-bold">
        <img src="/icon.png" className="w-6 rounded" />
        <span>Velox</span>
      </div>

      <div className="flex gap-6">
        <a
          href="https://github.com/NotARoomba/Velox"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={Localizations.github}
        >
          <Github size={24} />
        </a>
        <a
          href="mailto:notaroomba.dev@gmail.com"
          aria-label={Localizations.email}
        >
          <Mail size={24} />
        </a>
        <a
          href="https://notaroomba.dev"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={Localizations.website}
        >
          <Globe size={24} />
        </a>
        <a
          href={`https://velox.notaroomba.dev/policy_${Localizations.getLanguage()}.pdf`}
          aria-label={Localizations.privacyPolicy}
        >
          <ShieldCheck size={24} />
        </a>
      </div>

      <p className="text-sm opacity-70">
        © {new Date().getFullYear()} NotARoomba.{" "}
        {Localizations.allRightsReserved}
      </p>
    </footer>
  );
}
