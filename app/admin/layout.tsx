import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Admin — Analytics",
  robots: "noindex, nofollow", // Don't index this page
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#050508",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748b",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "14px",
          }}
        >
          Loading...
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
