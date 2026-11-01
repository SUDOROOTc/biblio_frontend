# Plan d'implementation du frontend Biblio

## Objectif

Construire progressivement l'interface francaise de Biblio pour les bibliothecaires,
avec une landing page, une page de connexion et un tableau de bord de circulation.
Chaque etape reste petite, verifiable et se termine par un commit dedie.

## Regles de chaque etape

1. Definir le comportement ou l'ecran vise.
2. Modifier uniquement le perimetre necessaire.
3. Executer les validations disponibles.
4. Expliquer les choix et les fichiers modifies.
5. Committer avec un message clair.

## Approche technique retenue pour le demarrage

Commencer avec React, TypeScript et le CSS deja presents dans le projet, sans ajouter
de dependance. Cette approche permet de stabiliser les ecrans et le modele visuel
avant d'introduire la stack cible prevue par `AGENTS.md`.

L'ajout de dependances comme Tailwind, daisyUI, TanStack Query, Zustand, React Hook
Form, Zod, TanStack Router, Motion ou Phosphor devra etre valide avant installation.

## Etapes

### Etape 1 — Socle et design system

- Verifier la configuration Vite, TypeScript et les scripts npm.
- Organiser les premiers composants reutilisables sans casser l'ecran existant.
- Definir les tokens visuels Biblio : couleurs, typographies, espacements, rayons,
  focus et statuts.
- Ajouter les scripts de validation manquants uniquement si l'outillage existant
  les permet sans nouvelle dependance.

Commit :

```text
chore(front): preparer le socle frontend
```

### Etape 2 — Structure de navigation

- Creer la structure visuelle du layout public et du layout authentifie.
- Ajouter la sidebar, la barre superieure et la navigation responsive.
- Garder les routes compatibles avec la stack actuellement installee.

Commit :

```text
feat(navigation): ajouter les layouts et la navigation
```

### Etape 3 — Landing page

- Construire le hero, la proposition de valeur et les trois piliers metier.
- Ajouter les appels a l'action vers la connexion.
- Ajouter le footer et les variantes responsive.

Commit :

```text
feat(landing): creer la page d'accueil Biblio
```

### Etape 4 — Page de connexion

- Construire le formulaire identifiant / mot de passe.
- Prevoir les etats standard, chargement et erreur.
- Ajouter l'affichage ou le masquage du mot de passe.
- Ne pas modifier le contrat API backend.

Commit :

```text
feat(auth): creer la page de connexion bibliothecaire
```

### Etape 5 — Tableau de bord

- Construire les KPI, la recherche universelle, les actions rapides,
  les reservations recentes et les arrivages.
- Utiliser des donnees explicitement marquees comme maquette tant que l'API
  correspondante n'est pas connectee.
- Gerer les etats chargement, vide, erreur et succes.

Commit :

```text
feat(dashboard): creer le tableau de bord bibliothecaire
```

### Etape 6 — Etats metier et composants partages

- Centraliser les cinq statuts de reservation.
- Creer un composant unique de badge de statut.
- Ajouter les confirmations, messages de succes et messages d'erreur.
- Respecter les contraintes d'accessibilite et de contraste.

Commit :

```text
feat(ui): ajouter les composants metier reutilisables
```

### Etape 7 — Connexion au contrat API

- Lire et respecter `api.md`.
- Connecter progressivement la recherche de livres, les reservations et
  l'authentification.
- Traduire les erreurs HTTP en messages francais exploitables.
- Ne pas dupliquer les regles metier du backend.

Commit :

```text
feat(api): connecter le frontend au contrat backend
```

### Etape 8 — Formulaires et actions de circulation

- Ajouter les formulaires livre, lecteur et reservation.
- Ajouter annulation, emprunt et retour.
- Afficher les validations, confirmations et retours d'action.

Commit :

```text
feat(circulation): ajouter les actions de gestion
```

### Etape 9 — Tests et stabilisation

- Tester les composants principaux et les parcours critiques.
- Verifier les etats d'erreur, chargement et vide.
- Verifier clavier, focus, responsive et contraste.
- Executer :

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
```

Commit :

```text
test(front): couvrir les parcours principaux
```

### Etape 10 — Documentation finale

- Documenter le lancement et les variables d'environnement.
- Documenter l'utilisation de `api.md`.
- Verifier que l'historique reste lisible et qu'aucun fichier sensible
  ou genere n'est commite.

Commit :

```text
docs(front): documenter le frontend Biblio
```
