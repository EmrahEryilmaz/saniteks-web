import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { containerClass, cx } from "./styles";

export type HeroImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Classes for the <Image>; defaults to the live "h-auto w-full". */
  className?: string;
};

type PageHeroProps = {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  image?: HeroImage;
  /** Grid template of the two columns; live default is lg:grid-cols-[1.1fr_0.9fr] lg:gap-14. */
  gridClassName?: string;
  /** Extra content under the lead (buttons, meta). */
  children?: ReactNode;
  /** Extra classes on the image box, e.g. "hidden lg:block" to keep a page's main content close on phones. */
  imageWrapperClassName?: string;
};

/** Inner-page top band: breadcrumbs, eyebrow, h1#page-title, lead and an optional image. */
export function PageHero({ crumbs, eyebrow, title, lead, image, gridClassName, children, imageWrapperClassName }: PageHeroProps) {
  return (
    <section aria-labelledby="page-title" className="relative overflow-hidden border-b border-border bg-surface-strong">
      <div className={cx(containerClass, "py-7 md:py-9")}>
        <Breadcrumbs items={crumbs} />
        <div className={cx("grid items-center gap-8 py-5 md:py-7", gridClassName ?? "lg:grid-cols-[1.1fr_0.9fr] lg:gap-14")}>
          <div className="min-w-0">
            <p className="mb-5 border-l-2 border-primary pl-4 text-xs font-semibold tracking-widest text-link">{eyebrow}</p>
            <h1 id="page-title" className="text-4xl font-semibold leading-tight tracking-[-0.025em] break-words md:text-5xl lg:text-6xl">
              {title}
            </h1>
            {lead ? <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground md:text-lg md:leading-8">{lead}</p> : null}
            {children}
          </div>
          {image ? (
            <div className={cx("relative overflow-hidden rounded-sm border border-border", imageWrapperClassName)}>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                preload
                sizes="(min-width: 1440px) 620px, (min-width: 1024px) 42vw, 100vw"
                className={image.className ?? "h-auto w-full"}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
