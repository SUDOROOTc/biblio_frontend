# Product Requirements Document (PRD) & Brief Projet — Biblio

**Version :** 1.0  
**Statut :** Validé / En phase de conception UI & spécifications  
**Produit :** Biblio — Plateforme de gestion de bibliothèque de quartier  
**Cible :** Bibliothécaires professionnels et bénévoles  
**Langue :** Français  

---

## 1. Vision & Objectifs Produit

### 1.1 Contexte & Problématique
Les bibliothèques de quartier, associatives et municipales à taille humaine font face à une dispersion de leurs outils : fiches cartonnées, tableurs disparates et cahiers de prêt manuscrits. Les logiciels existants du marché sont souvent pensés pour les grands réseaux universitaires : trop complexes, visuellement austères et nécessitant des formations lourdes.

### 1.2 Proposition de Valeur
**Biblio** réinvente la gestion des bibliothèques de proximité en alliant **l'élégance du monde littéraire** et **la simplicité d’une application moderne**. L'outil permet à un bibliothécaire de gérer en toute sérénité l'intégralité du cycle de vie des livres, des adhérents et des flux d'emprunts sans friction technique.

### 1.3 Objectifs Clés (KPIs)
* **Zéro formation requise :** Prise en main complète par un nouveau bibliothécaire ou bénévole en moins de 15 minutes.
* **Fluidité d'opération au comptoir :** Enregistrement d'un prêt ou d'un retour en moins de 5 secondes.
* **Taux d'adoption & fidélité :** Suivi en temps réel des 142+ réservations et relances automatisées des retards.

---

## 2. Personas Utilisateurs

### Persona Principal : Claire Valmont (54 ans)
* **Rôle :** Bibliothécaire responsable (Bibliothèque de quartier)
* **Profil :** Passionnée de littérature, attentive à l'accueil des usagers et à la préservation du fonds.
* **Besoins :** 
  * Un pupitre de contrôle clair visualisant d'un coup d'œil l'état du rayon et les réservations du jour.
  * Des alertes sur les statuts d'emprunt (retards, réservations prêtes au casier).
  * Des actions rapides accessibles en 1 clic au moment des pics de fréquentation.
* **Frustrations actuelles :** Les interfaces de gestion grises, lentes, surchargées de menus imbriqués.

---

## 3. Périmètre Fonctionnel (MVP & Écrans Réalisés)

Le périmètre initial comprend trois piliers fonctionnels matérialisés par trois écrans principaux :

### 3.1 Écran 1 — Landing Page Découverte & Vitrine
* **Objectif :** Présenter Biblio aux municipalités et bibliothécaires, inspirer confiance et diriger vers l'accès sécurisé.
* **Spécifications fonctionnelles :**
  * **Header :** Logo Biblio, navigation institutionnelle (*Accueil*, *Découvrir*, *Connexion*), recherche rapide et avatar.
  * **Hero Section :** Accroche littéraire valorisant la proximité, CTA primaire « Se connecter » et CTA secondaire « Découvrir la démonstration ».
  * **Vitrine visuelle :** Mockup interactif du pupitre numérique et indicateurs de réassurance (temps réel, zéro maintenance, 15 000+ ouvrages indexés, 98% satisfaction).
  * **Trois piliers fondamentaux du métier :**
    1. *Les Livres :* Catalogage Dewey, rayonnage, état d'usure, recherche ISBN.
    2. *Les Lecteurs :* Fiches d'adhésion, historique confidentiel RGPD, rappels courtois.
    3. *Les Réservations :* File d'attente automatisée, alerte casier de transit, délai de garde de 7 jours.
  * **Témoignage d'usage & Réassurance locale :** Preuve sociale et pied de page institutionnel.

### 3.2 Écran 2 — Page d'Authentification Sécurisée
* **Objectif :** Accès exclusif et protégé au poste de circulation et à l'espace d'administration du bibliothécaire.
* **Spécifications fonctionnelles :**
  * **Identification :** Saisie de l'identifiant professionnel / email et du mot de passe avec toggle de visibilité.
  * **Sécurité & Traçabilité :** Mention du poste agréé, connexion chiffrée SSL, registre numérique d'émargement.
  * **Gestion des états d'interface :**
    * *État Standard :* Champs prêts à la saisie, mémorisation de session.
    * *État Erreur :* Notification visuelle immédiate (identifiants invalides, compteur de tentatives).
    * *État Chargement :* Feedback visuel durant la vérification des droits.
  * **Assistance poste :** Raccourci vers la permanence technique et guide agents.

