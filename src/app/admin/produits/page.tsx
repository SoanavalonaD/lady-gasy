"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Package,
  Image as ImageIcon,
  UploadCloud,
  Loader2
} from "lucide-react";
import {
  getDbProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  uploadProductImage
} from "@/data/queries";
import { Product } from "@/data/types";
import { groupProductsByVariant, parseProductQuantity, GroupedProduct } from "@/utils/productVariants";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("TOUS");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<
    "CHEVEUX" | "VISAGE" | "CORPS" | "HUILES_ESSENTIELLES" | "ACCESSOIRES" | "ONGLES" | "CILS" | "LEVRES"
  >("CHEVEUX");
  const [formPrice, setFormPrice] = useState<number>(25000);
  const [formStock, setFormStock] = useState<number>(50);
  const [formImageUrl, setFormImageUrl] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getDbProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormDescription("");
    setFormCategory("CHEVEUX");
    setFormPrice(25000);
    setFormStock(50);
    setFormImageUrl("");
    setUploadError(null);
    setUploadingImage(false);
    setModalOpen(true);
  };

  const openEditModal = (product: Product | GroupedProduct) => {
    setEditingProduct(product);
    const { baseName } = parseProductQuantity(product.name);
    setFormName(baseName || product.name);
    setFormDescription(product.description || "");
    const raw = (product.rawCategory || product.categories?.[1] || product.categories?.[0] || "CHEVEUX").toUpperCase().replace(/\s+/g, "_");
    setFormCategory(
      ["CHEVEUX", "VISAGE", "CORPS", "HUILES_ESSENTIELLES", "ACCESSOIRES", "ONGLES", "CILS", "LEVRES"].includes(raw)
        ? (raw as any)
        : "CHEVEUX"
    );
    setFormPrice(product.priceAr);
    setFormStock(product.stock !== undefined ? product.stock : 50);
    setFormImageUrl(product.image || "");
    setUploadError(null);
    setUploadingImage(false);
    setModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);
    try {
      const url = await uploadProductImage(file);
      setFormImageUrl(url);
      showToast("Image chargée avec succès !");
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Erreur d'envoi de l'image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0) return;

    setSubmitting(true);
    try {
      if (editingProduct) {
        await updateAdminProduct(editingProduct.id, {
          nom_produit: formName,
          description: formDescription,
          categorie: formCategory,
          prix: formPrice,
          stock_disponible: formStock,
          image_url: formImageUrl,
        });
        showToast(`Produit "${formName}" mis à jour avec succès !`);
      } else {
        await createAdminProduct({
          nom_produit: formName,
          description: formDescription,
          categorie: formCategory,
          prix: formPrice,
          stock_disponible: formStock,
          image_url: formImageUrl || "/background-image.jpg",
        });
        showToast(`Nouveau produit "${formName}" ajouté avec succès !`);
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      showToast("Erreur lors de la sauvegarde du produit.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer le produit "${name}" ?`))
      return;

    try {
      await deleteAdminProduct(id);
      showToast(`Produit "${name}" supprimé avec succès.`);
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      showToast("Erreur lors de la suppression.");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Products
  const categoriesList = [
    "TOUS",
    "VISAGE",
    "CHEVEUX",
    "CORPS",
    "HUILES_ESSENTIELLES",
    "ACCESSOIRES",
  ];

  const filteredProducts = React.useMemo(() => {
    const rawFiltered = products.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "TOUS" ||
        p.rawCategory?.toUpperCase() === selectedCategory ||
        (p.categories &&
          p.categories.some(
            (c) =>
              c.toUpperCase() === selectedCategory ||
              (selectedCategory === "CHEVEUX" &&
                (c.toUpperCase() === "SOINS & MASQUES" || c.toUpperCase() === "CHEVEUX"))
          ));

      return matchesSearch && matchesCategory;
    });

    // Regroupement par variantes pour n'avoir qu'un seul élément par produit
    return groupProductsByVariant(rawFiltered);
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="space-y-lg pt-md">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-md py-sm rounded-lg shadow-xl flex items-center gap-xs font-label-md animate-bounce">
          <CheckCircle2 size={18} />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Catalogue Produits
          </h2>
          <p className="font-body-md text-on-surface-variant mt-xs">
            Gérez votre inventaire et vos fiches produits.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-on-primary font-label-md text-sm px-md py-sm rounded-lg flex items-center gap-xs hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={18} />
          Ajouter un Produit
        </button>
      </div>

      {/* Products Container */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-xs">
        {/* Toolbar */}
        <div className="p-sm md:p-md border-b border-outline-variant/30 flex flex-wrap gap-md items-center justify-between bg-surface-bright">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-xs">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-sm py-1 font-label-md text-xs rounded-md border transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary text-on-primary border-primary font-bold"
                    : "bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-variant"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-xs bg-surface-container-low px-sm py-1.5 rounded-lg border border-outline-variant/40 w-full sm:w-64">
            <Search size={16} className="text-on-surface-variant" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none font-body-md text-xs text-on-surface placeholder:text-on-surface-variant w-full"
            />
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="p-xl text-center text-on-surface-variant animate-pulse">
            Chargement du catalogue...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-xl text-center text-on-surface-variant space-y-xs">
            <Package size={36} className="mx-auto text-on-surface-variant/50" />
            <p>Aucun produit ne correspond à vos critères.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant font-label-md text-xs uppercase tracking-wider">
                  <th className="p-sm md:p-md font-semibold">Produit</th>
                  <th className="p-sm md:p-md font-semibold">Catégorie</th>
                  <th className="p-sm md:p-md font-semibold">Prix</th>
                  <th className="p-sm md:p-md font-semibold">Stock</th>
                  <th className="p-sm md:p-md font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-sm divide-y divide-outline-variant/20">
                {filteredProducts.map((product) => {
                  const stock = product.stock !== undefined ? product.stock : 50;
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-surface-container-low/30 transition-colors group"
                    >
                      <td className="p-sm md:p-md">
                        <div className="flex items-center gap-md">
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-surface-variant shrink-0 border border-outline-variant/30">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-on-surface">
                              {product.baseName || product.name}
                            </p>
                            <p className="font-caption text-xs text-on-surface-variant line-clamp-1">
                              {product.description}
                            </p>
                            {product.hasMultipleVariants && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {product.variants.map((v) => (
                                  <span
                                    key={v.id}
                                    className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant font-medium"
                                  >
                                    {v.size}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-sm md:p-md">
                        <span className="px-2.5 py-1 text-xs rounded-full font-label-md bg-secondary/10 text-secondary border border-secondary/20 font-semibold">
                          {product.rawCategory || product.categories?.[0] || "CHEVEUX"}
                        </span>
                      </td>

                      <td className="p-sm md:p-md font-bold text-primary">
                        {product.priceAr.toLocaleString()} Ar
                      </td>

                      <td className="p-sm md:p-md">
                        {stock <= 0 ? (
                          <span className="px-2.5 py-1 text-xs rounded-full font-label-md bg-rose-100 text-rose-800 border border-rose-300">
                            Rupture
                          </span>
                        ) : stock <= 5 ? (
                          <span className="px-2.5 py-1 text-xs rounded-full font-label-md bg-amber-100 text-amber-800 border border-amber-300">
                            {stock}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs rounded-full font-label-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {stock}
                          </span>
                        )}
                      </td>

                      <td className="p-sm md:p-md text-right">
                        <div className="flex justify-end gap-xs">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-md text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-1.5 rounded-md text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-tertiary/20 backdrop-blur-[4px]">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl p-lg space-y-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-sm">
              <h3 className="font-headline-md text-lg text-on-surface font-bold">
                {editingProduct ? "Modifier le Produit" : "Ajouter un Produit"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-md">
              {/* Product Name */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Nom du Produit *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ex: Huile d'Avocat Pure"
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg px-sm py-2 text-sm text-on-surface focus:border-primary outline-none"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-surface-bright border border-outline-variant rounded-lg px-sm py-2 text-sm text-on-surface focus:border-primary outline-none cursor-pointer"
                  >
                    <option value="VISAGE">VISAGE</option>
                    <option value="CHEVEUX">CHEVEUX</option>
                    <option value="CORPS">CORPS</option>
                    <option value="HUILES_ESSENTIELLES">HUILES ESSENTIELLES</option>
                    <option value="ACCESSOIRES">ACCESSOIRES</option>
                    <option value="ONGLES">ONGLES</option>
                    <option value="CILS">CILS</option>
                    <option value="LEVRES">LEVRES</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                    Prix (en Ariary) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-surface-bright border border-outline-variant rounded-lg px-sm py-2 text-sm text-on-surface focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Stock Disponible *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formStock}
                  onChange={(e) => setFormStock(Number(e.target.value))}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg px-sm py-2 text-sm text-on-surface focus:border-primary outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Soin naturel pressé à froid pour nourrir les cheveux..."
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg px-sm py-2 text-sm text-on-surface focus:border-primary outline-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1">
                  Image du Produit *
                </label>

                {/* Upload Area Box */}
                <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-md text-center bg-surface-bright hover:border-primary transition-colors">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-xs py-sm text-primary">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="text-xs font-label-md">Upload de l&apos;image dans Supabase...</span>
                    </div>
                  ) : formImageUrl ? (
                    <div className="flex items-center justify-between gap-md">
                      <div className="flex items-center gap-sm">
                        <img
                          src={formImageUrl}
                          alt="Preview"
                          className="w-14 h-14 object-cover rounded-lg border border-outline-variant shadow-xs shrink-0"
                        />
                        <div className="text-left">
                          <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Image chargée
                          </p>
                          <p className="text-[11px] text-on-surface-variant line-clamp-1 max-w-[200px]">
                            {formImageUrl}
                          </p>
                        </div>
                      </div>

                      <label
                        htmlFor="product-image-file"
                        className="px-sm py-1.5 bg-surface-container border border-outline-variant rounded-md text-xs font-label-md text-primary hover:text-secondary cursor-pointer"
                      >
                        Changer
                      </label>
                    </div>
                  ) : (
                    <label
                      htmlFor="product-image-file"
                      className="flex flex-col items-center gap-xs cursor-pointer py-xs"
                    >
                      <UploadCloud size={32} className="text-primary" />
                      <span className="text-xs font-semibold text-primary">
                        Cliquez pour choisir une image sur votre ordinateur
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        Formats acceptés : PNG, JPG, WEBP (stockage direct en base de données)
                      </span>
                    </label>
                  )}

                  <input
                    id="product-image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </div>

                {uploadError && (
                  <p className="mt-xs text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
                    ⚠️ {uploadError}
                  </p>
                )}

              </div>

              {/* Actions */}
              <div className="flex justify-end gap-sm pt-sm border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-md py-2 rounded-lg text-xs font-label-md text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-md py-2 rounded-lg text-xs font-label-md bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                >
                  {submitting ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
