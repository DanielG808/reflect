import Link from "next/link";

export default function AuthFormToggle() {
  return (
    <div className="flex justify-between text-xs">
      <p>Already have an account?</p>
      <Link href={"/signup"} className="hover:underline">
        Sign up
      </Link>
    </div>
  );
}
