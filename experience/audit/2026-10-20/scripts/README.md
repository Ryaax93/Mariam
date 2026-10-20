# Reproduire les contrôles

Les résultats initiaux concernent `fa608ce5e925f7d5f66582f2025a262656661c16`. Utiliser un checkout de cette version pour comparer. Les scripts sont ceux exécutés ; seuls leurs chemins et le choix de l'exécutable ont été rendus portables après exécution.

Depuis la racine du dépôt, installer les dépendances de `experience/package.json`, Playwright 1.55 et Chromium. `PLAYWRIGHT_MODULE` et `PLAYWRIGHT_CHROMIUM_EXECUTABLE` peuvent pointer vers une installation existante. Puis :

```sh
mkdir -p qa/audit-20261020 qa/foundation-20261020
node --test experience/tests/*.test.mjs
experience/node_modules/.bin/esbuild experience/audit/2026-10-20/scripts/adventure-core-entry.js --bundle --platform=node --format=cjs --outfile=experience/audit/2026-10-20/scripts/adventure-core.cjs
node experience/audit/2026-10-20/scripts/audit-campaign.cjs
node experience/audit/2026-10-20/scripts/audit-remaining.cjs
node experience/audit/2026-10-20/scripts/audit-focused.cjs
node experience/audit/2026-10-20/scripts/audit-ui.cjs
```

Les serveurs sont temporaires et fermés par les scénarios. Ne pas exécuter plusieurs tests de rendu en parallèle pour mesurer les performances. `audit-remaining` utilise explicitement des records de test pour accéder aux derniers niveaux ; la victoire reste obtenue par les commandes ordinaires. Le modèle isolé initialise des positions et ne représente pas un test tactile humain.

Pour la branche de test, utiliser également les scripts `foundation-*`. Les JSON de `evidence/` concernent l'initial ; ceux de `validation/` la branche. Les sauvegardes de test ne contiennent que des données synthétiques de progression. Ni les tailles mobiles ni SwiftShader ne remplacent Safari sur iPhone physique.
