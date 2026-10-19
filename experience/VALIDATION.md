# Validation — Les mondes de nous

Contrôles réalisés le 19 octobre 2026.

## Campagne complète

Les neuf niveaux ont été terminés dans Chromium 140, à **393 × 852**, avec simulation tactile mobile et rendu WebGL réel (SwiftShader dans l’environnement de test). Le contrôleur d’essai utilise les entrées ordinaires du jeu : joystick, saut et sprint. Il ne modifie ni les positions, ni les vies, ni les objets, ni la condition de victoire.

Chaque niveau a récupéré ses trois objets, rejoint son portail et enregistré son résultat. Les neuf victoires ont été retrouvées après rechargement. Aucune erreur JavaScript n’a été relevée durant cette campagne.

## Commandes, interface et son

**33 contrôles de navigateur réussis**, couvrant :

- déverrouillage des niveaux ;
- déplacement et saut avec deux contacts tactiles simultanés ;
- relâchement des commandes sans bouton bloqué ;
- clavier et pause avec Échap ;
- arrêt de la physique et du chronomètre pendant la pause ;
- défaite après trois chutes, reprise et réinitialisation du niveau ;
- démarrage audio après un geste, signal audio mesuré avec un AnalyserNode, coupure et reprise ;
- modes léger et effets doux ;
- carnet, neuf souvenirs débloqués et vraie photographie de la voiture ;
- boutons de départ et commandes accessibles, sans débordement horizontal, en **320 × 568**, **430 × 932**, **852 × 393** et **1440 × 900** ;
- absence d’accumulation des géométries et textures lors de trois reprises successives du même niveau ;
- absence d’erreurs JavaScript et de ressources manquantes.

Des captures de l’accueil, de la carte, des trois univers, des instructions, des résultats, du carnet et de la lettre finale ont été contrôlées visuellement. Les panoramas et accessoires restent distincts des plateformes jouables.

Sept contrôles complémentaires ont validé les panoramas et les thèmes musicaux des trois mondes, la relecture de la lettre finale depuis la carte, la pause automatique lors de la perte du focus, le message sans WebGL et le signalement d’un stockage local bloqué.

## Modèle physique

**16 tests automatisés réussis**, reproductibles avec `npm test` : neuf parcours complets, gravité et saut sans répétition involontaire, défaite, conservation des objets au point de reprise, portail verrouillé sans collecte, recharge du sprint, zone précise des guimauves et transport par les plateformes mobiles.

Les essais ont conduit à restreindre le rebond à la guimauve visible et à ajuster son impulsion. Les niveaux avancés combinent davantage d’îles et de mécanismes. Les sauts disposent d’une courte tolérance de bord et d’un tampon d’entrée.

## Préservation

Le fichier original `index.html` à la racine conserve le blob Git `843ea7b2fbc108db40ddbecb384cadfdb2ae547f`. Tous les ajouts et modifications sont dans `experience/`. Le précédent `experience/index.html` est conservé, octet pour octet, dans `experience/story.html`. Son bundle, ses styles, ses photographies et ses sources sont inchangés.

## Limites du contrôle

Il s’agit de tests de navigateur à des dimensions d’iPhone avec entrées tactiles simulées. **Aucun iPhone physique ni Safari iOS réel n’était disponible** : ces essais ne constituent donc pas une mesure de fluidité sur un appareil Apple. Le moteur utilise les API web standard, limite la densité de pixels et propose un mode léger. Un essai sur l’iPhone de destination reste la bonne vérification matérielle.

La publication GitHub Pages doit être contrôlée séparément par comparaison SHA-256 des fichiers servis en HTTPS avec les fichiers testés, puis inspection du rendu de ces mêmes octets. Le déploiement ne requiert aucun changement au site original.
