# Mariam — asset 3D de travail V2

Les planches officielles fournies ont guidé la reprise. Le code contient le maillage réel, le squelette et les animations ; aucune image de personnage ne remplace le modèle. Le statut reste `reference-fidelity-unvalidated` : ce n'est pas une sculpture finale approuvée.

## Changements produits

- Surface du visage retracée avec davantage de sections : menton, mâchoire, pommettes, front. Pommettes intégrées à la surface, sans sphères posées sur les joues.
- Yeux en amande : surface bombée bornée par les paupières, iris bruns, pupilles, reflets, cils. Sourcils effilés, nez profilé, arc de Cupidon et lèvre inférieure.
- Deux morph targets réels de position, `clignement` et `sourire`, appliqués aux yeux/paupières et à la bouche/joues. Animation douce ; ce n'est pas un rig facial complet.
- Taille/épaules/bras affinés, paumes profilées et cinq doigts géométriquement distincts par main. Les doigts suivent l'os de la main ; ils ne sont pas articulés individuellement.
- 84 mèches longues continues, à section variable et extrémités effilées, réparties selon la courbure de la tête. Implantation en raie et douze mèches encadrant le visage. Trois os secondaires pondérés animent la chevelure.
- Crop top et legging en volumes séparés, ourlet, ceinture et coutures latérales. Tenue Soy Luna uniquement.
- Rollers : coques profilées, cols, semelles, lacets croisés, œillets, huit roues avec moyeux/axes et deux freins avant. Lunettes avec branches/lentilles, collier cœur, boucles d'oreille et bracelets à perles.
- Cinq figures articulées : rotation resserrée, étoile bras/jambes déployés, arabesque asymétrique, croisé avec regroupement, figure rythmique alternant les jambes. Lissage des poses et réception différenciée.

## Budget et vérifications exécutées

Contrôle Node après fabrication : 43 254 triangles, 12 maillages skinnés, 20 os partagés. Toutes les coordonnées et normales sont finies. Poids de peau normalisés. Nombre de sommets des morph targets identique au maillage. Les cinq poses produisent des configurations d'os distinctes et des matrices finies. Syntaxe JavaScript vérifiée.

Ces contrôles ne prouvent ni la beauté du rendu, ni sa fidélité aux planches, ni les FPS sur iPhone. Les captures face/profil/dos/portrait et les figures en mouvement doivent être contrôlées dans la validation de la scène. Le viewer `test/character.html` expose les boutons et fonctions de revue correspondants ; ce viewer est un outil de contrôle de l'asset, pas un niveau jouable.

## Limites et suite artistique

Le maillage reste fabriqué par profils et courbes de code. Aucun fichier Blender, travail de sculpture manuelle, retopologie, export GLB ou capture de mouvement n'est revendiqué. Les mèches restent stylisées et ne bénéficient pas de collisions physiques avec les épaules. Les animations sont des poses procédurales interpolées, sans bibliothèque de clips exportée. Le visage possède seulement deux morph targets ; sourire ouvert, dents/langue, émotions et phonèmes restent à produire. UV/atlas peau/vêtements et déformation des plis restent sommaires. Les mains n'ont pas d'os de doigts. Le sac rose, d'autres coiffures et les tenues Noël/Cookie Dough restent à développer.

La prochaine étape de personnage devrait être une sculpture artistique et une retopologie d'après les trois vues, suivies d'une validation de ressemblance par l'utilisateur, de poids de déformation aux coudes/épaules/hanches, de clips complets et d'un export GLB optimisé. Le modèle V2 est une amélioration mesurable de la base, pas une équivalence graphique aux références ni aux productions console citées.

## Contrat d'animation

`animate(dt, state, heading)` conserve l'API existante. `state.trickName` vaut `rotation`, `etoile`, `arabesque`, `croise` ou `rythme`. `trickPhase` progresse de 0 à 1 sur le temps de vol prévu ; la rotation se termine à 0,88 pour anticiper la réception. Le `trick` historique sert de fallback. `landing` décroît de 0,4 à 0. Les champs `grounded`, `v`, `vl`, `status` restent utilisés. Une phase interrompue trop tôt peut provoquer un rattrapage d'orientation ; c'est à vérifier avec les sauts courts et les rebords.

## Provenance

Géométries et mouvements de ce fichier créés spécifiquement pour le projet à partir des références fournies par l'utilisateur. Aucune ressource commerciale ou modèle tiers importé. Le moteur Three.js conserve sa licence MIT déjà présente dans le dépôt.

## Reprise après première capture réelle

La capture CI rapprochée révélait des yeux écarquillés, une calotte angulaire occultant les sourcils, une couture de normales au milieu du front et des mèches trop ajourées. La reprise code lisse les normales du raccord, remonte et arrondit la ligne de cheveux, borne les iris par l’ouverture des paupières (plus de sphères saillantes), réduit le relief des lèvres, densifie 84 mèches plus fines et ajoute une surface de volume intérieure ondulée derrière les boucles. La matière des cheveux est moins brillante. Le budget final est de 43 254 triangles. Cette reprise doit encore être comparée aux références sur la nouvelle capture ; elle ne constitue pas une validation de ressemblance.
