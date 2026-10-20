import { useEffect, useState } from "react";
export type Route = "home" | "catalog" | "account" | "about" | "checkout";
function read(): Route {
  const r = location.hash.slice(1);
  return ["catalog", "account", "about", "checkout"].includes(r)
    ? (r as Route)
    : "home";
}
export function useRoute() {
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const cb = () => {
      setRoute(read());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", cb);
    return () => window.removeEventListener("hashchange", cb);
  }, []);
  return route;
}
export function navigate(route: Route) {
  location.hash = route === "home" ? "" : route;
}
