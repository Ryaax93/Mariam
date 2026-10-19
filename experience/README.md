# Mariam — Les mondes de nous

Un cadeau personnel jouable sur téléphone et ordinateur, inspiré des décors de la vidéo d’animation fournie par Rishanth.

## Deux expériences préservées

- `/experience/` : l’aventure en 3D, neuf niveaux dans trois univers.
- `/experience/story.html` : le précédent monde miniature, ses souvenirs et ses interactions, conservé intégralement.
- `/` : le site original, ses étoiles et ses mots doux. Aucun fichier à la racine n’a été modifié.

## Jouer

**Téléphone** : joystick à gauche, saut et sprint à droite. Les contrôles acceptent plusieurs doigts simultanément. **Clavier** : flèches / ZQSD / WASD, Espace, Maj et Échap.

Chaque niveau demande de récupérer trois objets puis de rejoindre le portail. Les cristaux rapportent une deuxième étoile à partir de 80 % de collecte ; un parcours sans chute ni collision rapporte la troisième. Trois vies, des points de reprise, des reprises de niveau et un chronomètre rendent les parcours rejouables. Les records et les souvenirs gagnés sont conservés localement sur l’appareil.

| Monde | Niveaux | Mécaniques |
| --- | --- | --- |
| Luna Park, inspiré de Soy Luna | Premiers tours de piste ; La piste des étoiles ; Le grand final de Luna | Rollers, accélérateurs, plateformes mobiles, obstacles lumineux, notes à collecter |
| Cookie Kingdom | La vallée Cookie Dough ; La rivière Choco Bons ; Le château des délices | Guimauves rebondissantes, tapis de caramel, plateformes mobiles, biscuits roulants, glaces à collecter |
| December Dream | La tournée des cadeaux ; Le lac aux aurores ; Minuit, tous les deux | Sol glissant, boules de neige, plateformes mobiles et cadeaux à rapporter |

Les niveaux débloquent neuf textes et les photographies réellement accessibles dans le projet. La dernière victoire ouvre une déclaration finale. Les photos ne sont ni générées ni remplacées.

## Technique

Three.js 0.170.0, WebGL, modèle physique déterministe à 90 Hz, Pointer Events, Web Audio. Pas de CDN, de compte, de collecte de données ou de dépendance réseau pendant la partie. Le score musical original change avec le monde ; aucun enregistrement de Soy Luna ou de la vidéo n’est utilisé. Le mode léger limite la résolution de rendu. Les effets doux atténuent les transitions et les particules, sans modifier les règles du jeu.

```sh
cd experience
npm ci
npm test
npm run build
```

`game.js` et `app.js` sont les bundles publiés, permettant une livraison statique directe par GitHub Pages. Les sources du nouveau jeu se trouvent dans `src/adventure/`. Les tests de parcours utilisent uniquement des commandes ordinaires de déplacement, de saut et de sprint. Ils n’altèrent pas les vies ou les conditions de victoire.

La musique démarre après un geste, conformément aux restrictions des navigateurs mobiles. La partie se met en pause quand l’onglet est masqué. La perte du contexte WebGL affiche une proposition de rechargement ; les niveaux déjà gagnés restent sauvegardés.

## Direction artistique et provenance

Illustrations originales créées avec l’outil intégré de génération d’images à partir d’une planche de référence extraite de la vidéo fournie par l’utilisateur. Ce sont des illustrations, pas des photographies du couple. Les personnages et éléments jouables sont des modèles procéduraux du moteur 3D.

- `assets/adventure-cover.webp` : couverture romantique montrant un couple devant un portail en cœur, trois mondes flottants, couleurs rose, crème, améthyste et or. Prompt : « Portrait cinematic 3D animated romantic adventure cover; warm brown-skinned couple, woman with long dark curly hair, man with short curly hair, pink heart portal, neon roller rink, cookie dough kingdom and snowy Christmas village. Reference animation style only, single coherent scene, no text or UI. »

- `assets/world-roller.webp` : royaume de roller dans les nuages, discothèques, néons roses et turquoise. Prompt : « Portrait 3D animated fantasy neon roller kingdom over lavender clouds, curved tracks, disco balls, romantic pavilions, palms and star lanterns. Look down at 45 degrees. Rich perimeter, open atmospheric lower centre for gameplay, no text, no characters. »
- `assets/world-sweet.webp` : montagnes de Cookie Dough, cascades de chocolat et château de gaufrettes. Prompt : « Portrait 3D animated cookie dough kingdom, giant vanilla ice cream mountains with chocolate chunks, wafer castle, caramel rivers, cookies, pink candy trees. Golden light, open peach-mist lower centre for gameplay, no text or characters. »
- `assets/world-winter.webp` : village de Noël, neige, chalet et aurore. Prompt : « Portrait 3D animated enchanted snowy Christmas village at blue hour, golden chalet windows, teal snowy evergreens, candy canes and gift parcels, aurora and a frozen river. Open blue-mist lower centre for gameplay, no text or characters. »

Les panoramas sont des illustrations de fond ; le personnage, les plateformes, les objets et les collisions sont rendus et animés en temps réel. Leurs formats WebP sont optimisés pour la livraison mobile.

Les mentions Ben & Jerry’s Cookie Dough, Kinder Choco Bons et Soy Luna renvoient aux goûts demandés par l’utilisateur ; le cadeau n’est pas affilié à ces marques. Les étiquettes des accessoires 3D sont dessinées dans le code. Les licences des polices et de Three.js sont présentes dans le dépôt.

Voir `VALIDATION.md` pour les vérifications et leurs limites.
