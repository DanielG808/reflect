import NavLink from "./NavLink";

const navLinks = [
  {
    path: "/entries",
    label: "Entries",
  },
  {
    path: "/new",
    label: "New Entry",
  },
];

export default function AppNav() {
  return (
    <nav className="flex space-x-10">
      {navLinks.map((link) => (
        <NavLink key={link.path} link={link} />
      ))}
    </nav>
  );
}
