// Sans JavaScript, le formulaire s'envoie normalement vers Formspree.
export default class ContactForm {
  #form;
  #validateur;
  #etat;
  #bouton;

  constructor(form, validateur) {
    this.#form = form;
    this.#validateur = validateur;
    this.#etat = form.querySelector('[data-etat]');
    this.#bouton = form.querySelector('[type="submit"]');
  }

  init() {
    this.#form.noValidate = true;
    this.#form.addEventListener('submit', (evenement) => this.#envoyer(evenement));
  }

  async #envoyer(evenement) {
    evenement.preventDefault();
    const donnees = new FormData(this.#form);
    const valeurs = Object.fromEntries(donnees.entries());
    const { estValide, erreurs } = this.#validateur.valider(valeurs);
    this.#afficherErreurs(erreurs);
    if (!estValide) {
      this.#afficherEtat('', '');
      this.#champs().find((champ) => erreurs[champ.name])?.focus();
      return;
    }
    if (valeurs._gotcha) {
      this.#reussite();
      return;
    }
    this.#bouton.disabled = true;
    this.#afficherEtat('Envoi en cours…', '');
    try {
      const reponse = await fetch(this.#form.action, {
        method: 'POST',
        body: donnees,
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(15000),
      });
      if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
      this.#reussite();
    } catch {
      this.#afficherEtat(
        "Votre message n'a pas pu être envoyé. Écrivez-moi à stevens.wrc@gmail.com ou appelez le 06 60 85 28 60.",
        'etat--erreur',
      );
    } finally {
      this.#bouton.disabled = false;
    }
  }

  #champs() {
    return [...this.#form.querySelectorAll('[data-champ]')];
  }

  #reussite() {
    this.#form.reset();
    this.#afficherEtat('Merci ! Votre demande est bien envoyée. Je vous réponds sous 48 heures.', 'etat--succes');
  }

  #afficherEtat(message, classe) {
    this.#etat.classList.remove('etat--succes', 'etat--erreur');
    if (classe) this.#etat.classList.add(classe);
    this.#etat.textContent = message;
  }

  #afficherErreurs(erreurs) {
    for (const champ of this.#champs()) {
      const message = erreurs[champ.name] ?? '';
      const zone = this.#form.querySelector(`#${champ.id}-erreur`);
      if (zone) zone.textContent = message;
      if (message) {
        champ.setAttribute('aria-invalid', 'true');
      } else {
        champ.removeAttribute('aria-invalid');
      }
    }
  }
}
