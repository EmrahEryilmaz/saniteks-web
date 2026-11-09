"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { focusStyle } from "@/components/ui/styles";
import { Reveal } from "./Reveal";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  /** "\n" marks the intended line break (rendered with whitespace-pre-line). */
  title: string;
  description: string;
  /** position = object-position classes; defaults to the live "object-[62%_center] lg:object-center". */
  image: { src: string; alt: string; position?: string };
  action: { href: string; label: string };
};

type HeroSliderProps = {
  /** Visually hidden page heading (h1). */
  title: string;
  slides: HeroSlide[];
};

/** UI strings — verbatim from the live site's slider dictionary. */
const messages = {
  role: "Slayt gösterisi",
  slide: "Slayt",
  previous: "Önceki slayt",
  next: "Sonraki slayt",
  pause: "Otomatik geçişi durdur",
  play: "Otomatik geçişi başlat",
  reduced: "Hareket azaltma tercihi nedeniyle otomatik geçiş kapalı",
  pagination: "Slayt seçimi",
  goTo: "Slayta git:",
  position: "{{index}} / {{slidesLength}}",
  explore: "Saniteks’i keşfedin",
} as const;

/** Live values: 350 ms slide transition, 6 s autoplay delay, rewind (not loop). */
const SPEED = 350;
const MODULES = [A11y, Autoplay];
const AUTOPLAY = { enabled: false, delay: 6000, disableOnInteraction: true };
const A11Y = {
  enabled: true,
  containerRole: "group",
  itemRoleDescriptionMessage: messages.slide,
  slideLabelMessage: messages.position,
  wrapperLiveRegion: false,
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
/** The server cannot know the preference, so it renders the safe (no autoplay) state — as the live site does. */
const getServerReducedMotion = () => true;

const controlClass = `inline-flex size-11 shrink-0 items-center justify-center border border-primary-foreground/30 text-primary-foreground transition-colors hover:bg-primary active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${focusStyle} focus-visible:outline-primary-foreground`;

const pad = (n: number) => String(n).padStart(2, "0");

export function HeroSlider({ title, slides }: HeroSliderProps) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const reducedRef = useRef(true);
  const hoverRef = useRef(false);
  const wantsPlayRef = useRef(false);
  /** Instance autoplay was started for — keyed by instance so a re-created Swiper (Strict Mode) starts too. */
  const autoStartedRef = useRef<SwiperClass | null>(null);

  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerReducedMotion);
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState(0);
  const [failedImages, setFailedImages] = useState<ReadonlySet<string>>(() => new Set());

  const setProgress = (value: number | null) => {
    const bar = progressRef.current;
    if (!bar) return;
    // The bar carries Tailwind's `scale-x-0` (CSS `scale` property), so drive `scale` — not `transform` —
    // or the two would multiply and the bar would never grow.
    bar.style.scale = value === null ? "" : `${Math.max(0, Math.min(1, value))} 1`;
  };

  // Apply the motion preference; start autoplay once on mount when motion is allowed.
  useEffect(() => {
    reducedRef.current = reduced;
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;
    swiper.params.speed = reduced ? 0 : SPEED;
    if (reduced) {
      swiper.autoplay.stop();
      swiper.transitionEnd();
      swiper.wrapperEl.getAnimations().forEach((animation) => animation.cancel());
      return;
    }
    if (autoStartedRef.current === swiper) return;
    autoStartedRef.current = swiper;
    if (slides.length > 1 && !sectionRef.current?.matches(":focus-within")) swiper.autoplay.start();
  }, [reduced, slides.length]);

  // Leaving the tab stops the rotation for good (live behaviour).
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) swiperRef.current?.autoplay.stop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const stop = () => {
    swiperRef.current?.autoplay.stop();
  };

  const go = (direction: "next" | "previous") => {
    stop();
    if (direction === "next") swiperRef.current?.slideNext();
    else swiperRef.current?.slidePrev();
  };

  const onMouseEnter = () => {
    hoverRef.current = true;
    const autoplay = swiperRef.current?.autoplay;
    if (autoplay?.running) autoplay.pause();
  };

  const onMouseLeave = () => {
    hoverRef.current = false;
    const autoplay = swiperRef.current?.autoplay;
    if (autoplay?.running && autoplay.paused) autoplay.resume();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    go(event.key === "ArrowRight" ? "next" : "previous");
  };

  const current = slides[active];
  const status = current ? `${messages.slide} ${active + 1} / ${slides.length}: ${current.title.replace(/\s*\n\s*/g, " ")}` : "";

  return (
    <section
      ref={sectionRef}
      id="hero-slider"
      aria-labelledby="hero-title"
      aria-roledescription={messages.role}
      tabIndex={0}
      onFocusCapture={stop}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      className={`relative isolate min-w-0 scroll-mt-0 overflow-hidden bg-foreground text-primary-foreground ${focusStyle}`}
    >
      <h1 id="hero-title" className="sr-only">
        {title}
      </h1>
      <Swiper
        modules={MODULES}
        slidesPerView={1}
        rewind
        speed={reduced ? 0 : SPEED}
        autoplay={AUTOPLAY}
        a11y={A11Y}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActive(swiper.activeIndex);
          setProgress(null);
        }}
        onTouchStart={stop}
        onAutoplayTimeLeft={(_swiper, _timeLeft, percentage) => {
          if (!reducedRef.current) setProgress(1 - percentage);
        }}
        onAutoplayStart={(swiper) => {
          setRunning(true);
          if (hoverRef.current) swiper.autoplay.pause();
        }}
        onAutoplayResume={(swiper) => {
          if (hoverRef.current) swiper.autoplay.pause();
        }}
        onAutoplayStop={() => {
          setRunning(false);
          setProgress(null);
        }}
        className="w-full [&_.swiper-wrapper]:items-stretch [&_.swiper-slide]:h-auto motion-reduce:[&_.swiper-wrapper]:transition-none!"
      >
        {slides.map((slide, index) => {
          const isActive = index === active;
          return (
            <SwiperSlide key={slide.id} aria-hidden={!isActive} inert={!isActive}>
              <div className="relative flex h-full min-h-[660px] items-center overflow-hidden pt-40 pb-32 md:min-h-[700px] md:pt-44 lg:min-h-[74svh] lg:pt-44 lg:pb-28">
                {slide.image.src && !failedImages.has(slide.id) ? (
                  <Reveal active={isActive} observe={false} kind="image" className="absolute inset-0">
                    <Image
                      src={slide.image.src}
                      alt={slide.image.alt}
                      fill
                      sizes="100vw"
                      preload={index === 0}
                      className={`object-cover ${slide.image.position ?? "object-[62%_center] lg:object-center"}`}
                      onError={() => setFailedImages((prev) => new Set(prev).add(slide.id))}
                    />
                  </Reveal>
                ) : null}
                <div aria-hidden="true" className="absolute inset-0 bg-overlay/30" />
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-foreground/45" />
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-full border-r border-primary-foreground/15 bg-foreground/50 lg:w-[54%]"
                />
                <Container className="relative">
                  <Reveal active={isActive} observe={false} className="max-w-xl">
                    <p className="mb-5 flex items-center gap-4 text-[10px] font-semibold tracking-[0.2em] before:h-px before:w-10 before:bg-primary md:text-xs">
                      {slide.eyebrow}
                    </p>
                    <h2 className="max-w-[18ch] whitespace-pre-line text-4xl font-semibold leading-[1.12] tracking-[-0.025em] md:text-5xl lg:text-6xl">
                      {slide.title}
                    </h2>
                    <div className="mt-6 max-w-md">
                      <p className="max-w-sm text-base leading-7 text-primary-foreground/90">{slide.description}</p>
                      <ButtonLink
                        href={slide.action.href}
                        tabIndex={isActive ? 0 : -1}
                        className="mt-6 focus-visible:outline-primary-foreground"
                      >
                        {slide.action.label}
                      </ButtonLink>
                    </div>
                  </Reveal>
                </Container>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-primary-foreground/25 bg-foreground/85">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-primary-foreground/15">
            <span ref={progressRef} className="block h-full origin-left scale-x-0 bg-primary" />
          </div>
          <Container className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 py-3 md:gap-x-4 md:py-4">
            <div className="flex flex-col items-start gap-0 md:flex-row md:items-center md:gap-8">
              <p aria-hidden="true" className="flex items-baseline gap-2 font-light tabular-nums">
                <span className="text-xl md:text-2xl">{pad(active + 1)}</span>
                <span className="text-xs text-primary-foreground/65">/ {pad(slides.length)}</span>
              </p>
              <p className="sr-only" aria-live={running ? "off" : "polite"} aria-atomic="true">
                {status}
              </p>
              <div role="group" aria-label={messages.pagination} className="flex items-center">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => {
                      stop();
                      swiperRef.current?.slideTo(index);
                    }}
                    aria-label={`${messages.goTo} ${index + 1}`}
                    aria-current={active === index ? "true" : undefined}
                    className={`flex size-11 items-center justify-center ${focusStyle} hover:bg-primary-foreground/10 focus-visible:outline-primary-foreground`}
                  >
                    <span className={`h-0.5 w-4 md:w-7 ${active === index ? "bg-primary-foreground" : "bg-primary-foreground/40"}`} />
                  </button>
                ))}
              </div>
            </div>
            <Link
              href="/#kurumsal"
              className={`hidden min-h-11 items-center gap-8 text-xs tracking-wide lg:inline-flex ${focusStyle} hover:underline`}
            >
              {messages.explore}
              <span aria-hidden="true">↓</span>
            </Link>
            <div className="flex items-center gap-1 md:gap-2">
              <button
                type="button"
                className={controlClass}
                aria-label={reduced ? messages.reduced : running ? messages.pause : messages.play}
                disabled={reduced}
                onPointerDown={() => {
                  // Focusing the button stops autoplay (onFocusCapture) before the click lands,
                  // so remember what a pointer user intended at press time.
                  wantsPlayRef.current = !running;
                }}
                onClick={(event) => {
                  const shouldPlay = event.detail > 0 ? wantsPlayRef.current : !running;
                  if (!shouldPlay) stop();
                  else if (!reducedRef.current) swiperRef.current?.autoplay.start();
                }}
              >
                <span aria-hidden="true">{running ? "Ⅱ" : "▷"}</span>
              </button>
              <button type="button" className={controlClass} aria-label={messages.previous} onClick={() => go("previous")}>
                <span aria-hidden="true" className="text-xl">
                  ←
                </span>
              </button>
              <button type="button" className={controlClass} aria-label={messages.next} onClick={() => go("next")}>
                <span aria-hidden="true" className="text-xl">
                  →
                </span>
              </button>
            </div>
          </Container>
        </div>
      ) : null}
    </section>
  );
}
