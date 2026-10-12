import { useEffect, useRef, useState, type CSSProperties } from "react";
import logo from "@/assets/logo.png.asset.json";

const WORD = "Linen Line";
const HOLD = 2.6; // seconds the opening stays before it starts fading
const FADE = 0.7; // seconds the fade takes
const TOTAL = (HOLD + FADE) * 1000; // matches the introOut keyframe timing in styles.css

function unlock() {
  document.documentElement.classList.remove("is-intro");
}

// Opening screen: the monogram appears first, then "LINEN LINE" letter by letter,
// then the whole thing fades away. Runs once per full page load, not on in-app navigation.
export function Intro() {
  const [gone, setGone] = useState(false);
  const [skip, setSkip] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }
    root.classList.add("is-intro");
    const finish = () => {
      unlock();
      setGone(true);
    };
    // Remove the opening exactly when its fade ends; the timer is only a backstop.
    const el = ref.current;
    const anims: Animation[] = typeof el?.getAnimations === "function" ? el.getAnimations() : [];
    const anim = anims.find((a) => (a as { animationName?: string }).animationName === "introOut");
    if (anim?.playState === "finished") {
      finish();
      return () => unlock();
    }
    anim?.finished.then(finish).catch(() => {});
    const t = setTimeout(finish, Math.max(400, TOTAL + 900 - performance.now()));
    return () => {
      clearTimeout(t);
      unlock();
    };
  }, []);

  useEffect(() => {
    if (!skip) return;
    const t = setTimeout(() => {
      unlock();
      setGone(true);
    }, 450);
    return () => clearTimeout(t);
  }, [skip]);

  if (gone) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`intro${skip ? " is-skip" : ""}`}
      onClick={() => setSkip(true)}
    >
      <img src={logo.url} alt="" className="intro-logo" />
      <p dir="ltr" className="intro-word">
        {WORD.split("").map((ch, i) => (
          <span key={i} style={{ "--i": i } as CSSProperties}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </p>
    </div>
  );
}
