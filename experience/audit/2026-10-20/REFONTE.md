# Cahier de refonte — Les mondes de nous

Branche de préparation : `audit/refonte-mariam-20261020`. Aucune publication sur `main` sans validation. Ce document traduit les sept demandes en systèmes de jeu, critères d'acceptation et limites de production. Il ne prétend pas que les futurs univers sont déjà jouables.

## Intention et conservation

Créer une aventure de couple en paysage, accessible par le navigateur sur iPhone, où Mariam joue vraiment : conduire, patiner, résoudre, composer un look, découvrir. Le hub propose l'aventure, Fashion Studio et le carnet sans imposer de terminer toute la campagne pour s'amuser avec les vêtements.

Le ciel d'étoiles original reste intact. Les neuf niveaux actuels restent disponibles comme parcours classiques, avec leurs records, souvenirs, photos et options. Le petit monde de souvenirs reste accessible. Aucun remplacement de sauvegarde silencieux. Toute nouvelle progression utilise un schéma versionné séparé et une migration testable.

## État de production

| Élément | Livraison de préparation | Production encore nécessaire |
| --- | --- | --- |
| Personnage et trois tenues | Références retrouvées et spécification ci-dessous | Modèle 3D fidèle, rig, vêtements et animations |
| Caméra | Correction ciblée de cadrage et d'occlusion | Validation exhaustive, modes conduite et cinématiques |
| Trois cœurs et sauvetage | Règle et déroulé définis ; trois cœurs classiques conservés | Rishanth, ailes, portage, montage et dialogues intégrés |
| Variété | Missions et récompenses définies | Nouveaux niveaux, énigmes et mini-jeux |
| Barbie | Conduite, carte et interactions spécifiées | Voiture, ville, collisions et missions jouables |
| Fashion Studio | Parcours, inventaire et règles spécifiés | Boutique, cabine, accessoires et présentation |
| Tenues et souvenirs | Stratégie de persistance et carnet existant préservé | Inventaire de tenues, déblocages et sauvegarde de looks |

La version d'essai livrée avec l'audit contient les fondations techniques décrites dans `VALIDATION-TEST.md`, pas une prétendue version finale des sept fonctionnalités.

## 1. Mariam, même personne dans trois univers

Les planches « Trois univers, une seule Mariam », « Mariam, univers de looks glamour… » et « Planche de personnages Mariam aux univers pétillants » ont été retrouvées et examinées. Direction : rendu 3D facetté soigné, peau brune chaude, très longs cheveux bouclés foncés et volumineux, visage expressif, silhouette naturelle, bijoux et accessoires roses. Préserver son identité et la teinte de peau ; éviter une poupée générique différente à chaque tenue.

| Tenue | Pièces et détails |
| --- | --- |
| Soy Luna | Crop top noir, leggings noirs, chaussettes, rollers roses/blancs, lunettes roses, petit sac et pendentif cœur |
| Noël | Robe rouge avec bordure blanche, bonnet, bottes hautes, bijoux ; boucles visibles malgré le bonnet |
| Cookie Dough | Robe rose à volants et nœud, chaussures roses, sac assorti ; même visage et même chevelure |

Un modèle GLB riggé est nécessaire, avec corps et accessoires séparés sur le même squelette. Objectif de départ à mesurer : 12–20 000 triangles pour la silhouette complète, peu de matériaux, atlas de textures, cheveux en mèches sculptées plutôt qu'en milliers de fibres. Ce sont des budgets de conception, pas des performances déjà obtenues.

Animations requises : attente, marche/course, départ/arrêt, saut, chute, réception, patinage, surprise, victoire, assise voiture, pose cabine, portage. Prévoir yeux et bouche expressifs, attaches de bijoux, contraintes vêtements/cheveux. Une image de référence, même générée en style 3D, n'est ni un maillage ni un rig exploitable. Aucun fichier 3D fidèle n'est actuellement disponible ; un personnage fait de primitives ne doit pas être présenté comme son équivalent.

