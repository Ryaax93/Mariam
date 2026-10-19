# Pour Mariam — Notre petit infini

Expérience romantique, mobile d’abord, publiée sous `/Mariam/experience/`.
Le fichier `/index.html` et son ciel d’étoiles restent inchangés.

## Parcours

1. Ouverture : décor nocturne, particules, profondeur et entrée animée.
2. Rencontre pendant le live TikTok : un commentaire puis le premier message.
3. Décembre : la vraie photo de la voiture, sous une buée effaçable au doigt.
4. Premier Noël : photos des cadeaux, guirlande lumineuse et neige.
5. Petites attentions : trois souvenirs photographiques à ouvrir.
6. Trois enveloppes, une séquence finale au défilement et une dernière déclaration.

Les dates précises, dialogues historiques mot pour mot et détails non fournis ne sont pas inventés. La carte du live est identifiée comme une remise en scène. Les lettres sont de nouveaux textes rédigés pour ce cadeau.

## Modification

- `index.html` : contenu des chapitres et structure accessible.
- `style.css` : direction artistique, responsive, animations CSS, réduction des mouvements.
- `app.js` : textes des lettres et souvenirs, interactions, particules, composition musicale locale.
- `assets/IMG_*.jpeg` : six images personnelles fournies et conservées sans modification de leurs pixels. Le cadrage est effectué uniquement à l’affichage en CSS.
- `assets/night-garden.webp` : décor fantastique généré ; ne représente aucun souvenir ou lieu personnel réel.

Aucun build, CDN, compte, suivi, cookie ou bibliothèque JavaScript distante. Polices locales Cormorant Garamond et Manrope, licences OFL incluses. Le son est une composition instrumentale synthétisée localement, activée uniquement par une action volontaire. Aucune autorisation de microphone, de caméra ou de mouvement n’est demandée.

Le défilement est natif. Les modales utilisent `<dialog>`, la buée utilise Pointer Events et un canvas. Les particules sont plafonnées et leur résolution est limitée ; les animations et l’audio sont suspendus quand la page est masquée. `prefers-reduced-motion` supprime les déplacements et rend la finale directement lisible. Un bouton remplace le geste d’effacement pour l’accès au clavier.

## Décor généré

Outil : Imagegen intégré. Asset de projet : `experience/assets/night-garden.webp`, conversion compressée de l’image générée, sans altération de photos personnelles.

Prompt utilisé :

> Use case: stylized-concept. Asset type: full-bleed atmospheric background for a beautifully art-directed romantic cinematic website, no typography. Create a sophisticated magical-realism film still in a tall portrait 2:3 composition, painterly cinematic realism with fine film grain. A vast midnight plum and charcoal blue sky above a still black mirror lake; tiny scattered stars, wisps of dusky pink clouds, a delicate warm ivory crescent moon in upper right. At the lake horizon in the LOWER THIRD, an elegant very tall thin oval doorway of warm champagne golden light stands on a distant little stone causeway, reflected in water, with a few very small floating golden lights leading toward it. Dark barely visible pine-covered hills frame lower left and right, intricate mist. Restrained dusky gold / dusty rose / ink plum color grading, subtle volumetric haze and immense atmospheric depth. The CENTER and upper 2/3 are primarily dark richly textured negative space to put large ivory French editorial typography OVER the image later, no bright nebula behind center text. Foreground lower edge dark vignette, high production value of a romantic fantasy film opening. No people, no silhouettes of people, no faces, no hearts, no text, no letters, no watermark, no borders. This is a dreamlike illustrated atmosphere, not a depiction of any real personal memory.
