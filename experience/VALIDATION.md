# Validation du jeu — Le monde que tu as allumé

19 octobre 2026. Cette validation concerne le nouveau jeu 3D, qui remplace l’expérience précédente.

## Périmètre

Parcours complet exécuté dans Chromium 140 avec Playwright, sur un vrai rendu WebGL (rendu logiciel dans le conteneur), avec viewport 393 × 852, densité 2 et événements tactiles. Les glissements de rotation, du premier message, de la buée et du baiser utilisent de véritables événements tactiles injectés dans le navigateur.

55 vérifications fonctionnelles réussies. Six vérifications complémentaires après ajustement de la finale et des cadrages. Aucune erreur JavaScript ni requête de ressource en échec dans le parcours complet.

Captures réellement inspectées : ouverture, village, quatre souvenirs, cadeaux, photos, lettres, carnet et finale. Formats contrôlés : 320 × 568, 393 × 852, 430 × 932, 852 × 393 et 1440 × 900. Les images originales restent inchangées ; le recadrage des captures de souvenirs est uniquement visuel en CSS.

## Vérifications fonctionnelles

- Réussi : WebGL world actually renders.
- Réussi : Original music does not autoplay.
- Réussi : All local fonts load.
- Réussi : Start enters village.
- Réussi : Audio context runs after voluntary start.
- Réussi : Score produces live oscillator nodes.
- Réussi : Audio output contains a real signal.
- Réussi : Touch drag rotates the actual world.
- Réussi : Future chapter stays locked.
- Réussi : Hidden photo 0 opens.
- Réussi : Hidden photo 0 loads.
- Réussi : Hidden photo 1 opens.
- Réussi : Hidden photo 1 loads.
- Réussi : Hidden photo 2 opens.
- Réussi : Hidden photo 2 loads.
- Réussi : Three treasures saved.
- Réussi : Live music theme.
- Réussi : Wrong comment gives a playful hint.
- Réussi : Touch drag sends message and unlocks light.
- Réussi : December intimate music theme.
- Réussi : Real touch erases fog.
- Réussi : Two lights meet and second memory completes.
- Réussi : Christmas music theme.
- Réussi : Wrong note can retry.
- Réussi : Melody hint is visual.
- Réussi : Christmas real photo 0 opens.
- Réussi : Christmas real photo 1 opens.
- Réussi : Third gift contains cuddle voucher.
- Réussi : Christmas chapter completes.
- Réussi : Letters music theme.
- Réussi : Letter 0 opens.
- Réussi : Letter 1 opens.
- Réussi : Letter 2 opens.
- Réussi : Wrong word has recoverable hint.
- Réussi : All four memories completed.
- Réussi : Finale scene and theme.
- Réussi : Final declaration opens.
- Réussi : Audio off actually suspends.
- Réussi : Music resumes.
- Réussi : Manual light mode works.
- Réussi : Journal lists completed places.
- Réussi : Original stars link preserved.
- Réussi : Progress persists on reload.
- Réussi : Reload still does not autoplay.
- Réussi : Accessible fog alternative works.
- Réussi : small viewport has no horizontal overflow.
- Réussi : large viewport has no horizontal overflow.
- Réussi : desktop viewport has no horizontal overflow.
- Réussi : landscape viewport has no horizontal overflow.
- Réussi : Replay cancellation keeps progress.
- Réussi : Confirmed replay resets progress.
- Réussi : No JavaScript or console errors.
- Réussi : No failed asset requests.
- Réussi : No-WebGL accessible fallback starts.
- Réussi : Fallback and reduced motion remain fully playable.

## Derniers ajustements

- Réussi : Constellation reaches its complete shape on real elapsed time.
- Réussi : small-intro start buttons remain inside screen.
- Réussi : large-intro start buttons remain inside screen.
- Réussi : desktop-intro start buttons remain inside screen.
- Réussi : Reduced motion disables idle rotation.
- Réussi : Final visual check has no JS errors.

La finale utilise le temps écoulé réel : les étoiles terminent leur formation même lorsque le rendu est lent. La position et la luminosité du prénom ont été contrôlées visuellement. Le mode paysage et le petit format ont reçu des ajustements de composition.

Le test audio confirme un AudioContext actif après consentement, des oscillateurs actifs et un signal effectivement mesuré en sortie. Il vérifie également le changement de thème et l’arrêt/reprise du contexte audio. Les thèmes sont des compositions synthétisées localement, sans samples distants.

## Préservation et limites

Toutes les modifications restent dans `/experience/`. L’identifiant Git du fichier original `/index.html` reste `843ea7b2fbc108db40ddbecb384cadfdb2ae547f`.

Ces contrôles émulent des dimensions et gestes de téléphone ; ils ne constituent pas un essai sur un iPhone physique, ni une certification de fluidité Safari iOS. La vitesse du rendu logiciel de cet environnement ne permet pas de conclure sur les FPS d’un appareil réel. Le jeu prévoit un mode léger et un parcours de secours sans WebGL.
