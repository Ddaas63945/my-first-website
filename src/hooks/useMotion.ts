import { useEffect, useState } from "react";
import { useShop } from "../store/shop";
export function useReducedMotion() {
  const setting = useShop((s) => s.reducedEffects);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(q.matches);
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  return reduced || setting;
}
