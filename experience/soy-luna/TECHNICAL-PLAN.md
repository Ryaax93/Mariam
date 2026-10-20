# Architecture et critères d'acceptation — Soy Luna
## Conservation
Base : 377ad0c71c2939d7e22654b0b1cab4993344ae66.
Tout nouveau code est dans experience/soy-luna ; le moteur Three.js reste épinglé à 0.170.0.
index.html à la racine, expérience classique, souvenirs, photos et ancien système de sauvegarde restent identiques.
Les clés mariam-worlds-adventure-v1, mariam-worlds-checkpoint-v2 et mariam-little-world-v1 ne sont jamais écrites par la scène.
Nouvelle clé versionnée mariam-luna-slice-v1. Reprise au dernier secteur, objets obtenus conservés, records additifs. Le changement de domaine ne transporte pas les données.

## Modules
| Module | Responsabilité |
| --- | --- |
| track.js | Géométrie mathématique de piste, limites, rampes, portes et checkpoint |
| simulation.js | Pas fixe 1/120 s, glisse, frein, saut, progression, score, reprise |
| character.js | Maillages profilés, vraie peau pondérée, squelette et animation |
| world.js | Piste, boutiques, jardins, grande roue, ciel et matériaux |
| camera.js | Suivi amorti ; volume visuel corps + trajectoire d'atterrissage |
| audio.js | Horloge musicale et couches originales |
| main.js | Machine d'états, entrées, sauvegarde, rendu, diagnostics en lecture seule |
| test/ | Modèle, navigateur et captures, séparés des anciens résultats |

## Boucle de jeu
Circuit d'environ 200 m : découverte de la poussée et du frein ; slalom doux entre portes ; promenade musicale ; tremplin facultatif et zone d'atterrissage large ; final avec souvenir et score. Les portes manquées ne bloquent pas le parcours ; recommencer permet d'améliorer score, rythme et temps. Pas d'échec au chronomètre.

Touches : flèches ou ZQSD/WASD, espace saut, Maj accélération, frein avec recul. Tactile : joystick gauche direction/poussée, boutons accélération et saut à droite. Relâchement, pointercancel, blur, pause et changement d'orientation effacent les entrées. Le portrait interrompt la partie et demande de tourner ; aucune rotation imposée par API.

## Caméra : défaut encore ouvert
Le masque précédent ne protégeait que le corps. Nouvelle scène : pas d'anneau géant sur l'axe de jeu ; caméra suit la tangente, cible un point en avant ; matériaux des seuls décors peuvent s'effacer dans un corridor entre la projection du corps et la zone d'atterrissage. Le sol, les obstacles jouables et les marqueurs ne s'effacent pas. Le personnage ne devient jamais transparent.

Validation requise : capturer mêmes positions avant/après avec obstacle volontaire de régression ; vérifier visage/pieds et repère d'atterrissage dans l'image ; parcourir accélération/saut/respawn avec caméra active. Une inspection de code ou un rayon libre ne suffit pas à déclarer le bug corrigé. Le défaut des neuf niveaux classiques n'est pas automatiquement corrigé par la scène isolée.

## Objectifs de performance, pas résultats
60 FPS sur iPhone compatible ; repli graphique stable à 30 FPS. Pas fixe découplé du rendu, rattrapage borné et temps actif réel séparé ; aucune promesse de simulation temps réel si l'hôte sature durablement.
Budgets initiaux : personnage complet <= 25 000 triangles et <= 12 matériaux ; scène visible <= 180 000 triangles, <= 100 appels hors ombre ; DPR 1 / 1.5 ; atlas <= 1024, ombres 1024 optionnelles, aucune SSAO/SSR plein écran.
Qualité basse doit réduire ombres, végétation et effets, pas seulement pixels.
Mesurer appels, triangles, résolution, intervalles RAF p50/p95, FPS et rattrapages abandonnés. Les mesures Linux/SwiftShader ou WebKit Linux ne prédisent pas l'iPhone.

## Tests et livraison
1. Tests déterministes : accélération, frein, virage, saut/atterrissage, garde-fous de piste, checkpoint, victoire, reprise, invalides, pause et FPS différents.
2. Chromium et WebKit si disponibles : démarrage, commandes ordinaires, pause/reprise, musique, tactile multidoigt, rotation, tailles 667x375/852x393/932x430/393x852.
3. Capture de vrai rendu WebGL et diagnostic squelette/mesh ; aucun mockup comme preuve.
4. Parcours complet sans téléportation ; scènes de test caméra explicitement étiquetées.
5. Safari physique : encoche, interruptions audio, mémoire, 15 minutes/chauffe, confort et fidélité visuelle à valider avec le propriétaire.
6. Déploiement privé seulement après contrôle ; aucune fusion sur main.

## Sauvetage futur
Transaction unique par accident, trois cœurs, Rishanth ailé et portage synchronisé, passage des répétitions. Les dialogues officiels remplacent ceux du premier cahier :
1. « Tu vas y arriver, je crois en toi ! »
2. « Allez Mariam, t'es forte, non ? »
3. « Je te croyais meilleure que ça, retente ta chance, dépêche-toi ! »
Ce premier circuit utilise une reprise technique ; aucune cinématique d'ange n'est annoncée avant fabrication réelle.
