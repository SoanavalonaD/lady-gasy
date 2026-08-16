-- ===========================================================================
-- LADY GASY — Script d'autorisation RLS pour l'Espace Admin
-- À exécuter dans le SQL Editor de Supabase (SQL Editor -> New Query -> Run)
-- ===========================================================================

-- 1. POLITIQUES POUR LES COMMANDES (Permet à l'Admin de voir les commandes de TOUS les utilisateurs)
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to commandes" ON commandes;
CREATE POLICY "Allow all access to commandes" ON commandes FOR ALL USING (true) WITH CHECK (true);

-- 2. POLITIQUES POUR LES LIGNES DE COMMANDE
ALTER TABLE lignes_commande ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to lignes_commande" ON lignes_commande;
CREATE POLICY "Allow all access to lignes_commande" ON lignes_commande FOR ALL USING (true) WITH CHECK (true);

-- 3. POLITIQUES POUR LES LIVRAISONS
ALTER TABLE livraisons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to livraisons" ON livraisons;
CREATE POLICY "Allow all access to livraisons" ON livraisons FOR ALL USING (true) WITH CHECK (true);

-- 4. POLITIQUES POUR LES UTILISATEURS (Permet à l'Admin d'associer le nom/email du client aux commandes)
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to utilisateurs" ON utilisateurs;
CREATE POLICY "Allow all access to utilisateurs" ON utilisateurs FOR ALL USING (true) WITH CHECK (true);

-- 5. POLITIQUES POUR LES PRODUITS
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to produits" ON produits;
CREATE POLICY "Allow all access to produits" ON produits FOR ALL USING (true) WITH CHECK (true);

-- 6. POLITIQUES POUR LE BUCKET STORAGE "produits"
DROP POLICY IF EXISTS "Public Read produits bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert produits bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Update produits bucket" ON storage.objects;

CREATE POLICY "Public Read produits bucket" ON storage.objects FOR SELECT USING (bucket_id = 'produits');
CREATE POLICY "Public Insert produits bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'produits');
CREATE POLICY "Public Update produits bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'produits');
