// Sans IntersectionObserver ou avec « réduire les animations », tout reste visible.
export default class RevealOnScroll {
  #elements;
  #observateur = null;

  constructor(elements) {
    this.#elements = [...elements];
  }

  init() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js-reveal');
    this.#observateur = new IntersectionObserver(
      (entrees) => this.#reveler(entrees),
      { rootMargin: '0px 0px -10% 0px' },
    );
    this.#elements.forEach((element) => this.#observateur.observe(element));
  }

  #reveler(entrees) {
    for (const entree of entrees) {
      if (!entree.isIntersecting) continue;
      entree.target.classList.add('est-visible');
      this.#observateur.unobserve(entree.target);
    }
  }
}
