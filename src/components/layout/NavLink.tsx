import Link from "next/link";

type NavLinkProps = {
  link: { path: string; label: string };
};

export default function NavLink({ link }: NavLinkProps) {
  return (
    <Link href={link.path}>
      <span>{link.label}</span>
    </Link>
  );
}
