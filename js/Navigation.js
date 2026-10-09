// Menu burger : sans JavaScript, la liste de liens reste visible.
export default class Navigation {
  #nav;
  #bouton;
  #liste;

  constructor(nav) {
    this.#nav = nav;
    this.#bouton = nav.querySelector('.nav__bouton');
    this.#liste = nav.querySelector('.nav__liste');
  }

  init() {
    if (!this.#bouton || !this.#liste) return;
    this.#nav.classList.add('nav--active');
    this.#bouton.hidden = false;
    this.#bouton.addEventListener('click', () => this.toggle());
    this.#nav.addEventListener('keydown', (evenement) => {
      if (evenement.key === 'Escape' && this.#estOuvert()) {
        this.close();
        this.#bouton.focus();
      }
    });
    this.#liste.addEventListener('click', (evenement) => {
      if (evenement.target.closest('a')) this.close();
    });
    this.#nav.addEventListener('focusout', (evenement) => {
      const cible = evenement.relatedTarget;
      if (this.#estOuvert() && (!cible || !this.#nav.contains(cible))) this.close();
    });
    document.addEventListener('click', (evenement) => {
      if (this.#estOuvert() && !this.#nav.contains(evenement.target)) this.close();
    });
  }

  #estOuvert() {
    return this.#bouton.getAttribute('aria-expanded') === 'true';
  }

  toggle() {
    if (this.#estOuvert()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.#nav.classList.add('nav--ouvert');
    this.#bouton.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.#nav.classList.remove('nav--ouvert');
    this.#bouton.setAttribute('aria-expanded', 'false');
  }
}
