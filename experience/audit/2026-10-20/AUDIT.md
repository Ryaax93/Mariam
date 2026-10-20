# Audit du jeu Mariam — 20 octobre 2026

## Périmètre et méthode

Version auditée : `fa608ce5e925f7d5f66582f2025a262656661c16`, branche publique `main`. L'audit a précédé les modifications du jeu. La branche de travail est `audit/refonte-mariam-20261020`. Le site original à la racine doit rester strictement identique.

Les parcours ont été exécutés dans Chromium 140 avec Playwright 1.55, sous Linux, avec un rendu WebGL logiciel SwiftShader. Un contrôleur de parcours émet les événements clavier ordinaires ; il lit l'état de diagnostic mais ne téléporte pas le personnage et ne force pas la victoire. Les contrôles tactiles utilisent des événements tactiles du navigateur, y compris deux doigts simultanés.

La navigation directe vers GitHub Pages a échoué avec `ERR_EMPTY_RESPONSE` dans le navigateur de test. Les ressources publiques ont donc été téléchargées et comparées au dépôt, puis servies localement : 20 fichiers d'exécution identiques, ainsi que la page originale. Ce contrôle permet de tester le code public ; il ne vaut pas un parcours de bout en bout sur le réseau GitHub Pages.

Résolutions examinées : 393 × 852, 320 × 568, 430 × 932, 852 × 393 (paysage), 1440 × 900. Les parcours utilisent un DPR de 1 ; les mesures statiques demandent un DPR de 3, plafonné par le moteur à 1,6 ou 1 en mode léger.

**Aucun iPhone physique ni Safari iOS n'a été testé.** Émuler sa résolution et ses commandes ne reproduit pas son GPU, sa mémoire, ses barres de navigation, ses zones de sécurité, sa température ou ses interruptions audio. La fluidité réelle sur iPhone reste à valider.

Un nettoyage automatique de l'espace de travail a retiré des fichiers non publiés pendant la mission. Les relevés initiaux de campagne, de comparaison publique et du modèle ont été conservés. Les scénarios ciblés ont été relancés sur le code initial avant de reconstruire les corrections. Les nouveaux résultats sont archivés séparément : aucune réussite de la branche de test ne remplace un échec de l'audit initial.

## Dépôt et architecture

L'inventaire initial comprend 40 fichiers suivis, environ 3,95 Mo. Il n'y a ni backend ni base distante.

| Partie | Contenu et responsabilités |
| --- | --- |
| `index.html` à la racine | Ciel d'étoiles Canvas 2D et 24 mots doux ; indépendant de l'aventure |
| `experience/index.html`, `game.css`, `game.js` | Interface et bundle de l'aventure actuelle |
| `experience/src/adventure/main.js` | Écrans, entrées clavier/tactiles, sauvegarde, boucle et résultats |
| `levels.js` | Trois univers, neuf niveaux, dialogues et souvenirs |
| `physics.js` | Déplacements, saut, sprint, plateformes, dégâts, checkpoints et victoire |
| `render.js` | Scène Three.js, personnage procédural, décors, effets et caméra |
| `sound.js` | Musique synthétisée et effets par événements |
| `story.html`, `app.js`, `style.css`, autres sources | Ancien petit monde de souvenirs, conservé |
| `assets/` | Six photos accessibles, illustrations WebP, polices et icône locales |
| `tests/` | Tests du modèle existant |
| `package.json`, verrouillage | Three.js 0.170.0 et esbuild 0.25.0 ; compilation locale statique |

Le personnage est construit avec des primitives et des matériaux partagés. Aucun modèle GLB, squelette ou ensemble d'animations de personnage fidèle aux nouvelles références n'existe. Les illustrations de fond ne sont pas des environnements 3D explorables. Les photos présentes sont réelles et accessibles ; aucune photo personnelle supplémentaire n'a été inventée.

Deux clés locales sont à conserver : `mariam-worlds-adventure-v1` pour les records et options de l'aventure ; `mariam-little-world-v1` pour le village de souvenirs. Changer de domaine ne transfère pas automatiquement le stockage du navigateur.

## Parcours des neuf niveaux sur la version initiale

La première série part d'une progression neuve et arrive au niveau 6. Après sa défaite, des records de test ont été initialisés pour accéder aux niveaux restants. Ce déverrouillage est une **fixture d'accès**, pas une campagne terminée. Les parties elles-mêmes sont jouées par les entrées ordinaires.

