"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import type { ComponentProps } from "react";

type PendingLinkProps = ComponentProps<typeof Link> & {
  pendingLabel?: string;
  idleLabel?: React.ReactNode;
};

export function PendingLink(props: PendingLinkProps) {
  return (
    <Suspense fallback={<PendingLinkFallback {...props} />}>
      <PendingLinkInner {...props} />
    </Suspense>
  );
}

function PendingLinkFallback({ children, idleLabel, pendingLabel: _pendingLabel, ...props }: PendingLinkProps) {
  return <Link {...props}>{idleLabel ?? children}</Link>;
}

function PendingLinkInner({
  children,
  className,
  onClick,
  pendingLabel = "Opening...",
  idleLabel,
  href,
  ...props
}: PendingLinkProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);
  const locationKey = useMemo(
    () => `${pathname}?${searchParams.toString()}`,
    [pathname, searchParams],
  );

  useEffect(() => {
    setPending(false);
  }, [locationKey]);

  return (
    <Link
      {...props}
      href={href}
      aria-disabled={pending}
      data-pending={pending ? "true" : undefined}
      className={`${className ?? ""} ${pending ? "pointer-events-none cursor-wait opacity-75" : ""}`}
      onClick={(event) => {
        if (pending) {
          event.preventDefault();
          return;
        }

        onClick?.(event);

        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target === "_blank"
        ) {
          return;
        }

        setPending(true);
      }}
    >
      {idleLabel ?? children}
      {pending ? (
        <span className="ml-2 inline-flex items-center justify-center gap-2 align-middle text-current">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
          <span>{pendingLabel}</span>
        </span>
      ) : null}
    </Link>
  );
}
