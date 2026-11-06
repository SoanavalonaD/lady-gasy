CREATE TYPE role_utilisateur AS ENUM ('CLIENT', 'ADMIN');
CREATE TYPE categorie_produit AS ENUM ('CHEVEUX', 'VISAGE', 'CORPS', 'HUILES_ESSENTIELLES', 'ACCESSOIRES', 'ONGLES', 'CILS', 'LEVRES');
CREATE TYPE statut_commande AS ENUM ('EN_ATTENTE', 'CONFIRMEE', 'EXPEDIEE', 'LIVREE', 'ANNULEE');
CREATE TYPE statut_livraison AS ENUM ('EN_PREPARATION', 'EN_ROUTE', 'LIVRE', 'ECHEC');


CREATE TABLE utilisateurs (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    role role_utilisateur DEFAULT 'CLIENT' NOT NULL,
    cree_le TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


CREATE TABLE produits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom_produit VARCHAR(255) NOT NULL,
    description TEXT,
    categorie categorie_produit NOT NULL,
    prix NUMERIC(10, 2) NOT NULL,
    stock_disponible INTEGER DEFAULT 0 NOT NULL,
    image_url TEXT,
    cree_le TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


CREATE TABLE IF NOT EXISTS prestations_salon (
    id VARCHAR(150) PRIMARY KEY,
    image_url TEXT,
    mise_a_jour_le TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


CREATE TABLE commandes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    id_utilisateur UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    statut statut_commande DEFAULT 'EN_ATTENTE' NOT NULL,
    montant_total NUMERIC(10, 2) NOT NULL,
    date_commande TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


CREATE TABLE lignes_commande (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    id_commande UUID REFERENCES commandes(id) ON DELETE CASCADE NOT NULL,
    id_produit UUID REFERENCES produits(id) ON DELETE RESTRICT NOT NULL,
    quantite INTEGER NOT NULL CHECK (quantite > 0),
    prix_unitaire_applique NUMERIC(10, 2) NOT NULL
);


CREATE TABLE livraisons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    id_commande UUID REFERENCES commandes(id) ON DELETE CASCADE UNIQUE NOT NULL,
    adresse_detaillee TEXT NOT NULL,
    ville VARCHAR(100) NOT NULL,
    code_postal VARCHAR(20),
    repere TEXT, -- Indispensable à Madagascar
    zone_livraison VARCHAR(100) NOT NULL,
    frais_livraison NUMERIC(10, 2) NOT NULL,
    nom_livreur VARCHAR(255),
    statut statut_livraison DEFAULT 'EN_PREPARATION' NOT NULL,
    mise_a_jour_le TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.utilisateurs (id, nom, prenom, email, telephone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nom', 'Non renseigné'),
    COALESCE(new.raw_user_meta_data->>'prenom', 'Non renseigné'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'telephone', 'Non renseigné'),
    'CLIENT'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();