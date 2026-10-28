# Mariam V2 — bible et plan de production

Livraison privée préparée le 28 octobre 2026. La V2 poursuit la scène livrée `3e981a4`, l'audit et ses sauvegardes. Code testé : `3c45c0581bc632b97844a4f12d4e2adb73cf1fb5`, branche `feature/soy-luna-vertical-slice`. Aucun déploiement GitHub Pages.

## Corrections réellement codées

Les ellipsoïdes de paysage de la V1 étaient centrés à y=-4 avec une échelle verticale de 6 : ils remontaient jusqu'à y=+2, au-dessus de la piste. Un shader de masque aléatoire appliqué à tous les décors créait le trou pixelisé autour de Mariam. La V2 retire ces îlots, place les berges sous la piste et éloigne les collines. Le shader de dissolution a été supprimé.

La transparence homogène est limitée aux boutiques, au pavillon et aux objets explicitement autorisés à obstruer la caméra. Des rayons vers le corps et la zone d'atterrissage déclenchent un effacement amorti de l'objet entier. Sol, obstacles et repères jouables restent opaques. Les groupes sont désormais masqués selon leur étendue complète, pas seulement leur centre.

Chaque contact tactile possède une commande et un identifiant. Relâchement extérieur, annulation, perte de capture, pause, orientation, perte de focus et page masquée remettent les commandes concernées à zéro. Le deuxième doigt ne peut pas voler le joystick. Touch.identifier et pointerId ne sont pas supposés identiques.

## Direction artistique appliquée

Promenade romantique au bord de l'eau : rose framboise, ivoire, laiton discret, végétation sauge, ciel lilas. Le rose guide la trajectoire et les décors périphériques restent plus calmes. Les enseignes personnalisées sont conservées : « Bisous & limonade », « Un tour avec toi », « Les patins roses ».

Ajouts en géométrie réelle : corniches, baies, mansardes, stores, vitrines, terrasse, parasols et chaises, pavillon, roses, feuillages instanciés et fanions animés. Grain de piste et terrazzo sont fabriqués localement sur canvas. Les couleurs sont intégrées aux sommets pour regrouper les objets par matière et zone ; textures et bump maps restent distinctes.

La finition reste inférieure aux références : grandes surfaces encore uniformes, façades peu variées, arrière-plan simple, animation et richesse narrative à approfondir. Aucune équivalence technique avec It Takes Two, Astro Bot ou Sackboy n'est revendiquée.

## Mariam 3D

La tenue Soy Luna est en volume : crop top et legging noirs, rollers roses, bijoux et lunettes. La V2 retravaille profils du visage, paupières, iris, normales, implantation des 84 mèches, mains et chaussures. Le modèle partage 20 os entre 12 maillages skinnés, pour 43 254 triangles. Deux morph targets animent clignement et sourire.

Les limites précises sont dans CHARACTER-V2.md. Construction par profils et courbes, sans sculpture Blender, retopologie manuelle ni clips GLB exportés. La chevelure masque encore trop le profil ; visage, sourire, matières et déformations ne sont pas fidèles au niveau demandé. Ce personnage n'est pas définitif.

## Gameplay livré

12 notes, trois cœurs, deux checkpoints, tremplin et passage latéral, deux obstacles floraux mobiles, trois roses facultatives, scores et record local. Maintenir le saut active les figures ; un appui court n'en récompense pas.

| Figure | Commande au décollage | Points de base |
|---|---|---:|
| Tour de lune | Saut maintenu, direction neutre | 100 |
| Étoile ouverte | Saut maintenu, droite | 125 |
| Arabesque | Saut maintenu, gauche | 125 |
| Croisé aérien | Saut maintenu + accélération, vitesse > 6 | 150 |
| Éclat du rythme | Saut maintenu + accélération, vitesse > 8 et près du temps musical | 200 |

Une figure nouvelle ajoute 75 points. Chaque secteur ne récompense qu'une figure pour limiter l'accumulation immobile. Bras, jambes, torse et réceptions changent de pose. Musique synthétisée originale à 108 BPM, démarrant après un geste, recalée après reprise ; aucun morceau commercial importé.

## Architecture et préservation

`simulation.js` sépare règles et rendu avec un pas fixe à 120 Hz. `track.js` partage piste et collisions. `controls.js` gère les contacts. `tricks.js` définit figures et défis. `character.js` porte le squelette commun, futur point d'intégration des vêtements. `world.js` et `environment-assets.js` construisent le décor. `camera.js` et `audio.js` restent indépendants.

La sauvegarde reste `mariam-luna-slice-v1`, version 1. Les collections facultatives figures, secteurs et roses acceptent les anciennes parties. Les trois clés historiques ne sont pas écrites. Reprise au checkpoint sûr, conservation des notes, points et cœurs ; les données restent propres au navigateur et à l'origine du site.

Mode normal : ombres, détails et résolution plafonnée à 1,5 fois le CSS. Mode léger : ombres désactivées et résolution plafonnée à 1. Objectif 60 FPS sur appareils compatibles, non validé sur iPhone. Le portrait demande de tourner le téléphone et suspend le jeu ; aucune rotation ni plein écran universellement forcés.

## Suite préservée, non produite ici

Après finition de Soy Luna : hub 3D vivant, Fashion Studio avec vrais vêtements, cabine, podium, poses/photos, sauvegardes de looks et réactions de Rishanth ; garde-robe et album. Cookie Kingdom, Noël et Barbie doivent avoir leurs propres mécaniques. Barbie comprend Mariam au volant de la décapotable rose et Rishanth passager.

Le sauvetage ailé reste à animer : Rishanth rattrape Mariam, la porte au checkpoint, séquences répétées passables. Dialogues conservés :

1. « Tu vas y arriver, je crois en toi ! »
2. « Allez Mariam, t’es forte, non ? »
3. « Je te croyais meilleure que ça, retente ta chance, dépêche-toi ! »

Le retour technique actuel au checkpoint n'est pas présenté comme cette cinématique.

## Provenance

Géométries, motifs et musique créés pour le projet. Three.js conserve la licence MIT ; les polices locales gardent leurs licences OFL. Les planches fournies servent de références, jamais de faux gameplay. Aucune nouvelle photo personnelle inventée et aucun asset extrait des jeux cités.
