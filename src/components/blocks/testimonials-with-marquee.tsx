import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card";

interface TestimonialsSectionProps {
  title: string;
  description: string;
  testimonials: Array<{
    author: TestimonialAuthor;
    text: string;
    href?: string;
  }>;
  className?: string;
}

/**
 * Testimonials marquee section (21st.dev "testimonials-with-marquee").
 *
 * Renders two identical, adjacent tracks that each scroll left by their own
 * full width (`translateX(calc(-100% - var(--gap)))`), then loop. Because the
 * two tracks are identical and side-by-side, the crossfade is seamless.
 *
 * NOTE: the reference snippet nested `[...Array(4)].map(() => testimonials.map(…))`,
 * which produces arrays-of-arrays (React key warnings) and does not loop
 * cleanly. This version uses the canonical two-track marquee instead.
 */
export function TestimonialsSection({
  title,
  description,
  testimonials,
  className,
}: TestimonialsSectionProps) {
  return (
    <section
      className={cn(
        "text-foreground",
        "py-12 sm:py-24 md:py-32 px-0",
        className
      )}
    >
      <div className="mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight">
            {title}
          </h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:40s]">
            {Array.from({ length: 2 }).map((_, trackIndex) => (
              <div
                key={trackIndex}
                aria-hidden={trackIndex > 0}
                className="flex min-w-full shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]"
              >
                {testimonials.map((testimonial, i) => (
                  <Fragment key={`${trackIndex}-${i}`}>
                    <TestimonialCard
                      author={testimonial.author}
                      text={testimonial.text}
                      href={testimonial.href}
                    />
                  </Fragment>
                ))}
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background sm:block" />
        </div>
      </div>
    </section>
  );
}
