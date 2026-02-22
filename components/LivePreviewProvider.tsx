"use client";
import { useEffect } from "react";
import { initLivePreview } from "../lib/contentstack/sdk";

export default function LivePreviewProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initLivePreview();
  }, []);

  return <>{children}</>;
}