| Niveau | Résultat observé | Temps du jeu | Cœurs restants | Chutes / chocs | FPS logiciel moyen |
| --- | --- | ---: | ---: | ---: | ---: |
| 1. Premiers tours de piste | Gagné | 8,21 s | 2 | 0 / 1 | 13,5 |
| 2. La piste des étoiles | Gagné | 12,92 s | 3 | 0 / 0 | 12,9 |
| 3. Le grand final de Luna | Gagné | 18,29 s | 1 | 0 / 2 | 12,1 |
| 4. La vallée Cookie Dough | Gagné | 8,28 s | 1 | 0 / 2 | 13,2 |
| 5. La rivière Choco Bons | Gagné | 13,14 s | 3 | 0 / 0 | 11,7 |
| 6. Le château des délices | Défaite, trois objets obtenus | 17,21 s | 0 | 0 / 3 | 10,3 |
| 6, seconde tentative | Défaite | 9,87 s | 0 | 1 / 2 | 10,9 |
| 7. La tournée des cadeaux | Gagné | 8,28 s | 3 | 0 / 0 | 15,2 |
| 8. Le lac aux aurores | Gagné | 14,24 s | 2 | 0 / 1 | 14,6 |
| 9. Minuit, tous les deux | Gagné | 19,58 s | 1 | 0 / 2 | 14,1 |

Les huit victoires sont réelles dans ce scénario ; le niveau 6 n'a pas été validé par cette série. Aucune erreur JavaScript n'a été enregistrée pendant ces parcours. Un test de modèle peut réussir neuf niveaux sans démontrer qu'un joueur tactile les réussira.

## Contrôles fonctionnels exécutés

Les scénarios archivés couvrent : déplacement clavier et tactile, saut simultané au joystick, relâchement et annulation tactiles, sprint du modèle, pause/reprise, mort après trois chutes, nouveau départ, plateformes mobiles transportant Mariam et se figeant en pause, chute réelle suivie du retour au checkpoint, objets conservés après chute, records après rechargement, options, musique activée/coupée/reprise et production d'un signal audio, photos de souvenirs, journal, dispositions mobiles et ressources 3D après trois reprises.

Les tests de journal utilisent neuf records de test. Ils prouvent l'accès et l'affichage de ces souvenirs, pas leur déblocage naturel dans une seule campagne. Les collisions isolées du modèle initialisent des positions : elles sont distinguées des parcours navigateur dans `evidence/model-report.json`. Les limites du sprint tactile et de la précision sur un écran physique restent à examiner avec une vraie personne.

## Problèmes reproduits

### P1 — Un résultat ancien peut interrompre une nouvelle partie

Reproduction : gagner, ouvrir immédiatement la pause, recommencer, démarrer avant la fin du délai de résultat de 450 ms. Avec les transitions douces, l'interface affiche « Tu brilles » alors que la nouvelle session est encore `playing`, sans objet et avec quelques centièmes de seconde. Le callback différé ne vérifie pas l'identité de sa session. Le callback de défaite présente la même structure à risque.

Impact : fausse victoire, écran incohérent, interruption d'une partie. Correction proposée : annuler les callbacks lors d'un changement de session et vérifier session + statut avant d'afficher un résultat.

### P1 — Mariam est masquée par un sapin

Dans le premier niveau de Noël, marcher vers le premier sapin, environ x = 3,6 et z = −3,3. Une part importante du corps et du visage est cachée. La capture a été faite en pause, en masquant uniquement le panneau de pause pour inspecter la scène, sans déplacer le personnage par un script.

Impact : perte de lisibilité et mauvaise appréciation des déplacements. La caméra suit une fraction de la position latérale ; aucune détection d'occlusion n'existe. Correction proposée : mieux centrer Mariam, rapprocher le cadrage paysage et rendre localement traversables à la vue les fragments de décor devant elle. Cette technique ne remplace pas les collisions physiques du décor.

### P1 — Chronomètre ralenti lorsque le rendu passe sous 20 FPS

La boucle plafonne chaque delta à 50 ms puis utilise ce delta pour la simulation et le temps. En rendu logiciel lent, plusieurs secondes réelles correspondent à nettement moins de secondes dans le jeu. Exemple observé lors du premier audit : environ 3,70 s réelles pour 1,37 s simulée.

Impact : résultats temporels incomparables entre appareils et ralentissement du jeu. Il faut séparer le temps actif réel du temps de simulation. La refonte de la boucle physique et la réduction de charge GPU sont des travaux distincts : corriger l'affichage du temps ne suffit pas à rendre le jeu fluide.

### P2 — Le checkpoint ne survit pas au rechargement

Après activation du checkpoint 2 et collecte de deux objets, une chute revient bien au checkpoint. Recharger puis rouvrir le niveau remet en revanche au départ, sans les objets. Les records terminés sont conservés. Le drapeau n'est donc qu'une reprise de session, pas une sauvegarde persistante de partie.

