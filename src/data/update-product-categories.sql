-- ==============================================================================
-- Script de migration des catégories de produits Lady Gasy
-- Catégories cibles : VISAGE, CHEVEUX, CORPS, HUILES_ESSENTIELLES, ACCESSOIRES
-- Basé sur la grille de catégorisation par usage
-- ==============================================================================

BEGIN;

-- 1. Mise à jour de l'ENUM categorie_produit
-- PostgreSQL permet d'ajouter des valeurs dans un ENUM existant avec ADD VALUE
ALTER TYPE categorie_produit ADD VALUE IF NOT EXISTS 'VISAGE';
ALTER TYPE categorie_produit ADD VALUE IF NOT EXISTS 'CORPS';
ALTER TYPE categorie_produit ADD VALUE IF NOT EXISTS 'HUILES_ESSENTIELLES';

COMMIT;

-- 2. Mise à jour des produits par catégorie
BEGIN;

-- ==============================================================================
-- A. HUILES ESSENTIELLES (Toutes les HE / huiles essentielles)
-- ==============================================================================
UPDATE produits
SET categorie = 'HUILES_ESSENTIELLES'
WHERE nom_produit ILIKE 'HE %'
   OR nom_produit ILIKE 'Huile essentielle%'
   OR nom_produit ILIKE '%ravintsara%'
   OR nom_produit ILIKE '%mandravasarotra%'
   OR nom_produit ILIKE '%katrafay%'
   OR nom_produit ILIKE '%ylang ylang%'
   OR nom_produit ILIKE '%tea tree%'
   OR nom_produit ILIKE '%menthe poivrée%'
   OR nom_produit ILIKE '%cannelle%'
   OR nom_produit ILIKE '%clou de girofle%'
   OR nom_produit ILIKE '%cyprès%'
   OR nom_produit ILIKE '%citronnelle%';

-- ==============================================================================
-- B. VISAGE
-- ==============================================================================
UPDATE produits
SET categorie = 'VISAGE'
WHERE nom_produit ILIKE '%jojoba%'
   OR nom_produit ILIKE '%pépin de raisin%'
   OR nom_produit ILIKE '%pepin de raisin%'
   OR nom_produit ILIKE '%argan%'
   OR nom_produit ILIKE '%nigelle%'
   OR nom_produit ILIKE '%bourrache%'
   OR nom_produit ILIKE '%rose musquée%'
   OR nom_produit ILIKE '%carotte%'
   OR nom_produit ILIKE '%calophylle%'
   OR nom_produit ILIKE '%figue de barbarie%'
   OR nom_produit ILIKE '%huile de citron%'
   OR nom_produit ILIKE '%anti-tache%'
   OR nom_produit ILIKE '%peau grasse anti acnéique%'
   OR nom_produit ILIKE '%detox%'
   OR nom_produit ILIKE '%argile%'
   OR nom_produit ILIKE '%sérum 2en1%'
   OR nom_produit ILIKE '%serum 2en1%'
   OR nom_produit ILIKE '%sérum hydratation%'
   OR nom_produit ILIKE '%serum hydratation%'
   OR nom_produit ILIKE '%sérum anti-rides%'
   OR nom_produit ILIKE '%serum anti-rides%'
   OR nom_produit ILIKE '%boost cils%'
   OR nom_produit ILIKE '%vitamine e%'
   OR nom_produit ILIKE '%lotion à l''hydrolat de géranium%'
   OR nom_produit ILIKE '%lotion a l''hydrolat de geranium%'
   OR nom_produit ILIKE '%aloe vera%'
   OR categorie = 'LEVRES'
   OR categorie = 'CILS';

-- ==============================================================================
-- C. CORPS
-- ==============================================================================
UPDATE produits
SET categorie = 'CORPS'
WHERE nom_produit ILIKE '%amande douce%'
   OR nom_produit ILIKE '%baobab%'
   OR nom_produit ILIKE '%olive%'
   OR nom_produit ILIKE '%sésame%'
   OR nom_produit ILIKE '%sesame%'
   OR nom_produit ILIKE '%souchet%'
   OR nom_produit ILIKE '%peau atopique%'
   OR nom_produit ILIKE '%gommage%'
   OR nom_produit ILIKE '%après rasage%'
   OR nom_produit ILIKE '%apres rasage%'
   OR nom_produit ILIKE '%fortifiante ongle%'
   OR nom_produit ILIKE '%chantilly karité-cacao%'
   OR nom_produit ILIKE '%chantilly de mangue%'
   OR nom_produit ILIKE '%glycérine%'
   OR nom_produit ILIKE '%glycerine%'
   OR nom_produit ILIKE '%cire d''abeille%'
   OR categorie = 'ONGLES';

-- ==============================================================================
-- D. CHEVEUX (Soins capillaires, macérâts pousse, shampoings, etc.)
-- ==============================================================================
UPDATE produits
SET categorie = 'CHEVEUX'
WHERE nom_produit ILIKE '%avocat%'
   OR nom_produit ILIKE '%fenugrec%'
   OR nom_produit ILIKE '%moutarde%'
   OR nom_produit ILIKE '%ricin%'
   OR nom_produit ILIKE '%coco%'
   OR nom_produit ILIKE '%gingembre%'
   OR nom_produit ILIKE '%macadamia%'
   OR nom_produit ILIKE '%brocoli%'
   OR nom_produit ILIKE '%romarin%'
   OR nom_produit ILIKE '%shampoing%'
   OR nom_produit ILIKE '%graines de lin%'
   OR nom_produit ILIKE '%hibiscus%'
   OR nom_produit ILIKE '%rhassoul%'
   OR nom_produit ILIKE '%cire coiffante%'
   OR nom_produit ILIKE '%ninaka%'
   OR nom_produit ILIKE '%oignon%'
   OR nom_produit ILIKE '%activ''pousse%'
   OR nom_produit ILIKE '%protection cheveux%'
   OR nom_produit ILIKE '%chantilly karité-olive-avocat%'
   OR nom_produit ILIKE '%leave-in%'
   OR nom_produit ILIKE '%lait capillaire%'
   OR nom_produit ILIKE '%masque hydratant%'
   OR categorie = 'CHEVEUX';

-- ==============================================================================
-- E. ACCESSOIRES (Conserve les accessoires existants ou spécifiques)
-- ==============================================================================
UPDATE produits
SET categorie = 'ACCESSOIRES'
WHERE nom_produit ILIKE '%brosse%'
   OR nom_produit ILIKE '%peigne%'
   OR nom_produit ILIKE '%bonnet%'
   OR nom_produit ILIKE '%flacon%'
   OR nom_produit ILIKE '%vaporisateur%'
   OR nom_produit ILIKE '%serviette%'
   OR nom_produit ILIKE '%élastique%'
   OR nom_produit ILIKE '%elastique%'
   OR nom_produit ILIKE '%scrunchie%';

-- 3. Aperçu récapitulatif par catégorie
SELECT categorie, COUNT(*) AS nombre_de_produits
FROM produits
GROUP BY categorie
ORDER BY categorie;

COMMIT;
