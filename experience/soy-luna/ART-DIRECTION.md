# Les jardins de Luna — bible artistique, version de travail
## Une fête préparée pour elle
Un petit parc de rollers au bord d'une lagune, à l'heure où le soleil devient abricot. Mariam traverse une promenade de terrazzo ivoire, des jardins de palmiers et une piste laquée couleur framboise. Une grande roue tourne au loin. Les boutiques ont de vraies façades, stores festonnés, vitres, moulures, enseignes et jardinières. La lumière vient du ciel, du soleil et de lanternes ponctuelles. Pas de bloom global ni de tunnel de néons.

Le projet reprend les fichiers et corrections de la branche auditée 377ad0c. Le circuit continu est nouveau : le modèle de plateformes classique ne permet pas une glisse inertielle, des virages et une piste courbe. Les neuf niveaux restent disponibles sans réécriture.

## Références officielles vues
Les trois planches visibles dans la conversation ont été analysées : turnaround détaillé face/profil/dos et expressions ; planche des tenues ; planche des trois ambiances. La vidéo iPhone n'a pas pu être lue dans l'environnement indisponible. Son constat utilisateur est conservé comme bug ouvert : anneaux et décors devant le personnage et les plateformes.

Mariam : peau mate chaude, très longs cheveux brun foncé volumineux en boucles serrées ; silhouette adulte stylisée et élancée, environ six à six et demie têtes de haut. Grands yeux bruns en amande, sourcils épais, nez défini, lèvres rose brun, cils et sourire. Ne pas éclaircir sa peau, gonfler sa tête ou remplacer ses boucles par une boule lisse.

Soy Luna : crop top noir, legging noir taille haute, chaussettes ivoire, rollers quad roses à lacets, roues fuchsia ; lunettes cœur roses sur les cheveux, pendentif cœur et petits bijoux. Les accessoires ne doivent pas masquer la silhouette ou traverser les bras.

## Grammaire commune
| Élément | Direction | À éviter |
| --- | --- | --- |
| Silhouettes | Formes reconnaissables, proportions élégantes, détails concentrés près du joueur | Cubes décoratifs sans fonction, personnages chibi |
| Couleurs | Ivoire #FFF1DA, rose #D65582, pêche #ECA77C, prune #45324E, vert sauge #638F82 | Magenta saturé partout, lumière blanche uniforme |
| Matières | Terrazzo, bois peint, laque, métal doré discret, coton noir, cuir rose | Tout métallique ou émissif |
| Éclairage | Soleil doux latéral, ciel pastel, ombres de contact | Effets plein écran coûteux et illisibles |
| Animation | Poussée latérale des patins, transfert de poids, inclinaison au virage, réception amortie | Bras qui moulinent en permanence |
| Interface | Typographie existante locale, peu d'éléments, grands boutons tactiles | Menu catalogue qui occupe le jeu |
| Caméra | Anticipation de trajectoire, Mariam visible en entier, sol devant elle visible | Gros anneaux devant la piste, zooms brusques |

## Personnage : première fabrication, non définitive
Premier asset de développement : maillages paramétriques profilés, squelette partagé, peau et vêtements séparés, cheveux en mèches courbes pondérées sur des os secondaires, rollers avec roues. Ce n'est pas une image sur un panneau : les surfaces ont une profondeur, des normales et des poids de peau.

Limites explicites : ce procédé ne remplace pas une sculpture/re-topologie artistique dans Blender. Visage, implantation des boucles, mains, couture, poids aux articulations et silhouette doivent être contrôlés en face/profil/dos. Une animation mathématique de squelette n'est pas une bibliothèque de clips finalisée. Le modèle ne devient pas « Mariam officielle validée » par simple présence de cheveux bruns et de rollers roses.

Étape de finition requise : correction de sculpture d'après les vues officielles, topologie propre des épaules/hanches, morph targets sourire/surprise/clignement, UV/atlas, rig facial, poids, clips patinage/saut/réception/pose, export GLB et contrôle sur iPhone. Aucun fichier Blender externe ni modèle acheté n'est prétendu disponible.

## Les autres mondes, après validation
Cookie Kingdom : pâte dorée, crème et roses doux ; puzzles d'ingrédients et obstacles gourmands vivants.
Noël : rouge velours, sapin, neige et vitrines ambrées ; village et défis hivernaux.
Barbie : architecture rose/crème, promenade et décapotable ; conduite et activités.
Hub et Fashion Studio : lieux 3D réels, vêtements distincts sur le même squelette, catalogue extensible.
La qualité de la première scène est le verrou avant cette extension.

## Son
Composition instrumentale originale via Web Audio : accords doux à l'accueil, basse/percussion légère pendant le circuit, mélodie plus pleine en finale, accord de récompense. Portes musicales à 108 BPM, retour visuel équivalent quand le son est coupé. Aucun morceau de Soy Luna, film ou jeu commercial copié. Démarrage audio uniquement après geste ; pause et arrière-plan suspendent la musique.
