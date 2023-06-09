import clsx from "clsx";
import Link from "next/link";

export function PrimaryLinkButton(
  props: React.ComponentPropsWithoutRef<"a"> & {
    href: string;
    className?: string;
  }
) {
  const { className, ...propsWithoutClassname } = props;
  return (
    <Link
      className={clsx(
        "self-end rounded bg-blue-400 px-4 py-2 hover:bg-blue-500",
        className ?? ""
      )}
      {...propsWithoutClassname}
    >
      {props.children}
    </Link>
  );
}
