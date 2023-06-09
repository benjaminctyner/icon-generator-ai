import clsx from "clsx";

export function FormGroup(props: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx("gap gap flex flex-col gap-2", props.className)}
    >
      {props.children}
    </div>
  );
}
