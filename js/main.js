import Navigation from './Navigation.js';
import RevealOnScroll from './RevealOnScroll.js';
import FormValidator from './FormValidator.js';
import ContactForm from './ContactForm.js';

const nav = document.querySelector('[data-nav]');
if (nav) new Navigation(nav).init();

const elementsARevele = document.querySelectorAll('.revele');
if (elementsARevele.length) new RevealOnScroll(elementsARevele).init();

const formulaire = document.querySelector('[data-formulaire-contact]');
if (formulaire) {
  const validateur = new FormValidator({
    nom: { obligatoire: true, type: 'texte', max: 100, libelle: 'votre nom' },
    entreprise: { obligatoire: false, type: 'texte', max: 100, libelle: 'le nom de votre entreprise' },
    email: { obligatoire: true, type: 'email', max: 254, libelle: 'votre adresse e-mail' },
    telephone: { obligatoire: false, type: 'tel', max: 20, libelle: 'votre téléphone' },
    projet: { obligatoire: true, type: 'texte', max: 50, libelle: 'le type de projet' },
    message: { obligatoire: true, type: 'texte', max: 3000, libelle: 'votre message' },
  });
  new ContactForm(formulaire, validateur).init();
}
