-- Script pour remplacer "HE" par "Huile essentielle" dans le nom des produits
-- 1. Aperçu avant modification (optionnel pour vérification)
-- SELECT nom_produit, REGEXP_REPLACE(nom_produit, '(^|\s)HE(\s|$)', '\1Huile essentielle\2', 'gi') AS nouveau_nom FROM produits WHERE nom_produit ~* '(^|\s)HE(\s|$)';

BEGIN;

UPDATE produits
SET nom_produit = REGEXP_REPLACE(nom_produit, '(^|\s)HE(\s|$)', '\1Huile essentielle\2', 'gi')
WHERE nom_produit ~* '(^|\s)HE(\s|$)';

-- Vérification des lignes mises à jour
SELECT id, nom_produit, categorie, prix 
FROM produits 
WHERE nom_produit ILIKE '%Huile essentielle%'
ORDER BY nom_produit;

COMMIT;
