# Validation de la branche d'essai — 20 octobre 2026

## Livraison et périmètre

Branche : `audit/refonte-mariam-20261020`. Le premier commit `bde2a9a01a90706cb5c6ceaa96b1a1e275fb7bbe` fige l'audit et la préparation avant les corrections de cette branche. Le public reste à `fa608ce5e925f7d5f66582f2025a262656661c16` ; aucune demande de fusion ni publication sur `main` n'a été exécutée.

Cette livraison est une **base jouable corrigée et une préparation détaillée de la refonte**. Elle n'est pas le nouveau jeu complet : nouveau modèle fidèle, trois tenues, Rishanth ange, Barbie exploratoire et Fashion Studio restent à produire selon [REFONTE.md](REFONTE.md).

Après le nettoyage automatique du workspace, les corrections ont été reconstruites et tous les contrôles ci-dessous ont été exécutés sur les fichiers reconstruits. Les réussites d'une copie antérieure non conservée ne servent pas de preuve pour cette livraison.

Version de diagnostic : `foundation-test-2`. SHA-256 du bundle contrôlé : `a88055703adb5b06d0996e7f0322bbb724ef2aeac7e857bceeef8464aed72ae9`. Une seconde compilation temporaire a reproduit exactement ce bundle. La copie privée contient le même `game.js`, le même `game.css`, les mêmes assets, ainsi que les bundles historiques inchangés. Seuls ses liens vers le ciel original pointent vers `original.html`, afin de réserver l'accueil à la présentation du test.

## Changements effectivement réalisés

- **Résultats de partie** : chaque délai de victoire/défaite est lié à sa session et annulé à la sortie. Une nouvelle partie ne reçoit plus le résultat de la précédente. Le statut est également vérifié avant l'affichage.
- **Reprise persistante** : clé additionnelle `mariam-worlds-checkpoint-v2`, validation du format, bouton Continuer, checkpoint, cœurs, cristaux, objets et temps restaurés. Sauvegarde aux événements, périodiquement, à la pause et à la sortie. Le joueur reprend au drapeau, pas à sa position exacte au milieu d'un saut.
- **Import/export** : vrai téléchargement JSON, contrôle du format et de la taille, refus des fichiers invalides, fusion conservant les meilleurs records. Import pendant une pause puis sortie de page testé : l'ancienne session ne réécrit plus la reprise importée. Le fichier concerne l'aventure ; il n'exporte pas le village historique.
- **Temps actif** : le chronomètre et les nouveaux résultats utilisent le temps réel actif, figé pendant la pause. Le champ historique `time` reste compatible, avec un champ additionnel `realTime`. La physique plafonnée à 50 ms par frame reste inchangée : le ralentissement sous 20 FPS n'est donc pas résolu par cette correction du chronomètre.
- **Visibilité** : suivi latéral recentré, cadrage paysage rapproché et ouverture tramée du décor devant Mariam. Le sapin du cas reproduit laisse maintenant voir son corps. Les matériaux du personnage sont séparés pour ne pas lui appliquer l'effet. Pas de nouveau modèle ni d'illusion de collisions solides ajoutée.
- **Entrées** : nettoyage de la capture du joystick lors d'un changement d'écran ; les mouvements tactiles hors partie sont ignorés.

## Préservation contrôlée

Les octets de la page originale, du village (`story.html`, `app.js`, `style.css`) et des sources `levels.js`, `physics.js`, `sound.js` sont identiques au commit public initial. Les neuf parcours, règles de victoire, trois cœurs classiques, sprint, glace, rebonds, convoyeurs, musiques, photos, souvenirs et lettre sont conservés. La clé `mariam-little-world-v1` a été contrôlée après les scénarios d'import et de jeu.

La sauvegarde du lien privé appartient à son domaine : elle n'écrase pas celle de GitHub Pages. La version publique ne dispose pas encore du nouveau bouton d'export ; cette livraison n'a pas été fusionnée dans `main`.

## Résultats fonctionnels

Environnement : Chromium 140 / Playwright 1.55 / Linux / SwiftShader. Ce sont des tests réellement exécutés, pas une certification Safari.

| Série | Résultat | Preuve |
| --- | --- | --- |
| Tests unitaires | 20 réussis, 0 échec | `validation/unit-tests.tap` |
| Interface et commandes | 33 contrôles réussis | `validation/ui-ui-report.json` |
| Reprise, plateformes mobiles, course de callbacks, annulation tactile | 8 contrôles réussis | `validation/focused-report.json` |
| Téléchargement, import, fusion, reprise, sortie et ancienne sauvegarde | 9 contrôles réussis | `validation/backup-report.json` |
| Trois thèmes, lettre, pause au blur, absence de WebGL, stockage bloqué | 7 contrôles réussis | `validation/final-report.json` |
| Paquet prêt à héberger | 10 contrôles fonctionnels réussis | `validation/preview-smoke.json` |

Aucune exception JavaScript ni erreur console dans l'aventure au cours de ces séries. L'essai du paquet a en revanche enregistré **une requête Google Fonts échouée** (`ERR_EMPTY_RESPONSE`) en ouvrant le ciel original. Cette dépendance préexistante du ciel original a été laissée intacte conformément à la consigne. Une première assertion regroupait erreurs réseau et JavaScript ; son échec a conduit à les distinguer explicitement, pas à masquer l'erreur. Le rapport conserve cette requête dans `resourceErrors`.

