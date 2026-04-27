import { useDarkmode } from "../context/Darkmode";

function Footer() {
  const { darkmode } = useDarkmode();
  return (
    <footer className={`${darkmode ? "bg-[#202020] border-[#353535]" : "bg-white border-gray-200"} w-full border-t px-8 py-4 flex items-center justify-center`}>
      <span className={`${darkmode ? "text-gray-400" : "text-gray-600"} text-[12px] sm:text-sm`}>
        © All rights reserved | StartSmart 2026
      </span>
    </footer>
  );
}

export default Footer;
