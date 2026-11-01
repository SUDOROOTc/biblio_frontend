# AGENTS.md — Biblio (front)

## Contexte
Biblio : gestion de bibliothèque de quartier pour bibliothécaires et bénévoles. UI 100 % en français.
Objectifs : prise en main < 15 min, prêt/retour en < 5 s, recherche instantanée < 100 ms.
Back : Django/DRF, schéma OpenAPI via drf-spectacular. Le front ne duplique jamais la logique métier du back.

## Stack (fixe)
- React + TypeScript strict, Vite
- UI : daisyUI + Tailwind, thème custom « Warm Literary Modernism »
- Icônes : Phosphor uniquement
- Server state : TanStack Query | Client state : Zustand (UI seulement)
- Forms : React Hook Form + Zod
- Routing : TanStack Router
- API : types générés depuis OpenAPI (openapi-typescript) + openapi-fetch
- Animations : Motion (sobres, seulement si elles servent l'usage)
- Tests : Vitest + Testing Library
- Ne JAMAIS ajouter une dépendance sans me demander.

## Architecture (feature-based)
```
src/
  app/          # providers, router, config
  features/
    catalogue/ circulation/ adherents/ reservations/ auth/ dashboard/
      components/  hooks/  api/  schemas/  types.ts  index.ts
  shared/
    ui/         # composants génériques (StatusBadge, KpiCard, DataTable…)
    api/        # client généré + config HTTP
    lib/        # fonctions pures (formatage, dates, cotes Dewey)
```
- Une feature n'importe que le `index.ts` d'une autre feature.
- `shared/` n'importe jamais depuis `features/`.
- Appels API uniquement dans `features/*/api` (hooks TanStack Query), jamais dans un composant.
- Composants = affichage ; logique dans hooks/fonctions pures.
- Les règles métier (transitions de statut, délais de garde, RGPD) vivent dans le back. Le front affiche et déclenche, il ne décide pas.

## Domaine (vocabulaire à respecter)
- Statuts de réservation (exactement 5) : Réservée, Empruntée, Retournée, Annulée, Expirée.
  Un seul type union + un seul composant `StatusBadge`. Jamais de chaînes en dur ailleurs.
- Termes UI : adhérent/lecteur, cote, rayon, casier, circulation, fonds. Pas d'anglicismes dans l'interface.
- Cotes Dewey affichées en police mono/tabulaire (ex : 843.91 PRO).

## Design system
- Couleurs en tokens du thème daisyUI, jamais en dur :
  primaire #1B382B · fond #FCF9F0 / #F6F3EA · cartes #FFFFFF
  ambre = prêt au casier · sauge = disponible · bordeaux/corail = retard/expiré
- Titres : Newsreader. Corps/métadonnées : Plus Jakarta Sans. Pas d'autre police.
- Rayons : `rounded-md` / `rounded-lg` max. Ombres légères, sans empilement.
- Toute couleur de statut est doublée d'un texte ou d'une icône (jamais la couleur seule).

## Accessibilité & performance (non négociable)
- Contraste ≥ 4.5:1 sur tous les textes et badges.
- Navigation clavier complète au comptoir ; la douchette code-barres = saisie clavier + Entrée.
- Focus visible, labels explicites, `aria-live` pour erreurs et confirmations.
- Recherche universelle (titre, auteur, code-barres, n° adhérent) : debounce court, résultats < 100 ms perçus.
- Listes longues : pagination ou virtualisation.

## Écrans : états obligatoires
Chaque écran/liste de données gère : chargement (skeleton), vide (message utile), erreur (avec action de reprise), succès.
Connexion : état standard, erreur (identifiants invalides + compteur de tentatives), chargement.
État vide positif autorisé (ex : « Bac des retours vidé »).

## Règles de code
- Pas de `any`, pas de `as` pour contourner le typage, pas de `// @ts-ignore`.
- Composant < 150 lignes, sinon on découpe.
- Pas de `useEffect` pour dériver un état ou fetcher : calcul direct ou TanStack Query.
- Props drilling max 2 niveaux : composition ou store.
- Composants PascalCase, hooks `useXxx`, fichier = nom de l'export.
- Validation Zod à chaque frontière (formulaires, réponses inattendues).
- Pas d'abstraction avant la 3e répétition.
- Un seul `index.ts` par feature (pas de barrels partout).

## À ÉVITER (signes de « vibe code »)
- Commentaires qui paraphrasent le code. On commente le pourquoi uniquement.
- Emojis dans le code, les logs, l'UI.
- `console.log`, code mort, TODO sans ticket, données mock en dur dans les composants.
- try/catch qui avalent les erreurs.
- Textes génériques (« Welcome », « Get started », Lorem ipsum, « Seamless », « Powerful »). Copy réelle, en français, ton littéraire et chaleureux.
- Dégradés violet/bleu, glassmorphism, ombres lourdes, cartes dans des cartes, cercles décoratifs flous.
- Lucide, Inter, shadcn/ui par défaut, fonds blancs purs partout.
- Grille de 3 cartes identiques « feature + icône + titre + phrase » répétée sans intention.
- Fichiers `utils.ts` / `helpers.ts` fourre-tout.
- Wrappers inutiles autour d'un composant daisyUI.
- Chiffres inventés (15 000 ouvrages, 98 %…) hors maquette marquée comme telle.
- Réécrire un composant existant au lieu de l'étendre.

## Workflow
- Tâche touchant > 2 fichiers : résumer le plan en 3-5 lignes avant de coder.
- Une étape à la fois, modifs minimales, pas de refactor non demandé.
- Après chaque tâche : `npm run lint && npm run typecheck && npm run test`.
- Si une règle bloque la tâche, le dire, ne pas la contourner.
- Commits : convention `chore:` / `feat:` / `fix:`, un sujet par commit.
