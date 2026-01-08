import Link from "next/link";

type NavLinkProps = {
  link: { path: string; label: string };
};

export default function NavLink({ link }: NavLinkProps) {
  return (
    <li>
      <Link href={link.path}>
        <span className="hover:text-accent-dark">{link.label}</span>
      </Link>
    </li>
  );
}
