import { navLinks } from "@/src/lib/constants/navLinks";
import NavLink from "./NavLink";

export default function AppNav() {
  return (
    <nav>
      <ul className="flex space-x-10">
        {navLinks.map((link) => (
          <NavLink key={link.path} link={link} />
        ))}
      </ul>
    </nav>
  );
}
