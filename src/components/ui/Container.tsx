import type { ComponentPropsWithoutRef, ElementType } from "react";
import { containerClass, cx } from "./styles";

type ContainerProps<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

/** Page-width wrapper: max-w-[1440px] with responsive side gutters. */
export function Container<T extends ElementType = "div">({ as, className, ...rest }: ContainerProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return <Tag className={cx(containerClass, className)} {...rest} />;
}
