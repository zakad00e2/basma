import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import Lenis from "lenis";

// Smooth scroll (Lenis) + scroll-reveal for any element with data-reveal.
export function Motion() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    let id = 0;
    const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }),
      { threshold: 0.12 },
    );
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      timer = setTimeout(() => document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => io.observe(el)), 50);
    };
    // Hold the scroll-reveal until the opening screen is gone, so the page animates in after it.
    let mo: MutationObserver | undefined;
    if (document.documentElement.classList.contains("is-intro")) {
      mo = new MutationObserver(() => {
        if (!document.documentElement.classList.contains("is-intro")) { mo?.disconnect(); start(); }
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    } else {
      start();
    }
    return () => { clearTimeout(timer); mo?.disconnect(); io.disconnect(); };
  }, [path]);
  return null;
}
