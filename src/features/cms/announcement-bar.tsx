"use client";

import Link from "next/link";
import type { AnnouncementBar as AnnouncementBarType } from "@/domain/types";

export function AnnouncementBar({
  announcement,
}: {
  announcement: AnnouncementBarType | null;
}) {
  if (!announcement?.active || !announcement.text) return null;

  const chip = (
    <span className="mx-6 inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] sm:mx-10 sm:text-[12px]">
      <span className="h-1 w-1 rounded-full bg-current opacity-70" />
      {announcement.text}
      <span className="h-1 w-1 rounded-full bg-current opacity-70" />
    </span>
  );

  const row = (
    <div className="flex min-w-full shrink-0 items-center justify-around">
      {Array.from({ length: 4 }).map((_, i) =>
        announcement.link ? (
          <Link
            key={i}
            href={announcement.link}
            target={announcement.linkTarget}
            className="hover:opacity-90"
          >
            {chip}
          </Link>
        ) : (
          <span key={i}>{chip}</span>
        ),
      )}
    </div>
  );

  return (
    <div
      className="relative z-[60] overflow-hidden py-2.5"
      style={{
        backgroundColor: announcement.backgroundColor,
        color: announcement.textColor,
      }}
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row}
        <div aria-hidden className="flex min-w-full shrink-0 items-center justify-around">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>{chip}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
