// Règles de validation pures, sans accès au DOM (testées avec node --test).
export default class FormValidator {
  static #EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  static #TELEPHONE = /^\+?\d[\d .-]{7,18}\d$/;

  #regles;

  constructor(regles) {
    this.#regles = regles;
  }

  valider(valeurs) {
    const erreurs = {};
    for (const [champ, regle] of Object.entries(this.#regles)) {
      const message = this.#verifier(String(valeurs[champ] ?? '').trim(), regle);
      if (message) erreurs[champ] = message;
    }
    return { estValide: Object.keys(erreurs).length === 0, erreurs };
  }

  #verifier(valeur, regle) {
    if (valeur === '') {
      return regle.obligatoire ? `Veuillez renseigner ${regle.libelle}.` : '';
    }
    if (regle.type === 'email' && !FormValidator.#EMAIL.test(valeur)) {
      return 'Veuillez saisir une adresse e-mail valide, par exemple nom@domaine.fr.';
    }
    if (regle.type === 'tel' && !FormValidator.#TELEPHONE.test(valeur)) {
      return 'Veuillez saisir un numéro de téléphone valide, par exemple 06 12 34 56 78.';
    }
    if (regle.max && valeur.length > regle.max) {
      return `Ce champ ne doit pas dépasser ${regle.max} caractères.`;
    }
    return '';
  }
}
