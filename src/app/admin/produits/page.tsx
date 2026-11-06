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
  MAX_PRODUCT_PHOTOS,
  getDbProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  uploadProductImages,
  parseProductImages,
  serializeProductImages,
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
  const [formImages, setFormImages] = useState<string[]>([]);
  // État pour les variantes (prix et stock par contenance)
  const [formVariants, setFormVariants] = useState<
    Array<{ id: string; size: string; priceAr: number; stock: number }>
  >([]);

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
    setFormImages([]);
    setFormVariants([]);
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
    const initialImages =
      product.images && product.images.length > 0
        ? product.images.slice(0, MAX_PRODUCT_PHOTOS)
        : parseProductImages(product.image);
    setFormImages(initialImages);

    // Si le produit est groupé avec plusieurs formats/variantes
    const grouped = product as GroupedProduct;
    if (grouped.variants && grouped.variants.length > 0) {
      setFormVariants(
        grouped.variants.map((v) => ({
          id: v.id,
          size: v.size,
          priceAr: v.priceAr,
          stock: v.product.stock !== undefined ? v.product.stock : 50,
        }))
      );
    } else {
      setFormVariants([]);
    }

    setUploadError(null);
    setUploadingImage(false);
    setModalOpen(true);
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slotIndex?: number
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setUploadError(null);
    try {
      const uploadedUrls = await uploadProductImages(files);
      setFormImages((prev) => {
        const current = [...prev];
        if (slotIndex !== undefined && uploadedUrls.length === 1) {
          if (slotIndex < current.length) {
            current[slotIndex] = uploadedUrls[0];
            return current;
          }
          return [...current, uploadedUrls[0]].slice(0, MAX_PRODUCT_PHOTOS);
        }
        return [...current, ...uploadedUrls].slice(0, MAX_PRODUCT_PHOTOS);
      });
      showToast(
        uploadedUrls.length > 1
          ? `${uploadedUrls.length} photos chargées avec succès !`
          : "Photo chargée avec succès !"
      );
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Erreur d'envoi de l'image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveFormImage = (slotIndex: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== slotIndex));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0) return;

    const serializedImages = serializeProductImages(formImages);

    setSubmitting(true);
    try {
      if (editingProduct) {
        // Si le produit possède des variantes de contenance (ex: 5ml, 10ml, 30ml)
        if (formVariants.length > 0) {
          // Mettre à jour chaque variante avec sa contenance, son prix et son stock
          await Promise.all(
            formVariants.map((v) =>
              updateAdminProduct(v.id, {
                nom_produit: `${formName} ${v.size}`.trim(),
                description: formDescription,
                categorie: formCategory,
                prix: v.priceAr,
                stock_disponible: v.stock,
                image_url: serializedImages,
              })
            )
          );
          showToast(`Produit "${formName}" et ses ${formVariants.length} formats mis à jour avec succès !`);
        } else {
          await updateAdminProduct(editingProduct.id, {
            nom_produit: formName,
            description: formDescription,
            categorie: formCategory,
            prix: formPrice,
            stock_disponible: formStock,
            image_url: serializedImages,
          });
          showToast(`Produit "${formName}" mis à jour avec succès !`);
        }
      } else {
        await createAdminProduct({
          nom_produit: formName,
          description: formDescription,
          categorie: formCategory,
          prix: formPrice,
          stock_disponible: formStock,
          image_url: serializedImages,
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
                  <th className="p-sm md:p-md font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-sm divide-y divide-outline-variant/20">
                {filteredProducts.map((product) => {
                  const prodImages =
                    product.images && product.images.length > 0
                      ? product.images
                      : [product.image];
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-surface-container-low/30 transition-colors group"
                    >
                      <td className="p-sm md:p-md">
                        <div className="flex items-center gap-md">
                          <div className="flex items-center gap-1 shrink-0">
                            {prodImages.slice(0, MAX_PRODUCT_PHOTOS).map((imgUrl, i) => (
                              <div
                                key={i}
                                className="w-12 h-12 rounded-md overflow-hidden bg-surface-variant border border-outline-variant/30 relative"
                              >
                                <img
                                  src={imgUrl}
                                  alt={`${product.name} (${i + 1})`}
                                  width={48}
                                  height={48}
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-on-surface">
                                {product.baseName || product.name}
                              </p>
                              <span className="text-[10px] font-label-md px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                                {prodImages.length}/{MAX_PRODUCT_PHOTOS} photo{prodImages.length > 1 ? "s" : ""}
                              </span>
                            </div>
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
                                    {v.size || "Standard"}
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

                {formVariants.length === 0 && (
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
                )}
              </div>

              {/* Variants Section: Tailles / Contenances multiples avec prix et stocks dédiés */}
              {formVariants.length > 0 ? (
                <div className="bg-surface-container-low/70 border border-primary/20 rounded-xl p-md space-y-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-label-md text-xs font-bold text-primary">
                        Déclinaisons de contenance ({formVariants.length} formats disponibles)
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        Modifiez directement le libellé, le prix et le stock disponible pour chaque contenance.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-xs pt-xs">
                    {formVariants.map((v, idx) => (
                      <div
                        key={v.id}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-xs items-center bg-surface-bright p-sm rounded-lg border border-outline-variant/40"
                      >
                        <div className="sm:col-span-4">
                          <label className="block text-[10px] font-label-md text-on-surface-variant font-semibold">
                            Format / Contenance
                          </label>
                          <input
                            type="text"
                            required
                            value={v.size}
                            onChange={(e) => {
                              const next = [...formVariants];
                              next[idx] = { ...next[idx], size: e.target.value };
                              setFormVariants(next);
                            }}
                            placeholder="ex: 10ml, 50g..."
                            className="w-full bg-surface border border-outline-variant rounded px-2 py-1 text-xs font-medium text-on-surface focus:border-primary outline-none"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-[10px] font-label-md text-on-surface-variant font-semibold">
                            Prix (Ariary)
                          </label>
                          <input
                            type="number"
                            required
                            min={100}
                            step={100}
                            value={v.priceAr}
                            onChange={(e) => {
                              const next = [...formVariants];
                              next[idx] = { ...next[idx], priceAr: Number(e.target.value) };
                              setFormVariants(next);
                            }}
                            className="w-full bg-surface border border-outline-variant rounded px-2 py-1 text-xs font-bold text-primary focus:border-primary outline-none"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-[10px] font-label-md text-on-surface-variant font-semibold">
                            Stock dispo
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={v.stock}
                            onChange={(e) => {
                              const next = [...formVariants];
                              next[idx] = { ...next[idx], stock: Number(e.target.value) };
                              setFormVariants(next);
                            }}
                            className="w-full bg-surface border border-outline-variant rounded px-2 py-1 text-xs font-medium text-on-surface focus:border-primary outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Stock unique si pas de déclinaison */
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
              )}

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

              {/* Image Upload (up to 3 photos per product) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-label-md text-xs font-semibold text-on-surface">
                    Photos du Produit ({formImages.length}/{MAX_PRODUCT_PHOTOS} photos) *
                  </label>
                  {formImages.length < MAX_PRODUCT_PHOTOS && (
                    <label
                      htmlFor="product-image-file-multi"
                      className="text-xs font-label-md text-primary hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <UploadCloud size={14} />
                      Sélectionner jusqu&apos;à {MAX_PRODUCT_PHOTOS - formImages.length} photo(s)
                    </label>
                  )}
                  <input
                    id="product-image-file-multi"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e)}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </div>

                {uploadingImage ? (
                  <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-md text-center bg-surface-bright flex flex-col items-center gap-xs py-md text-primary">
                    <Loader2 size={24} className="animate-spin" />
                    <span className="text-xs font-label-md">Chargement des photos en cours...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
                    {[0, 1, 2].map((slotIdx) => {
                      const slotUrl = formImages[slotIdx];
                      return (
                        <div
                          key={slotIdx}
                          className="border-2 border-dashed border-outline-variant/60 rounded-xl p-sm text-center bg-surface-bright hover:border-primary transition-colors flex flex-col justify-between"
                        >
                          <span className="text-[11px] font-bold text-on-surface-variant mb-1.5 block">
                            {slotIdx === 0 ? "Photo 1 (Principale)" : `Photo ${slotIdx + 1}`}
                          </span>

                          {slotUrl ? (
                            <div className="space-y-xs">
                              <div className="aspect-square rounded-lg overflow-hidden border border-outline-variant bg-surface-container-low">
                                <img
                                  src={slotUrl}
                                  alt={`Photo produit ${slotIdx + 1}`}
                                  width={180}
                                  height={180}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex items-center justify-center gap-xs pt-1">
                                <label
                                  htmlFor={`product-slot-file-${slotIdx}`}
                                  className="px-2 py-1 bg-surface-container border border-outline-variant rounded text-[11px] font-label-md text-primary hover:text-secondary cursor-pointer inline-flex items-center gap-1"
                                >
                                  <UploadCloud size={12} />
                                  Changer
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFormImage(slotIdx)}
                                  className="px-2 py-1 bg-rose-50 border border-rose-200 rounded text-[11px] font-label-md text-rose-700 hover:bg-rose-100 cursor-pointer inline-flex items-center gap-1"
                                  title="Supprimer cette photo"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label
                              htmlFor={`product-slot-file-${slotIdx}`}
                              className="aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer rounded-lg hover:bg-primary/5 transition-colors p-2"
                            >
                              <UploadCloud size={24} className="text-primary" />
                              <span className="text-[11px] font-semibold text-primary">
                                Ajouter Photo {slotIdx + 1}
                              </span>
                              <span className="text-[10px] text-on-surface-variant">
                                PNG, JPG, WEBP
                              </span>
                            </label>
                          )}

                          <input
                            id={`product-slot-file-${slotIdx}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, slotIdx)}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

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
