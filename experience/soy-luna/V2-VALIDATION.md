# Mariam V2 — rapport de validation

Tests exécutés le 27 octobre 2026 ; livraison préparée le 28 octobre.

Code : `3c45c0581bc632b97844a4f12d4e2adb73cf1fb5`. Branche `feature/soy-luna-vertical-slice`. [Exécution GitHub Actions 40497369653](https://github.com/Ryaax93/Mariam/actions/runs/40497369653), job 122166101203 : succès. Artefact original 12731391770, SHA-256 `a12d35df7a4e8651e0cd9219aa57ebcb3936f6eae8c8431abfb0308cd88a3f02`.

## Résultats exécutés

**36/36 contrôles navigateur, 23/23 tests de simulation/modèle, 20/20 tests historiques.** Ces suites ne représentent pas 79 parcours joués.

Parcours gagné par commandes clavier ordinaires, sans téléportation ni victoire forcée : **12/12 notes, 2 471 points, un cœur restant, deux chutes et deux collisions**. Une chute était volontaire au checkpoint 144 ; l'autre est survenue pendant le parcours. Une figure réalisée et zéro rose collectée pendant ce parcours.

Rechargement et Continuer testés au checkpoint 74, avec notes et cœurs conservés. Chute volontaire : exactement un cœur retiré puis retour au checkpoint 144 avec personnage cadré. Les trois chaînes de sauvegarde historiques insérées avant les tests sont restées identiques. Migration des champs facultatifs V2 vérifiée en simulation.

Trois contacts simulés CDP Chromium : joystick + saut + accélération. Relâcher seulement saut conserve joystick et accélération. Sortir de la zone conserve le suivi ; lever le doigt remet le joystick à zéro. Annulation, pause et rotation libèrent les contacts. Ces essais ne remplacent pas un vrai iPhone.

## Défaut visuel contrôlé

La V1 exacte `3e981a4` et la V2 ont été rendues aux mêmes positions et avec la même caméra à 40, 83, 97 et 181 m. Les captures ont été inspectées : le terrain beige et le masque en pointillés ont disparu ; le sol jouable reste opaque. Un anneau de contrôle masque le personnage quand la protection est désactivée et devient uniformément transparent quand elle est activée.

663 rayons CPU, sur trois lignes longitudinales de 221 positions entre y=0,05 et y=2,8 : **125 intersections parasites V1, zéro V2**. Ce balayage n'est pas une preuve pour tous les angles possibles. Les comparaisons sont des scènes techniques fixes ; le parcours et la vidéo apportent une preuve distincte en mouvement.

## Images et vidéo

Les captures du parcours sont prises avec la simulation temporairement en pause et le panneau masqué, afin qu'un délai de capture ne laisse pas une direction active. Les vues face/profil/dos et les cinq poses sont issues du vrai modèle dans un viewer d'asset, pas d'une partie jouée.

La vidéo `evidence/v2/gameplay.mp4` est l'extrait continu 34–111 s de l'enregistrement du CI : vitesse originale, sans interpolation ni images générées, conversion H.264 et une ligne de remplissage pour la compatibilité. La piste audio n'est pas enregistrée. Le démarrage de la musique du jeu après interaction a été vérifié séparément. Les ralentissements du serveur restent visibles.

## Performances et écrans

Chromium sous Linux avec SwiftShader, mode léger, échantillon final après reprise : 195 images, **5.09 FPS**, médiane 183.4 ms, 95e percentile 383.4 ms, 4.333 s non simulées lors des images trop longues. Ce sont de faibles performances sur GPU logiciel ; **aucun chiffre iPhone ni 60 FPS validés**.

À 97 m en scène comparative, la V2 précédente utilisait 254 appels de dessin, la version actuelle 69. La V2 actuelle affiche 208 602 triangles, contre 92 746 pour la V1 : moins d'appels, davantage de géométrie. La fluidité ne peut pas être déduite du seul nombre d'appels.

Parcours 852×393 ; disposition vérifiée à 667×375, 932×430 et 393×852. Aucun débordement horizontal ; portrait tactile : message de rotation et pause. Aucune erreur JavaScript ou shader Chromium collectée. WebKit Linux charge et déplace le personnage sans erreur de page ; parcours complet et trois doigts non rejoués dans WebKit.

Le navigateur local ne fournit pas de contexte WebGL exploitable ; les preuves 3D proviennent du CI. Safari sur iPhone physique, encoches matérielles, chauffe, mémoire, sessions longues et interruptions système iOS restent non testés.

## État honnête de la livraison

| État | Éléments |
|---|---|
| Codé et vérifié dans le périmètre décrit | Terrain parasite, shader en grille, transparence limitée, contacts indépendants, parcours gagné, checkpoints, reprise et sauvegardes historiques |
| Codé, validation partielle | Cinq figures, deux obstacles mobiles, trois roses, musique rythmique, modèle et décor V2 ; une figure et zéro rose dans le parcours navigateur |
| Encore insuffisant | Visage/sourire, boucles et profil masqué par les cheveux, déformations des épaules/vêtements, richesse des matériaux et du décor |
| Non effectué | Safari iPhone physique, 60 FPS et chauffe mobile, parcours entièrement multitouch, toutes les figures et roses en parcours navigateur |
| Non livré | Hub, Fashion Studio, garde-robe complète, Barbie/conduite, Cookie Kingdom, Noël, autres tenues et sauvetage ailé |

**Le niveau artistique demandé n'est pas déclaré atteint.** Le modèle reste fabriqué par profils et courbes, sans sculpture/retopologie Blender ni export GLB final. Les limites sont détaillées dans CHARACTER-V2.md.

## Historique

Le run précédent `39654097611` échouait sur le parcours intégral, la collecte minimale et le checkpoint 144. Ces résultats restent des échecs. Après regroupement graphique et correction du conducteur de test (commandes groupées, captures en pause, délai augmenté), le présent run termine le parcours.

## Détail des contrôles navigateur

| Contrôle | Résultat |
|---|---|
| boot WebGL | Réussi |
| forward movement | Réussi |
| rig is skinned | Réussi |
| original soundtrack scheduled after gesture | Réussi |
| jump above ground | Réussi |
| pause freezes simulation | Réussi |
| two-finger steering and jump | Réussi |
| three simultaneous contacts | Réussi |
| release jump retains independent joystick and boost | Réussi |
| joystick tracks outside its original zone | Réussi |
| release outside clears joystick while boost held | Réussi |
| touch cancel clears input | Réussi |
| pause releases all pointer owners | Réussi |
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
| rotation clears held direction and pauses | Réussi |
| held jump earns a figure in actual gameplay | Réussi |
| clear track and opaque gameplay at 40 | Réussi |
| clear track and opaque gameplay at 83 | Réussi |
| clear track and opaque gameplay at 97 | Réussi |
| clear track and opaque gameplay at 181 | Réussi |
| body and landing framed | Réussi |
| WebKit Linux movement | Réussi |
| no Chromium JavaScript / shader errors | Réussi |

## À valider sur ton iPhone

1. Jouer en paysage ; maintenir joystick, saut et accélération, puis relâcher séparément et hors zone.
2. Pause, changement d'orientation et retour : aucune direction ne doit rester active.
3. Atteindre le checkpoint 74, recharger puis Continuer ; vérifier notes et cœurs.
4. Tester tremplin, passage latéral, obstacles mobiles et chute après le checkpoint 144.
5. Essayer les cinq figures et trois roses ; comparer les deux qualités pendant 15 minutes.

La version publique et le ciel d'étoiles original sont conservés. Cette livraison privée n'autorise aucune publication sur main.