Acceptation : vues face/profil/dos sous éclairage neutre, mêmes proportions entre tenues, animation en mouvement et capture dans la vraie caméra de jeu. Valider la ressemblance avant de fabriquer tout le catalogue.

## 2. Caméra et lisibilité

Quatre cadrages : parcours derrière Mariam, exploration plus libre, conduite derrière la voiture, plans cinématiques courts. Priorité au paysage avec commandes dans les zones de pouces ; portrait fonctionnel conservé. Joystick gauche, actions contextualisées à droite, aucune prise de contrôle brutale.

Un décor qui se place entre caméra et personnage doit laisser apparaître son corps. La fondation d'essai applique une ouverture locale tramée en profondeur ; elle ne rend pas tout l'arbre transparent. La production finale peut combiner cette technique à des volumes de caméra et à une caméra rapprochée dans les boutiques. Vérifier le front, le corps, les plateformes proches et les sauts aux bords. Les changements de cadrage ne doivent pas renverser les commandes.

## 3. Trois cœurs et sauvetage de Rishanth

Le système actuel a déjà trois cœurs ; le nouveau système enrichit le moment de perte. Un accident retire un cœur, verrouille les dégâts et commandes de mouvement, puis lance le sauvetage. Rishanth apparaît avec des ailes, descend, prend Mariam dans ses bras, la porte et la pose au checkpoint. Durée cible 3–5 secondes ; bouton pour passer, variante réduite avec effets doux. Le joueur doit voir le checkpoint et comprendre qu'il garde ses objets.

Dialogues selon le cœur perdu :

- Premier : « Je t'avais dit que je te rattraperais. Même entre deux mondes. »
- Deuxième : « On ralentit si tu veux. Je ne suis pas pressé quand je suis avec toi. »
- Troisième : « On peut recommencer mille fois, Mariam. Moi, je te choisis à chaque fois. »

Au troisième cœur, le sauvetage précède un choix clair : recommencer le niveau ou retourner au hub. Aucun paiement ni perte des souvenirs gagnés. Écrire la reprise avant et après la cinématique ; un rechargement au milieu ne doit ni doubler la perte ni bloquer le personnage. Prévoir clips de portage synchronisés et points d'attache, pas deux avatars simplement superposés.

## 4. Des boucles différentes et rejouables

| Univers | Action principale | Variante / secret | Récompense |
| --- | --- | --- | --- |
| Soy Luna | Course de rollers avec trajectoires, impulsions et portes de rythme | Parcours alternatif et défi personnel | Roues, veste, souvenir du live |
| Cookie Dough | Transporter une glace et composer une commande par gestes de jeu | Atelier gourmand et chemin caché derrière les cookies | Sac, bijou, souvenir d'une petite attention |
| Noël | Relier des lumières puis livrer les cadeaux dans un village | Patinoire et cadeau dissimulé | Tenue, décoration du hub, lettre |
| Barbie | Conduire, se garer et explorer boutiques/café | Balade photo et itinéraire secret | Accessoires et looks |

Chaque mission doit avoir une mécanique, une règle d'échec lisible et un enjeu de maîtrise. Éviter neuf copies du même parcours avec d'autres couleurs. Défis courts de 1–3 minutes, balades libres, pauses affectives ; pas de longs dialogues qui coupent chaque action. Le bonus récompense aussi l'exploration et le style, pas seulement la vitesse.

Les souvenirs suivent le vrai récit : commentaire pendant le live TikTok ; soir froid de décembre dans la voiture embuée ; baiser sur la joue puis sur les lèvres ; Noël ; lettres et petites attentions. Les photos restent celles réellement accessibles. L'humour vient de vos goûts et de petites situations de jeu, sans inventer des événements vécus.

## 5. Barbie explorable et voiture rose

