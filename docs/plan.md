# Plan d'implementation complet du frontend Biblio

## Objectif

Livrer un frontend React/TypeScript stable, en francais, connecte au backend
Django existant. Chaque cycle traite un comportement utilisable, est valide
avec les commandes disponibles et se termine par un commit dedie.

## Regles de travail

Pour chaque cycle :

1. definir le comportement metier vise ;
2. modifier uniquement le perimetre necessaire ;
3. executer `npm.cmd run typecheck` et `npm.cmd run build` ;
4. tester le parcours API si le backend concerne est disponible ;
5. expliquer le code produit ;
6. creer un commit Conventional Commits.

Ne pas ajouter de dependance sans validation. Le frontend ne reproduit jamais
les regles metier du backend.

## Architecture cible legere

```text
src/
  api/
    client.ts
    auth.ts
    livres.ts
    lecteurs.ts
    reservations.ts
  App.tsx
  DashboardContent.tsx
  CataloguePage.tsx
  MembresPage.tsx
  ReservationsPage.tsx
  ParametresPage.tsx
  Icon.tsx
  types.ts
  styles.css
```

Le client API centralise :

- `credentials: "include"` ;
- le cookie CSRF et `X-CSRFToken` ;
- les erreurs JSON `{ detail }` ;
- les reponses `204` sans parsing JSON ;
- les etats HTTP `401`, `403`, `404`, `409` et `422`.

## Etat actuel

Termine :

- socle visuel et responsive ;
- landing page ;
- connexion JSON Django avec session et CSRF ;
- routage `/`, `/connexion`, `/dashboard`, `/catalogue`, `/membres` ;
- dashboard initial ;
- catalogue connecte a `GET /api/livres/recherche` ;
- creation et liste des lecteurs ;
- navigation de base et deconnexion.

En attente :

- boutons du dashboard encore non connectes ;
- section reservations encore en maquette ;
- page Parametres ;
- creation de livre ;
- creation et actions de reservation ;
- tests frontend et documentation finale.

## Cycles d'implementation

### Cycle 1 — Stabiliser les layouts authentifies

Objectif : supprimer la duplication de sidebar entre Dashboard, Catalogue et
Membres.

- extraire un layout authentifie commun ;
- rendre les liens actifs selon l'URL ;
- brancher les boutons de navigation existants ;
- conserver la restauration de session.

Commit :

```text
refactor(layout): mutualiser le layout authentifie
```

### Cycle 2 — Rendre les actions rapides du dashboard fonctionnelles

Objectif : aucun bouton principal ne doit etre decoratif.

- `Ajouter un livre` -> `/catalogue/nouveau` ;
- `Ajouter un lecteur` -> `/membres` ;
- `Creer une reservation` -> `/reservations/nouveau` ;
- `Voir tout` du catalogue -> `/catalogue` ;
- `Voir tout` des reservations -> `/reservations`.

Commit :

```text
feat(navigation): brancher les actions du dashboard
```

### Cycle 3 — Formulaire de creation d'un livre

Objectif : creer un livre depuis le frontend avec `POST /api/livres`.

- champs titre, auteur, annee de publication ;
- validation de forme ;
- etats chargement, succes et erreur ;
- retour vers le catalogue apres creation ;
- rafraichissement du catalogue.

Le frontend ne decide pas si le livre est valide metier : il affiche l'erreur
renvoyee par le backend.

Commit :

```text
feat(catalogue): ajouter la creation de livres
```

### Cycle 4 — Page complete des reservations

Objectif : remplacer la maquette par `GET /api/reservations`.

- type `Reservation` aligne sur le contrat ;
- liste des reservations ;
- badge unique pour les cinq statuts ;
- affichage livre, lecteur, statut et dates ;
- etats chargement, vide, erreur et reprise ;
- recherche ou filtre local uniquement pour l'affichage.

Commit :

```text
feat(reservations): afficher les reservations
```

### Cycle 5 — Creation d'une reservation

Objectif : creer une reservation avec `POST /api/reservations`.

- choix d'un livre ;
- choix d'un lecteur ;
- validation des UUID ;
- affichage des erreurs `404`, `409` et `422` ;
- retour a la liste apres succes.

Les quotas et la disponibilite restent exclusivement geres par le backend.

Commit :

```text
feat(reservations): ajouter la creation
```

### Cycle 6 — Actions de circulation

Objectif : rendre utilisables les transitions de reservation.