Correction proposée : clé additionnelle versionnée, restauration validée au checkpoint, écriture aux événements et à la sortie ; préserver les deux clés historiques.

### P2 — Deux pertes de cœur possibles pour un même enchaînement

Test isolé du modèle : un choc fait passer de trois à deux cœurs ; une chute pendant l'invulnérabilité fait passer à un. La chute ignore la protection du choc. Ce comportement est reproduit dans le modèle, sans prétendre l'avoir subi dans un parcours humain.

Pour le sauvetage futur, définir un seul accident, une seule perte de cœur et une seule transaction de reprise. Ne pas changer silencieusement l'équilibrage classique avant validation de cette règle.

### P2 — Les collisions sont celles d'un jeu de plateformes simple

Le support est tolérant au bord (observé à x = 3,59 pour un bord visible à 3,5). Les plateformes ont une collision supérieure, pas un volume latéral complet ; le personnage peut passer latéralement sous une île surélevée. Les arbres et confiseries décoratives ne sont pas solides.

Ces choix peuvent convenir au parcours actuel mais pas à une ville explorable ou à une voiture. Éviter de les présenter comme un moteur de collisions volumétriques complet.

## Performances : mesures et limites

Les tableaux JSON contiennent les échantillons, dimensions du canvas, appels de dessin, triangles, ressources et temps par image. Le rendu logiciel varie avec la charge de l'hôte ; il sert à repérer des risques et comparer un scénario, pas à prédire les FPS d'un iPhone.

Lors des premières mesures immobiles, les trois mondes étaient entre environ 6,5 et 8,9 FPS en qualité normale et 7,3 à 13,9 FPS en mode léger. La complexité mesurée aux départs était d'environ 101–127 appels et 87 558–156 422 triangles. Une capture du niveau 6 atteignait 240 986 triangles ; ce n'est pas un pic certifié de toute la campagne.

Le mode léger réduit seulement la résolution de rendu, sans réduire la complexité géométrique. Les gros décors fusionnés diminuent les appels mais sont peu granulaires pour la visibilité. Les ressources contrôlées ne croissent pas après trois reprises ; cela ne constitue pas un test de fuite sur une heure de jeu.

Risques à mesurer sur appareil : surchauffe, mémoire, chargement/décodage des images, pression GPU en plein écran paysage, reprise après mise en veille, context loss WebGL, audio interrompu, baisse de fréquence après 15 minutes. Aucun chiffre de batterie ou de mémoire iPhone n'est inventé.

## Difficulté, variété et rythme

Les neuf niveaux reprennent la même boucle : avancer, sauter, collecter trois objets puis rejoindre un portail. Les univers changent réellement de décors, musique et surfaces (accélération, rebond, convoyeur, glace et plateformes mobiles), mais l'objectif reste identique. Chaque monde passe de six à dix puis treize îles ; les derniers niveaux ont onze dangers contre quatre dans les seconds. Le niveau 6 concentre assez de difficultés pour justifier un essai humain ciblé après les deux défaites automatisées.

Les souvenirs donnent une récompense affective et la lettre une conclusion ; les étoiles et cristaux permettent de rejouer. En revanche, il n'y a actuellement ni conduite, ni énigme, ni boutique, ni inventaire de tenues, ni secrets structurés. Le temps de référence `par` est déclaré mais n'est pas un véritable défi de course exploité.

Priorités de conception : une boucle nouvelle par monde, phases calmes entre défis, récompenses visibles, feedback d'échec tendre et rapide, objectifs rejouables sans pression. Faire essayer deux ou trois niveaux par une personne peu habituée aux jeux tactiles : le contrôleur automatique ne mesure ni le plaisir, ni la frustration, ni la compréhension du tutoriel.

## Proposition d'ordre de travail

1. Figer cet audit ; conserver le public et les deux sauvegardes historiques.
2. Branche d'essai : résultats de partie fiables, reprise persistante, visibilité du personnage, temps actif et import/export.
3. Préparer le personnage, les tenues, le sauvetage et les nouvelles boucles décrits dans [REFONTE.md](REFONTE.md).
4. Produire une portion de jeu réellement aboutie avant de multiplier les univers : personnage animé, caméra, une course et un sauvetage.
5. Ajouter Fashion Studio et conduite, puis étendre la campagne ; valider chaque ajout.
6. Valider Safari sur iPhone physique avant une proposition de publication sur `main`.

L'audit ne conclut pas que la refonte spectaculaire est déjà produite. Les réalisations de la branche sont décrites séparément dans [VALIDATION-TEST.md](VALIDATION-TEST.md).
