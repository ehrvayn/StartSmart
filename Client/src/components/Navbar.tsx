import { useDarkmode } from "../context/Darkmode";
import Logo from "../assets/img/StartSmartLogo.png";

function Navbar() {
  const { darkmode, setDarkmode } = useDarkmode();
  return (
    <nav
      className={`${darkmode ? "bg-[#2e2e2e] border-[#353535] " : "bg-[#1ce0af]"} w-full border-b sm:px-8 px-2 py-3 flex items-center justify-between`}
    >
      <div className="flex items-center gap-2">
        <img src={Logo} className="w-10"/>
        <span
          className={`${darkmode ? "text-[#1ce0af]" : "text-[#2e2e2e]"} text-xl font-bold `}
        >
          StartSmart
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`${darkmode ? "text-[#1ce0af]" : "text-[#2e2e2e]"} uppercase font-mono font-bold`}>
          darkmode
        </span>
        <button
          onClick={() => setDarkmode(!darkmode)}
          aria-label="Toggle Theme"
          className={`relative w-14 h-7 cursor-pointer rounded-full flex items-center px-1 shadow-inner transition-colors ${
            darkmode ? "bg-zinc-700" : "bg-zinc-200"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full shadow-md transform flex items-center justify-center text-[11px] transition-transform duration-300 ${
              darkmode ? "translate-x-7 bg-zinc-900" : "translate-x-0 bg-white"
            }`}
          >
            {darkmode ? "🌙" : "☀️"}
          </div>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
