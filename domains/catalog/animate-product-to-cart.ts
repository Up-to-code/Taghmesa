import gsap from "gsap";

const FLIGHT_SIZE = 54;

function findVisibleCartTarget() {
  const candidates = document.querySelectorAll<HTMLElement>(".mobile-cart-action, .cart-button");
  return Array.from(candidates).find((candidate) => {
    const rect = candidate.getBoundingClientRect();
    const style = window.getComputedStyle(candidate);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  });
}

export function animateProductToCart(source: HTMLElement | null, quantity: number) {
  if (!source || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = findVisibleCartTarget();
  if (!target) return;

  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const flight = document.createElement("span");
  flight.className = "global-cart-flight";
  flight.style.left = `${sourceRect.left + sourceRect.width / 2 - FLIGHT_SIZE / 2}px`;
  flight.style.top = `${sourceRect.top + sourceRect.height / 2 - FLIGHT_SIZE / 2}px`;

  const image = source.querySelector("img");
  if (image) {
    const thumbnail = image.cloneNode() as HTMLImageElement;
    thumbnail.removeAttribute("width");
    thumbnail.removeAttribute("height");
    flight.append(thumbnail);
  } else {
    const emoji = document.createElement("span");
    emoji.textContent = source.textContent?.trim() ?? "";
    flight.append(emoji);
  }

  const count = document.createElement("i");
  count.textContent = String(quantity);
  flight.append(count);
  document.body.append(flight);

  const x = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const y = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

  gsap.timeline({
    onComplete: () => flight.remove(),
    onInterrupt: () => flight.remove(),
  })
    .fromTo(flight,
      { autoAlpha: 0, x: 0, y: 12, scale: .62, rotate: 0 },
      { autoAlpha: 1, x: 0, y: 0, scale: 1.04, rotate: -2, duration: .13, ease: "power2.out" },
    )
    .to(flight, { x: x * .78, y: y * .78 - 18, scale: .46, rotate: -8, duration: .47, ease: "power2.inOut" })
    .to(flight, { autoAlpha: 0, x, y, scale: .18, rotate: -10, duration: .18, ease: "power2.in" })
    .to(target, { scale: 1.12, duration: .12, ease: "power2.out" }, "-=.1")
    .to(target, { scale: 1, duration: .16, ease: "power2.inOut", clearProps: "transform" });
}
