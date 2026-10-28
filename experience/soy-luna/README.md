# Mariam — Les jardins de Luna

Première scène 3D jouable dans `/experience/soy-luna/`, branche `feature/soy-luna-vertical-slice`. La version publique reste intacte.

Joystick vers le haut : pousser ; gauche/droite : tourner ; bas : freiner. Élan accélère. Saut permet une figure en gardant le bouton appuyé. Clavier : flèches/ZQSD/WASD, Espace, Maj, Échap.

12 notes, trois cœurs, deux checkpoints, tremplin avec contournement, final romantique et score. Pause : musique, mouvements doux, qualité et reprise. Le portrait demande de tourner le téléphone ; aucune rotation ou plein écran forcés. La progression est propre au domaine.

- [Bible artistique](ART-DIRECTION.md)
- [Plan technique](TECHNICAL-PLAN.md)
- [Assets](ASSETS.md)
- [Résultats réels](VALIDATION.md)
- [Captures](review.html)

Mariam est un vrai modèle skinné, provisoire. Le visage et les animations artistiques restent à finaliser. Safari sur iPhone physique et les 60 FPS ne sont pas validés. Hub, Fashion Studio, autres univers, tenues et sauvetage restent à construire après validation.

Tests : depuis `experience/`, `npm ci && npm test` pour les tests classiques, `node soy-luna/test/unit.mjs` pour la simulation et le rig. Le workflow Soy Luna private review installe Playwright 1.55.0 / Chromium / WebKit et exécute `node soy-luna/test/browser.mjs`. Les preuves sont dans evidence/. Aucun contrôle de production ne permet de téléporter Mariam ou forcer la victoire.

`test/character.html` : contrôle du vrai modèle. `?camera-test=before` et `?camera-test=after` : scène d'occultation volontaire, distincte du parcours normal.

## Reprise V2

Voir [la bible et le plan V2](V2-PRODUCTION.md), [les résultats V2](V2-VALIDATION.md) et [le carnet de captures](review.html). Les rapports précédents restent les archives de la V1.
