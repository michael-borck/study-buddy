import { ComponentPropsWithoutRef } from "react";

export function GradCapIcon(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3z" />
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
    </svg>
  );
}