### 3.3 Écran 3 — Tableau de Bord & Pupitre de Circulation
* **Objectif :** Écran opérationnel quotidien du bibliothécaire pour superviser l'activité et exécuter les opérations de prêt.
* **Spécifications fonctionnelles :**
  * **Barre latérale (Sidebar) :** Navigation entre *Tableau de bord*, *Catalogue*, *Circulation & Prêts*, *Adhérents*, *Réservations*, *Cotes & Rayons*.
  * **Barre d'actions rapides (Top Bar) :** Boutons primaires `+ Ajouter un livre`, `+ Ajouter un lecteur`, `+ Créer une réservation`.
  * **Recherche universelle :** Barre omnibox acceptant titre, auteur, code-barres douchette ou numéro d'adhérent.
  * **4 Cartes d'indicateurs (KPIs) :**
    1. *Fonds documentaire :* 8 420 volumes (+45 ce mois).
    2. *Disponibilité immédiate :* 6 780 en rayon (80,5% du catalogue).
    3. *File des réservations :* 142 en cours (18 prêtes au casier).
    4. *Communauté lectrice :* 1 290 adhérents actifs.
  * **Registre des réservations récentes (Gestion des 5 statuts obligatoires) :**
    * `Réservée` (en attente de retrait)
    * `Empruntée` (en circulation active)
    * `Retournée` (enregistrée avec succès)
    * `Annulée` (par l'usager ou le système)
    * `Expirée` (délai de 48h/7j dépassé sans retrait)
  * **Module d'arrivages récents :** Affichage des nouvelles acquisitions avec cotes Dewey (ex: *843.91 PRO*) et emplacements en rayon.
  * **Gestion des retours du matin & Casier :** Indicateur d'état vide positif (bac 0/0 vidé) et rappel de permanence de fermeture.

---

## 4. Direction Artistique & Charte UI/UX

* **Nom du Design System :** *Warm Literary Modernism*
* **Palette Chromatique :**
  * *Vert Forêt Profond* (`#1B382B`) : Couleur primaire d'autorité, rappelant les lampes de bibliothèque traditionnelles et les reliures d'art.
  * *Beige Parchemin / Crème* (`#FCF9F0`, `#F6F3EA`) : Surface apaisante réduisant la fatigue oculaire lors des longues gardes.
  * *Blanc cassé* (`#FFFFFF`) : Conteneurs de cartes et surélévation des données.
  * *Accents & Alertes :* Ambre doré pour les réservations prêtes, Vert sauge pour les disponibilités, Bordeaux/Corail pour les retards et expirations.
* **Typographie :**
  * Titrage : *Newsreader* (Serif humaniste, chaud et littéraire).
  * Corps de texte et métadonnées : *Plus Jakarta Sans / Inter* (Sans-serif géométrique haute lisibilité pour cotes et numéros d'inventaire).
* **Rayon de courbure (Border Radius) :** `rounded-md` / `rounded-lg` (coins doux sans excès, esprit classeur et fiches bristol).

---

## 5. Spécifications Techniques & Contraintes Non-Fonctionnelles

1. **Accessibilité (RGAA / WCAG 2.1 AA) :**
   * Ratios de contraste supérieurs à 4.5:1 sur tous les textes et badges de statut.
   * Navigation clavier intégrale pour le comptoir de prêt (raccourcis douchette code-barres).
2. **Performance :**
   * Temps de réponse de la recherche instantanée < 100ms sur base locale de 20 000 notices.
3. **Sécurité & Confidentialité :**
   * Conformité stricte RGPD : anonymisation de l'historique d'emprunt dès que l'ouvrage est restitué.
   * Authentification double facteur facultative pour les postes partagés.

---

## 6. Feuille de Route & Évolutions Futures (Post-MVP)

* **Phase 2 :** Module d'inventaire annuel par scan RFID / code-barres en continu.
* **Phase 3 :** Portail usager pour consultation du catalogue en ligne et prolongation d'emprunt à distance.
* **Phase 4 :** Gestion des animations culturelles (clubs de lecture, rencontres d'auteurs).