Ville compacte avec place, café, boutique et belvédère ; pas une grande carte vide. Mariam au volant, Rishanth visible en passager. Entrer/sortir avec une animation courte. Conduite arcade : accélération graduelle, frein, marche arrière, direction douce, limites de vitesse près des piétons et des magasins. Recentrage si la voiture se coince.

Le joystick pilote la direction ; deux boutons accélérer/freiner dans les zones de pouces. Les collisions contre murs et mobilier doivent être volumétriques ; le système de plateformes actuel ne suffit pas. Missions : retrouver une boutique, livrer une commande, se garer, rejoindre un point de vue. La balade libre reste possible sans chronomètre. Aucun titre de musique commercial inaccessible n'est promis : utiliser une composition originale adaptée à la conduite.

## 6. Fashion Studio depuis le menu

Parcours : hub → boutique → cabine → accessoires → présentation devant Rishanth. Le studio est utilisable sans finir les neuf niveaux. Séparer tenues complètes et pièces compatibles : haut, bas/robe, chaussures, cheveux, collier, boucles, lunettes, sac. Certaines combinaisons incompatibles se remplacent avec une explication simple ; pas de corps traversant une robe.

La cabine montre le vrai personnage 3D tournant, des catégories lisibles et un aperçu immédiat. Trois tenues de base disponibles ; déblocages par le jeu, sans argent réel. Enregistrer des looks nommés, revenir à la dernière tenue, utiliser celle-ci en exploration quand elle est compatible. Les rollers peuvent être attachés pour la course sans modifier le reste du look.

Présentation finale avec lumière et musique brèves, pose et réaction tendre de Rishanth. Les réponses varient selon le look et ne jugent pas son corps. Exemple : « J'étais censé regarder la tenue… mais j'ai encore regardé ton sourire. » L'envie de rejouer vient du choix et de l'expression, pas d'une note punitive de beauté.

## 7. Tenues, souvenirs et progression

Identifiants stables pour vêtements, missions et souvenirs. Nouvelle sauvegarde versionnée : `inventory`, `looks`, `equipped`, `missions`, `memories`, `settings`, `activeRun`. Transactions idempotentes : une récompense déjà reçue ne se recrédite pas à chaque rechargement. Conserver une copie du format précédent avant migration ; valider les fichiers importés. La migration des records classiques est additive, avec conservation des meilleures étoiles.

L'aperçu privé utilise un autre domaine : sa sauvegarde est indépendante du site public. L'import/export de l'aventure permet de déplacer les records et le checkpoint. Le village historique conserve sa propre clé ; ne pas annoncer un transfert de celui-ci si le fichier n'en contient pas les données.

## Qualité et ordre de production

1. Fondations : callbacks, reprise et visibilité ; tests des neuf parcours classiques.
2. Personnage et une portion aboutie : premier circuit roller, Rishanth et sauvetage, direction artistique validée dans le moteur.
3. Fashion Studio complet sur ce personnage, puis voiture et quartier Barbie.
4. Missions gourmandes et Noël, récompenses, transitions musicales, souvenirs.
5. Essais humains tactiles et Safari physique ; optimisation géométrie/textures/résolution selon mesures, correction des fuites et interruptions.

Musique : pistes originales par univers, couches selon exploration/action/sauvetage/révélation, transitions en fondu, un vrai bouton muet et respect du geste nécessaire au démarrage audio sur mobile. Les musiques synthétisées existantes restent disponibles dans la fondation.

Objectif de fluidité à mesurer : 60 FPS quand l'appareil le permet, repli stable à 30 FPS ; ne jamais transformer une mesure SwiftShader en promesse iPhone. Limiter allocations par image, effets plein écran, textures et objets hors champ. Mesurer après 15 minutes, pas seulement au lancement.

La publication publique nécessite une revue du rendu et du gameplay, un test Safari sur appareil, la vérification des migrations et la validation de Rishanth. Tant que ces étapes ne sont pas remplies, conserver la branche et le lien privé de test.
