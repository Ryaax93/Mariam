# Mariam — Le monde que tu as allumé

Un jeu romantique pour téléphone, publié dans `/Mariam/experience/`.
La page originale à la racine et son ciel d’étoiles sont conservés intégralement.

## Le jeu

Une boule à neige en véritable 3D contient un village miniature : chalets, voiture, sapin, boîte aux lettres, personnage, luciole, neige et guirlandes. Le village tourne au doigt ; un toucher sur le sol déplace le petit personnage. Chaque souvenir terminé rallume des fenêtres et des lumières.

1. Retrouver le commentaire de Mariam, puis glisser une lumière vers l’enveloppe du premier message.
2. Effacer la buée au doigt sur la vraie photo de la voiture, puis rapprocher les deux lumières.
3. Reproduire une séquence musicale et visuelle de quatre notes, puis ouvrir trois cadeaux.
4. Ouvrir trois lettres et remettre une phrase dans l’ordre.
5. Finale : les lumières s’assemblent en « MARIAM », puis ouvrent la déclaration.

Trois souvenirs photographiques supplémentaires sont cachés près du bonhomme de neige, du banc et du petit trésor. Le carnet permet de revoir les chapitres débloqués. La progression reste sur l’appareil via `localStorage` ; on peut recommencer après une confirmation. Aucun compte, serveur applicatif, cookie de suivi ou service tiers n’est requis.

Les six photos sont celles fournies par l’utilisateur ; aucun portrait ni souvenir photographique n’est généré. Le village est une interprétation fantastique, pas une reconstitution d’un lieu réel. Les commentaires sont explicitement remis en scène et les lettres sont des textes créés pour ce cadeau.

## Musique

Six thèmes instrumentaux originaux, synthétisés avec Web Audio : boule à musique, live, décembre, Noël, lettres et finale. Mélodie, basse, accords, timbres et tempo varient selon le lieu. Réverbération, compression douce, fondus et sons de réussite sont locaux. Le son commence uniquement après une action volontaire ; le bouton permet de le couper. La musique et le rendu s’arrêtent lorsque la page est masquée. Aucune voix personnelle n’est simulée.

## Sources et construction

- `index.html` : interface, dialogues et contenu de secours.
- `style.css` : présentation responsive et animations d’interface.
- `src/world.js` : géométrie 3D, caméra, interactions tactiles et particules.
- `src/audio.js` : partition et synthèse audio.
- `src/main.js` : narration, jeux, progression, dialogues et accessibilité.
- `app.js` : bundle déployé, comprenant Three.js 0.170.0. Il n’y a aucun CDN à charger.
- `assets/IMG_*.jpeg` : six photos d’origine, non modifiées.
- `vendor/THREE-LICENSE.txt` et les licences des polices dans `assets/` : mentions de licence.

Pour reconstruire après modification des sources :

```sh
cd experience
npm ci
npm run build
```

Pour jouer, servir le dossier du dépôt avec un serveur HTTP statique et ouvrir `/experience/`. GitHub Pages sert directement les fichiers ; aucun build distant n’est nécessaire.

## Adaptation téléphone

Rendu WebGL avec géométries statiques fusionnées, ombres statiques et densité de pixels plafonnée. Un mode léger réduit la résolution et les ombres. Une version sans WebGL conserve les jeux et les souvenirs si la 3D est indisponible. Les gestes complexes ont un bouton alternatif. Les notes sont aussi identifiées par couleur et numéro, et un indice reste accessible sans le son. Les dialogues utilisent l’élément natif `dialog`. Les animations décoratives sont réduites avec `prefers-reduced-motion`.

Voir `VALIDATION.md` pour le périmètre exact des vérifications et les limites des tests.
