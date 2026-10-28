# Soy Luna — rapport de validation du 21 octobre 2026

## Résultat et périmètre
Une première scène entièrement 3D est jouable de l'accueil au final. La finition du personnage et du parc reste partielle : ce n'est pas encore le niveau artistique final demandé.

Branche `feature/soy-luna-vertical-slice`, base auditée `377ad0c71c2939d7e22654b0b1cab4993344ae66`.
Code de jeu vérifié : `8ea9ba73ac5793451432eac2a064e6e2c30a58ee`. Révision de fusion technique exécutée : `3506ea19ce2e2c658bfbf98c721e373f4c387488`.
[Exécution GitHub Actions](https://github.com/Ryaax93/Mariam/actions/runs/39529524573).
Preuves JSON et 15 captures dans `evidence/`. Les images proviennent de WebGL ; character-* est un viewer du vrai modèle, distinct du gameplay.

## Tests exécutés
- 20 tests de régression de l'expérience classique : réussis dans le même workflow.
- 17 tests de simulation, collision, sauvegarde et géométrie : réussis.
- 25/25 contrôles navigateur réussis.
- Chromium Linux / SwiftShader : parcours complet avec événements clavier, sans téléportation ni victoire forcée ; saut et réception ; pause ; chute volontaire au secteur 144 ; retour au checkpoint.
- Deux contacts tactiles simultanés via CDP : déplacement et saut, puis annulation ; aucune commande maintenue après annulation.
- Rechargement au secteur 74 : reprise proposée, notes et cœurs conservés.
- 852 × 393 pour le parcours ; 667 × 375, 932 × 430 et 393 × 852 pour l'interface. Message paysage en portrait, sans débordement horizontal.
- WebKit Linux : lancement et déplacement, aucune erreur de page. Le parcours complet n'a pas été rejoué sous WebKit. Ce n'est pas Safari sur iPhone physique.
- Aucune erreur JavaScript/shader Chromium observée pendant cette exécution.

Arrivée : **11/12 notes, 2673 points, 1 cœur restant, 2 chutes (dont une imposée par le test), 2 collisions**, 40.44 secondes actives. Ce n'est pas une partie parfaite.

## Performance : objectif matériel non validé
Sur le serveur au rendu logiciel, la portion finale après reprise comprend 273 images, 9.71 FPS moyens, p50 100.0 ms et p95 199.9 ms. Rattrapage de simulation abandonné : 0.25 s. À l'arrivée en mode léger : 37 appels et 45120 triangles ; ces compteurs sont ceux de l'image finale, pas les maxima du parcours.

La scène de caméra séparée mesure 8.80 FPS sur seulement 8 images. Ces scénarios ne sont pas des benchmarks comparables. Le démarrage soigné est lent sur le GPU logiciel.

**Les 60 FPS sur iPhone ne sont pas démontrés.** Le mode léger coupe les ombres et les fleurs, borne le décor à 66 unités au lieu de 96 et plafonne le DPR à 1 au lieu de 1,5. Décor regroupé par matériau et secteurs de 24 unités. Mesures réelles iPhone, mémoire, chauffe, autonomie et stabilité sur 15 minutes restent nécessaires.

Personnage : 20 os, 10 maillages skinnés, 23 940 triangles. Poids normalisés et coordonnées finies vérifiés. Aucun fichier Blender ni asset acheté n'est prétendu disponible.

## Caméra : preuve et limites
La caméra suit la courbe de la piste avec amortissement. Un corridor d'effacement protège le corps et la projection de la zone d'atterrissage ; seuls les décors s'effacent, pas le personnage, le sol ou les obstacles jouables.

`camera-before.jpg` / `camera-after.jpg` : même gros anneau ajouté volontairement devant la caméra. Sans protection, Mariam est cachée ; avec protection, son corps et ses rollers sont visibles. Corps et point d'atterrissage sont dans le cadre. Le parcours a aussi testé saut et respawn avec cette caméra.

Cette preuve contrôlée ne valide pas toutes les occultations possibles ni le confort sur iPhone. **Les neuf anciens niveaux restent inchangés : leur bug d'anneaux n'est pas déclaré corrigé.** L'enregistrement iPhone demandé n'était pas accessible localement. Les planches officielles ont été examinées dans la conversation ; le fichier local MOV disponible est une animation de référence, pas cet enregistrement (images examinées à 12 s et 65 s).

## Problèmes rencontrés et actions
| Constat | Qualification | Action |
| --- | --- | --- |
| Grand anneau devant Mariam | Reproduit dans la scène de régression | Corridor corps/réception, captures avant/après |
| Piste pâle et façades tournées à l'écart du joueur | Constat visuel | Couleur, éclairage et orientation corrigés |
| Jonction du legging et implantation des cheveux | Constat visuel du premier modèle | Jonction corrigée, base de cheveux ajoutée ; coiffure encore provisoire |
| Musique non raccordée à la boucle initiale | Défaut trouvé dans le code | Ordonnanceur appelé ; AudioContext running et notes planifiées testés |
| Bord ivoire visible mais non praticable | Incohérence de collision | Collision étendue au bord visible, test dédié |
| Délais fixes mouvement/saut trop courts | Échecs réels des runs 39528638835 et 39528945545 | Attente de l'état rendu, toujours avec timeout et assertions ; derniers runs réussis |
| Fusion globale du décor coûteuse | Risque de performance | Découpage spatial et distance bornée ; performance iPhone encore inconnue |
| Prévisualisation intégrée sans WebGL | Blocage réel GL_RENDERER Disabled | Gameplay vérifié par le workflow navigateur, pas par cette prévisualisation |

La musique a été contrôlée par son déclenchement et ses nœuds ; aucune écoute sur iPhone n'est revendiquée. Les échecs précédents ne sont pas présentés comme des tests réussis.

## Conservation
Comparaison Git avec la base auditée : **aucun fichier existant modifié**. Root original : blob `843ea7b2fbc108db40ddbecb384cadfdb2ae547f`. La branche main et GitHub Pages ne sont pas modifiés. PR brouillon vers la branche d'audit uniquement.

Les trois chaînes témoins `mariam-worlds-adventure-v1`, `mariam-worlds-checkpoint-v2`, `mariam-little-world-v1` sont strictement identiques après le parcours. Nouvelle clé séparée : `mariam-luna-slice-v1`. Pas de transfert automatique de sauvegarde entre domaines.

## Terminé, partiel, restant
| Élément | État |
| --- | --- |
| Bible, architecture, registre des assets | Livrés |
| Piste, patinage, freinage, élan, saut, figure, notes, tremplin / contournement, final et record | Implémentés ; parcours exécuté |
| Cœurs, checkpoints, sauvegarde/reprise, tactile, paysage et options | Implémentés et testés selon le détail ci-dessous |
| Personnage 3D riggé et tenue Soy Luna | Fonctionnels, fidélité visuelle partielle |
| Visage, mains, boucles, rig facial, expressions, clips artistiques | Restent à finaliser ; modèle non définitif |
| Caméra du nouveau circuit | Contrôlée sur fixture et parcours ; iPhone restant |
| Hub 3D, Fashion Studio, Barbie, nouveaux mondes et autres tenues | Restants après validation de cette scène |
| Sauvetage avec Rishanth ailé et portage | Non réalisé ; respawn technique seulement |
| Plateformes mobiles classiques | Conservées, absentes de cette piste, non retestées pendant cette livraison |

## Détail des contrôles navigateur
| Contrôle exécuté | Résultat |
| --- | --- |
| boot WebGL | Réussi |
| forward movement | Réussi |
| rig is skinned | Réussi |
| original soundtrack scheduled after gesture | Réussi |
| jump above ground | Réussi |
| pause freezes simulation | Réussi |
| two-finger steering and jump | Réussi |
| touch cancel clears input | Réussi |
| continue offered after reload | Réussi |
| reload resumes checkpoint and collected notes | Réussi |
| steering off edge charges exactly one heart | Réussi |
| fall returns to checkpoint with camera | Réussi |
| checkpoint reload and fall exercised | Réussi |
| full course won by keyboard events | Réussi |
| course collects notes | Réussi |
| three legacy save strings unchanged | Réussi |
| no overflow 667x375 | Réussi |
| rotate message 667x375 | Réussi |
| no overflow 932x430 | Réussi |
| rotate message 932x430 | Réussi |
| no overflow 393x852 | Réussi |
| rotate message 393x852 | Réussi |
| body and landing framed | Réussi |
| WebKit Linux movement | Réussi |
| no Chromium JavaScript / shader errors | Réussi |

## Prochaine validation
Safari sur iPhone physique en paysage : modes léger/soigné, confort à deux pouces, élan + saut, tremplin, chute/reprise, rotation, interruption audio, chauffe sur 15 minutes. La fidélité à Mariam reste à valider avant l'extension.