- annuler : `POST /annuler` ;
- emprunter : `POST /emprunter` ;
- retourner : `POST /retourner` ;
- confirmation avant action ;
- etat d'action en cours ;
- message de succes ;
- rafraichissement apres action ;
- blocage visuel des actions impossibles selon le statut recu.

Le frontend ne remplace pas la validation du backend : une erreur de transition
est toujours affichee.

Commit :

```text
feat(reservations): ajouter les actions de circulation
```

### Cycle 7 — Dashboard branche sur les donnees reelles

Objectif : supprimer les donnees de reservation fictives du dashboard.

- charger `GET /api/reservations` ;
- afficher les reservations recentes reelles ;
- afficher le nombre d'emprunts en cours derive des reservations recues ;
- afficher les membres actifs uniquement si le backend fournit la donnee ;
- garder `—` pour une statistique indisponible ;
- ne pas appeler `EXPIREE` un retard de retour sans contrat explicite.

Decision actuelle pour `Retards` : afficher `—` tant que le backend ne definit
pas une vraie statistique de retard. `EXPIREE` signifie reservation non retiree
a temps, pas necessairement retour en retard.

Commit :

```text
feat(dashboard): connecter les reservations reelles
```

### Cycle 8 — Page Parametres

Objectif : remplacer le lien decoratif Parametres.

- afficher l'utilisateur courant ;
- formulaire de changement de mot de passe ;
- appel `POST /api/auth/changer-mot-de-passe` ;
- validation de forme ;
- messages de succes et d'erreur ;
- conserver la deconnexion deja fonctionnelle.

Commit :

```text
feat(parametres): ajouter la gestion du compte
```

### Cycle 9 — Finaliser Membres

Objectif : completer la page lecteurs avec les operations disponibles.

- modifier un lecteur avec `PUT /api/lecteurs/{id}` ;
- suppression logique avec `DELETE /api/lecteurs/{id}` ;
- confirmation avant suppression ;
- rafraichissement apres modification ou suppression ;
- consultation des reservations d'un lecteur avec
  `GET /api/lecteurs/{id}/reservations`.

Commit :

```text
feat(membres): ajouter la gestion des lecteurs
```

### Cycle 10 — Etats, accessibilite et erreurs

Objectif : rendre chaque ecran robuste.

- chargement explicite ;
- etat vide utile ;
- erreur avec reprise ;
- `aria-live` pour erreurs et confirmations ;
- focus visible ;
- boutons clavier accessibles ;
- pas de couleur seule pour les statuts ;
- messages francais pour `401`, `403`, `404`, `409` et `422`.

Commit :

```text
fix(ui): renforcer les etats et l accessibilite
```

### Cycle 11 — Tests frontend

Objectif : proteger les parcours critiques.

Les dependances de test ne seront ajoutees qu'apres validation. Si aucun outil
n'est autorise, executer au minimum les validations TypeScript, build et les
tests API manuels reproductibles.

Parcours a couvrir :

- landing -> connexion ;
- login valide et invalide ;
- restauration de session ;
- logout ;
- catalogue et recherche ;
- creation d'un livre ;
- creation d'un lecteur ;
- liste et creation d'une reservation ;
- actions annuler, emprunter et retourner ;
- etats vides et erreurs.

Commit :

```text
test(front): couvrir les parcours principaux
```

### Cycle 12 — Documentation et livraison

Objectif : rendre le projet installable et compréhensible.

- mettre a jour le README frontend ;
- documenter `VITE_API_URL` et `VITE_USE_DEMO` ;
- documenter le proxy Vite ;
- documenter les routes frontend ;
- verifier les fichiers sensibles et generes ;
- ne pas committer automatiquement les fichiers initiaux sans les examiner.

Validations finales :

```powershell
npm.cmd run typecheck
npm.cmd run build
```

Si les scripts existent a ce moment-la :

```powershell
npm.cmd run lint
npm.cmd run test
```

Commit :

```text
docs(front): finaliser la documentation
```

## Dependances et limites backend

- `GET /api/lecteurs` est maintenant disponible et utilise par Membres.
- `GET /api/reservations` est disponible.
- `POST /api/livres`, `POST /api/lecteurs` et `POST /api/reservations` sont disponibles.
- Les actions de reservation sont disponibles dans le contrat.
- La route backend `/retourner` doit etre verifiee avant d'utiliser l'action en production.
- Aucun endpoint statistiques stable n'est documente : ne pas inventer de chiffres.
- Le backend reste responsable des regles metier, permissions, sessions, CSRF,
  conflits et transitions.
