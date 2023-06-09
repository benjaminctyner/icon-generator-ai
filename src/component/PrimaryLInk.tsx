import Link from "next/link";

export function PrimaryLink(
  props: React.ComponentPropsWithoutRef<"a"> & { href: string }
) {
  return (
    <Link className=" hover:bg-cyan-500" {...props}>
      {props.children}
    </Link>
  );
}