Résolutions contrôlées : 320 × 568, 393 × 852, 430 × 932, 852 × 393 et 1440 × 900. Contrôles tactiles visibles, sans chevauchement joystick/actions ; mouvement et saut simultanés ; pause/reprise et relâchement ; menus et photos contrôlés. Signal audio détecté ; ressources 3D stables sur trois reprises. Cela ne remplace ni une écoute sur AirPods ni un test de fuite d'une heure.

## Parcours réellement joués dans la copie reconstruite

Fixture : records initialisés pour ouvrir chaque niveau indépendamment. Contrôleur inchangé, joystick capturé puis événements de mouvement, saut et sprint ordinaires. Aucune position, vie, relique ou victoire n'est forcée dans le modèle du navigateur.

| Niveau | Première série / reprise | Temps actif réel | Temps simulé historique | Cœurs | Chutes / chocs |
| --- | --- | ---: | ---: | ---: | ---: |
| 1 | Gagné | 12.71 s | 8.16 s | 2 | 0 / 1 |
| 2 | Gagné | 21.64 s | 13.08 s | 3 | 0 / 0 |
| 3 | Défaite | 29.66 s | 17.23 s | 0 | 1 / 2 |
| 4 | Gagné | 15.11 s | 8.22 s | 2 | 0 / 1 |
| 5 | Gagné | 23.40 s | 13.19 s | 3 | 0 / 0 |
| 6 | Gagné | 36.08 s | 18.60 s | 1 | 0 / 2 |
| 7 | Gagné | 12.28 s | 8.30 s | 3 | 0 / 0 |
| 8 | Gagné | 22.25 s | 14.34 s | 3 | 0 / 0 |
| 9 | Gagné | 29.07 s | 18.49 s | 2 | 0 / 1 |
| 3, seconde tentative | Gagné | 31.57 s | 17.92 s | 2 | 0 / 1 |

**Les neuf niveaux ont été gagnés au moins une fois, sur dix tentatives.** Il ne s'agit pas d'une campagne sans échec : le troisième niveau a échoué lors de la première série. Ses trois reliques étaient récupérées ; une chute et deux chocs ont consommé les cœurs. La seconde tentative a gagné par les mêmes commandes ordinaires. Les deux résultats sont archivés, sans suppression de l'échec.

Le niveau 6, perdu deux fois lors de l'audit initial, est gagné ici avec un cœur restant. Le code des niveaux et de la physique n'a pas changé : cela ne démontre pas une correction de difficulté. L'échantillonnage du contrôleur et la charge de rendu varient. Les derniers parcours restent à faire essayer à un joueur humain sur téléphone.

Preuves : `validation/all-levels-remaining-report.json` et `validation/retry-level3-remaining-report.json`. Les neuf niveaux n'ont produit aucune erreur JavaScript dans ces parcours. Les records restent persistants dans les contrôles ciblés ; les neuf records initialisés ne sont jamais présentés comme neuf déblocages naturels.

## Chronomètre et performances observés

Échantillons immobiles de la branche, sur hôte logiciel ; mode `low` = réduction de pixels. Le début/fin d'une mesure peut être décalé d'une image par rapport au compteur actif.

| Niveau | Mode | Durée mesurée | Temps actif | Temps simulé | FPS logiciel |
| --- | --- | ---: | ---: | ---: | ---: |
| 1 | normal | 3.55 s | 3.62 s | 1.31 s | 7.4 |
| 1 | low | 3.57 s | 3.58 s | 2.16 s | 12.6 |
| 4 | normal | 3.61 s | 3.75 s | 1.32 s | 7.2 |
| 4 | low | 3.57 s | 3.57 s | 1.94 s | 11.2 |
| 7 | normal | 3.59 s | 3.63 s | 1.47 s | 8.2 |
| 7 | low | 3.51 s | 3.51 s | 2.28 s | 13.4 |

Le temps actif suit désormais la durée réelle, alors que le temps de simulation reste ralenti. Les résultats ne permettent pas d'annoncer 30 ou 60 FPS sur iPhone. Les risques de chauffe, mémoire, charge des futurs modèles et lenteur sur appareils réels restent ouverts.

## Contrôle du rendu et limites restantes

Captures examinées : accueil privé en portrait, jeu en paysage, scène derrière le sapin avant/après, écrans mobiles des contrôles. Le personnage est visible dans le cas corrigé ; ce test ne prouve pas l'absence d'occlusion à chaque position dans tous les mondes. Le procédé tramé est une fondation technique, pas la direction artistique finale du personnage.

Les collisions latérales, le décor non solide et le double dégât choc/chute demeurent ceux du jeu classique. Les résoudre pour une voiture et un sauvetage demandera un système distinct et des tests de migration. Les trois tenues de référence sont des images : aucun GLB riggé fidèle n'a été livré.

L'accueil et les liens ont été contrôlés sur le paquet exact servi localement. La réussite de déploiement privé est vérifiée séparément par l'hébergeur ; aucun parcours authentifié du site hébergé sur Safari n'est revendiqué.

### Vérification iPhone encore à exécuter

1. Safari sur appareil physique, portrait puis paysage, contrôle de l'encoche et des barres du navigateur.
2. Déplacer/sauter à deux pouces, sprinter, tomber et reprendre, puis recharger au checkpoint.
3. Mettre Safari en arrière-plan et revenir ; tester audio muet/actif et une interruption réelle.
4. Exporter/importer via Fichiers ; vérifier la persistance après fermeture et réouverture.
5. Jouer quinze minutes, surveiller fluidité, chauffe, stabilité et confort. Faire jouer une personne peu habituée au jeu tactile.

Ces cinq points ne sont pas cochés comme réussis. La version publique reste inchangée jusqu'à validation.
