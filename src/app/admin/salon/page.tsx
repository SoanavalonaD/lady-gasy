"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Scissors,
  UploadCloud,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  X,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  SALON_CATEGORIES,
  SALON_SERVICES,
  SALON_SUBCATEGORIES,
  SalonCategoryId,
  SalonServiceItem,
} from "@/data/salonServices";
import {
  MAX_SALON_PHOTOS,
  getSalonServiceImages,
  updateSalonServiceImages,
  deleteSalonServiceImage,
  uploadSalonServiceImages,
} from "@/data/queries";

export default function AdminSalonServicesPage() {
  const [serviceImages, setServiceImages] = useState<Record<string, string[]>>({});
  const [activeSlide, setActiveSlide] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"TOUS" | SalonCategoryId>("TOUS");
  const [imageFilter, setImageFilter] = useState<
    "ALL" | "WITH_IMAGE" | "COMPLETE_3" | "WITHOUT_IMAGE"
  >("ALL");

  const [uploadingServiceId, setUploadingServiceId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal state for managing the 3 photos in detail
  const [activeService, setActiveService] = useState<SalonServiceItem | null>(null);
  const [modalPhotos, setModalPhotos] = useState<string[]>([]);
  const [savingModal, setSavingModal] = useState(false);

  const loadImages = async () => {
    setLoading(true);
    try {
      const map = await getSalonServiceImages();
      setServiceImages(map);
    } catch (err) {
      console.error("Erreur lors du chargement des images du salon:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4500);
  };

  const getImagesForService = (service: SalonServiceItem): string[] => {
    const fromState = serviceImages[service.id];
    if (fromState && fromState.length > 0) return fromState.slice(0, MAX_SALON_PHOTOS);
    if (service.images && service.images.length > 0)
      return service.images.slice(0, MAX_SALON_PHOTOS);
    if (service.image) return [service.image];
    return [];
  };

  const handleFileUpload = async (
    service: SalonServiceItem,
    e: React.ChangeEvent<HTMLInputElement>,
    slotIndex?: number
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingServiceId(service.id);
    setErrorMessage(null);
    try {
      const uploadedUrls = await uploadSalonServiceImages(files);
      const currentList = [...getImagesForService(service)];

      let nextList: string[];
      if (slotIndex !== undefined && uploadedUrls.length === 1) {
        if (slotIndex < currentList.length) {
          currentList[slotIndex] = uploadedUrls[0];
          nextList = currentList;
        } else {
          nextList = [...currentList, uploadedUrls[0]].slice(0, MAX_SALON_PHOTOS);
        }
      } else {
        nextList = [...currentList, ...uploadedUrls].slice(0, MAX_SALON_PHOTOS);
      }

      const saved = await updateSalonServiceImages(service.id, nextList);
      setServiceImages((prev) => ({ ...prev, [service.id]: saved }));
      setActiveSlide((prev) => ({
        ...prev,
        [service.id]:
          slotIndex !== undefined
            ? Math.min(slotIndex, Math.max(0, saved.length - 1))
            : Math.max(0, saved.length - 1),
      }));
      showToast(
        `Photos enregistrées pour « ${service.service} » (${saved.length}/${MAX_SALON_PHOTOS}) !`
      );
    } catch (err: any) {
      console.error("Upload error:", err);
      showError(err.message || "Erreur lors du téléchargement de l'image.");
    } finally {
      setUploadingServiceId(null);
      e.target.value = "";
    }
  };

  const handleRemoveSinglePhoto = async (service: SalonServiceItem, photoIndex: number) => {
    if (
      !window.confirm(
        `Voulez-vous retirer la photo ${photoIndex + 1} de la prestation « ${service.service} » ?`
      )
    ) {
      return;
    }

    setUploadingServiceId(service.id);
    try {
      const saved = await deleteSalonServiceImage(service.id, photoIndex);
      setServiceImages((prev) => {
        const next = { ...prev };
        if (saved.length > 0) {
          next[service.id] = saved;
        } else {
          delete next[service.id];
        }
        return next;
      });
      setActiveSlide((prev) => ({
        ...prev,
        [service.id]: Math.max(0, Math.min(prev[service.id] || 0, saved.length - 1)),
      }));
      showToast(`Photo ${photoIndex + 1} retirée pour « ${service.service} ».`);
    } catch (err: any) {
      console.error("Delete image error:", err);
      showError(err.message || "Erreur lors de la suppression de l'image.");
    } finally {
      setUploadingServiceId(null);
    }
  };

  const handleRemoveAllPhotos = async (service: SalonServiceItem) => {
    if (
      !window.confirm(
        `Voulez-vous retirer toutes les photos de la prestation « ${service.service} » ?`
      )
    ) {
      return;
    }

    setUploadingServiceId(service.id);
    try {
      await deleteSalonServiceImage(service.id);
      setServiceImages((prev) => {
        const next = { ...prev };
        delete next[service.id];
        return next;
      });
      showToast(`Toutes les photos de « ${service.service} » ont été retirées.`);
    } catch (err: any) {
      showError(err.message || "Erreur lors de la suppression.");
    } finally {
      setUploadingServiceId(null);
    }
  };

  const openUploadModal = (service: SalonServiceItem) => {
    setActiveService(service);
    setModalPhotos(getImagesForService(service));
    setErrorMessage(null);
  };

  const handleModalSlotUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slotIndex?: number
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedUrls = await uploadSalonServiceImages(files);
      setModalPhotos((prev) => {
        const current = [...prev];
        if (slotIndex !== undefined && uploadedUrls.length === 1) {
          if (slotIndex < current.length) {
            current[slotIndex] = uploadedUrls[0];
            return current;
          }
          return [...current, uploadedUrls[0]].slice(0, MAX_SALON_PHOTOS);
        }
        return [...current, ...uploadedUrls].slice(0, MAX_SALON_PHOTOS);
      });
    } catch (err: any) {
      showError(err.message || "Format ou taille d'image invalide.");
    } finally {
      e.target.value = "";
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService) return;

    setSavingModal(true);
    try {
      const saved = await updateSalonServiceImages(activeService.id, modalPhotos);
      setServiceImages((prev) => {
        const next = { ...prev };
        if (saved.length > 0) {
          next[activeService.id] = saved;
        } else {
          delete next[activeService.id];
        }
        return next;
      });
      showToast(
        `Illustrations mises à jour pour « ${activeService.service} » (${saved.length}/${MAX_SALON_PHOTOS}) !`
      );
      setActiveService(null);
    } catch (err: any) {
      showError(err.message || "Erreur lors de la sauvegarde.");
    } finally {
      setSavingModal(false);
    }
  };

  const getCategoryLabel = (catId: SalonCategoryId) =>
    SALON_CATEGORIES.find((c) => c.id === catId)?.label || catId;

  const filteredServices = React.useMemo(() => {
    return SALON_SERVICES.filter((item) => {
      const imgs = getImagesForService(item);

      if (selectedCategory !== "TOUS" && item.category !== selectedCategory) {
        return false;
      }

      if (imageFilter === "WITH_IMAGE" && imgs.length === 0) return false;
      if (imageFilter === "COMPLETE_3" && imgs.length < MAX_SALON_PHOTOS) return false;
      if (imageFilter === "WITHOUT_IMAGE" && imgs.length > 0) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const subTitle = SALON_SUBCATEGORIES[item.subcategory]?.title || item.subcategory;
        const matches =
          item.service.toLowerCase().includes(q) ||
          subTitle.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [serviceImages, selectedCategory, imageFilter, searchQuery]);

  const totalCount = SALON_SERVICES.length;
  const illustratedCount = SALON_SERVICES.filter(
    (s) => getImagesForService(s).length > 0
  ).length;
  const complete3Count = SALON_SERVICES.filter(
    (s) => getImagesForService(s).length === MAX_SALON_PHOTOS
  ).length;
  const totalUploadedPhotos = SALON_SERVICES.reduce(
    (acc, s) => acc + getImagesForService(s).length,
    0
  );

  return (
    <div className="space-y-lg pt-md">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-md py-sm rounded-lg shadow-xl flex items-center gap-xs font-label-md animate-bounce">
          <CheckCircle2 size={18} />
          {toastMessage}
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-700 text-white px-md py-sm rounded-lg shadow-xl flex items-center gap-xs font-label-md">
          <span>⚠️ {errorMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface flex items-center gap-xs">
            <Scissors size={26} className="text-primary" />
            Illustrations des Prestations (3 photos / prestation)
          </h2>
          <p className="font-body-md text-on-surface-variant mt-xs">
            Ajoutez jusqu&apos;à 3 photos par prestation pour illustrer vos réalisations sur la page du Salon.
          </p>
        </div>

        <Link
          href="/salon#tarifs"
          className="bg-primary text-on-primary font-label-md text-sm px-md py-sm rounded-lg flex items-center gap-xs hover:bg-primary/90 transition-colors shadow-sm"
        >
          <ExternalLink size={16} />
          Voir sur la page Salon
        </Link>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-md flex items-center justify-between">
          <div>
            <p className="text-xs font-label-md text-on-surface-variant">Prestations illustrées</p>
            <p className="text-2xl font-bold text-on-surface mt-0.5">
              {illustratedCount} / {totalCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Scissors size={20} />
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-md flex items-center justify-between">
          <div>
            <p className="text-xs font-label-md text-on-surface-variant">
              Complètes (3/3 photos)
            </p>
            <p className="text-2xl font-bold text-emerald-700 mt-0.5">
              {complete3Count} prestation{complete3Count > 1 ? "s" : ""}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-md flex items-center justify-between">
          <div>
            <p className="text-xs font-label-md text-on-surface-variant">
              Total photos chargées
            </p>
            <p className="text-2xl font-bold text-amber-700 mt-0.5">
              {totalUploadedPhotos} / {totalCount * MAX_SALON_PHOTOS}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <ImageIcon size={20} />
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-xs">
        {/* Filter Toolbar */}
        <div className="p-sm md:p-md border-b border-outline-variant/30 flex flex-col lg:flex-row gap-md lg:items-center lg:justify-between bg-surface-bright">
          <div className="flex flex-wrap items-center gap-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory("TOUS")}
              className={`px-sm py-1 font-label-md text-xs rounded-md border transition-colors cursor-pointer ${
                selectedCategory === "TOUS"
                  ? "bg-primary text-on-primary border-primary font-bold"
                  : "bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-variant"
              }`}
            >
              TOUTES LES CATÉGORIES
            </button>
            {SALON_CATEGORIES.filter((c) => !c.comingSoon).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-sm py-1 font-label-md text-xs rounded-md border transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-primary text-on-primary border-primary font-bold"
                    : "bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-variant"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-sm">
            {/* Image Status Filter */}
            <select
              value={imageFilter}
              onChange={(e) => setImageFilter(e.target.value as any)}
              aria-label="Filtrer par statut d'image"
              className="bg-surface-container-low border border-outline-variant/40 rounded-lg px-sm py-1.5 text-xs font-label-md text-on-surface outline-none cursor-pointer"
            >
              <option value="ALL">Toutes ({totalCount})</option>
              <option value="WITH_IMAGE">Avec au moins 1 photo ({illustratedCount})</option>
              <option value="COMPLETE_3">Complètes 3/3 photos ({complete3Count})</option>
              <option value="WITHOUT_IMAGE">
                Sans photo ({totalCount - illustratedCount})
              </option>
            </select>

            {/* Search Input */}
            <div className="flex items-center gap-xs bg-surface-container-low px-sm py-1.5 rounded-lg border border-outline-variant/40 w-full sm:w-64">
              <Search size={16} className="text-on-surface-variant" />
              <input
                type="text"
                placeholder="Rechercher une prestation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none font-body-md text-xs text-on-surface placeholder:text-on-surface-variant w-full"
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="p-xl text-center text-on-surface-variant animate-pulse">
            Chargement des prestations du salon...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-xl text-center text-on-surface-variant space-y-xs">
            <Scissors size={36} className="mx-auto text-on-surface-variant/50" />
            <p>Aucune prestation ne correspond à vos critères.</p>
          </div>
        ) : (
          <div className="p-sm md:p-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {filteredServices.map((service) => {
              const images = getImagesForService(service);
              const slideIdx = Math.min(
                activeSlide[service.id] ?? 0,
                Math.max(0, images.length - 1)
              );
              const currentImage = images[slideIdx];
              const isUploading = uploadingServiceId === service.id;
              const subTitle =
                SALON_SUBCATEGORIES[service.subcategory]?.title || service.subcategory;

              return (
                <div
                  key={service.id}
                  className="bg-surface rounded-xl border border-outline-variant/50 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
                >
                  <div>
                    {/* Main Image Preview or Upload Placeholder */}
                    <div className="relative aspect-[16/10] bg-surface-container-low border-b border-outline-variant/30 overflow-hidden group">
                      {isUploading ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-xs text-primary">
                          <Loader2 size={28} className="animate-spin" />
                          <span className="text-xs font-label-md">Enregistrement...</span>
                        </div>
                      ) : currentImage ? (
                        <>
                          <img
                            src={currentImage}
                            alt={`${service.service} — Photo ${slideIdx + 1}`}
                            width={400}
                            height={250}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div
                            className={`absolute top-2 left-2 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs ${
                              images.length === MAX_SALON_PHOTOS
                                ? "bg-emerald-700/90"
                                : "bg-primary/90"
                            }`}
                          >
                            <CheckCircle2 size={11} />
                            {images.length}/{MAX_SALON_PHOTOS} photos
                          </div>

                          {images.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveSlide((prev) => ({
                                    ...prev,
                                    [service.id]:
                                      (slideIdx - 1 + images.length) % images.length,
                                  }))
                                }
                                aria-label="Photo précédente"
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-on-surface p-1 rounded-full shadow-xs cursor-pointer"
                              >
                                <ChevronLeft size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveSlide((prev) => ({
                                    ...prev,
                                    [service.id]: (slideIdx + 1) % images.length,
                                  }))
                                }
                                aria-label="Photo suivante"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-on-surface p-1 rounded-full shadow-xs cursor-pointer"
                              >
                                <ChevronRight size={14} />
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => openUploadModal(service)}
                            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors cursor-pointer"
                            title="Gérer les 3 photos en grand"
                          >
                            <Eye size={14} />
                          </button>
                        </>
                      ) : (
                        <label
                          htmlFor={`upload-multi-${service.id}`}
                          className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-4 text-center cursor-pointer hover:bg-primary/5 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <UploadCloud size={20} />
                          </div>
                          <span className="text-xs font-semibold text-primary">
                            Ajouter jusqu&apos;à 3 photos
                          </span>
                          <span className="text-[10px] text-on-surface-variant">
                            JPG, PNG, WEBP (max 4 Mo / photo)
                          </span>
                        </label>
                      )}
                    </div>

                    {/* 3 Emplacements Photos (Photo 1, Photo 2, Photo 3) */}
                    <div className="px-3 py-2 bg-surface-container-low/60 border-b border-outline-variant/30 grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((slotIdx) => {
                        const slotImg = images[slotIdx];
                        const isSelected = slotImg && slideIdx === slotIdx;

                        if (slotImg) {
                          return (
                            <div
                              key={slotIdx}
                              className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${
                                isSelected
                                  ? "border-primary shadow-2xs"
                                  : "border-outline-variant/40 opacity-80 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={slotImg}
                                alt={`${service.service} photo ${slotIdx + 1}`}
                                width={120}
                                height={75}
                                loading="lazy"
                                onClick={() =>
                                  setActiveSlide((prev) => ({
                                    ...prev,
                                    [service.id]: slotIdx,
                                  }))
                                }
                                className="w-full h-full object-cover cursor-pointer"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-black/65 flex items-center justify-between px-1 py-0.5">
                                <label
                                  htmlFor={`upload-slot-${service.id}-${slotIdx}`}
                                  className="text-[9px] font-semibold text-white hover:underline cursor-pointer px-0.5"
                                  title={`Remplacer la photo ${slotIdx + 1}`}
                                >
                                  Photo {slotIdx + 1}
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSinglePhoto(service, slotIdx)}
                                  disabled={isUploading}
                                  className="text-rose-300 hover:text-rose-100 p-0.5 cursor-pointer"
                                  title={`Supprimer la photo ${slotIdx + 1}`}
                                >
                                  <Trash2 size={10} />
                                </button>
                                <input
                                  id={`upload-slot-${service.id}-${slotIdx}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(service, e, slotIdx)}
                                  disabled={isUploading}
                                  className="hidden"
                                />
                              </div>
                            </div>
                          );
                        }

                        return (
                          <label
                            key={slotIdx}
                            htmlFor={`upload-slot-${service.id}-${slotIdx}`}
                            className="aspect-[16/10] rounded-lg border border-dashed border-outline-variant bg-surface hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-0.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            title={`Ajouter la photo ${slotIdx + 1}`}
                          >
                            <Plus size={13} />
                            <span className="text-[9px] font-semibold">
                              Photo {slotIdx + 1}
                            </span>
                            <input
                              id={`upload-slot-${service.id}-${slotIdx}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(service, e, slotIdx)}
                              disabled={isUploading}
                              className="hidden"
                            />
                          </label>
                        );
                      })}
                    </div>

                    {/* Service Info */}
                    <div className="p-md">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                          {getCategoryLabel(service.category)}
                        </span>
                        <span className="font-serif text-sm font-bold text-primary">
                          {service.price}
                        </span>
                      </div>

                      <p className="text-[11px] text-on-surface-variant font-medium mb-0.5">
                        {subTitle}
                      </p>
                      <h3 className="font-serif text-base font-bold text-on-surface leading-snug mb-1.5">
                        {service.service}
                      </h3>
                      {service.description && (
                        <p className="text-xs text-on-surface-variant line-clamp-2">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-md py-sm bg-surface-container-low/50 border-t border-outline-variant/30 flex items-center justify-between gap-xs">
                    {images.length < MAX_SALON_PHOTOS ? (
                      <label
                        htmlFor={`upload-multi-${service.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-sm py-1.5 rounded-lg text-xs font-label-md bg-primary text-on-primary hover:bg-primary/90 transition-colors cursor-pointer text-center"
                      >
                        <UploadCloud size={14} />
                        <span>
                          Ajouter ({images.length}/{MAX_SALON_PHOTOS} photos)
                        </span>
                      </label>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openUploadModal(service)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-sm py-1.5 rounded-lg text-xs font-label-md bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-colors cursor-pointer text-center"
                      >
                        <Eye size={14} />
                        <span>Gérer les 3 photos</span>
                      </button>
                    )}

                    <input
                      id={`upload-multi-${service.id}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(service, e)}
                      disabled={isUploading}
                      className="hidden"
                    />

                    {images.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAllPhotos(service)}
                        disabled={isUploading}
                        className="p-1.5 rounded-lg text-error hover:bg-error/10 border border-error/20 transition-colors cursor-pointer"
                        title="Tout retirer"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview / 3-Photo Upload Modal */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-tertiary/30 backdrop-blur-[4px]">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl p-lg w-full max-w-2xl space-y-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-outline-variant/30 pb-sm">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                  {getCategoryLabel(activeService.category)}
                </span>
                <h3 className="font-headline-md text-lg text-on-surface font-bold mt-1">
                  {activeService.service} — Galerie (jusqu&apos;à 3 photos)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveService(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-md">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                {[0, 1, 2].map((slotIdx) => {
                  const slotUrl = modalPhotos[slotIdx];
                  return (
                    <div
                      key={slotIdx}
                      className="border-2 border-dashed border-outline-variant/60 rounded-xl p-sm text-center bg-surface-bright flex flex-col justify-between"
                    >
                      <span className="text-[11px] font-bold text-on-surface-variant mb-2 block">
                        Photo {slotIdx + 1}
                      </span>

                      {slotUrl ? (
                        <div className="space-y-xs">
                          <div className="aspect-[16/10] rounded-lg overflow-hidden border border-outline-variant">
                            <img
                              src={slotUrl}
                              alt={`${activeService.service} — Photo ${slotIdx + 1}`}
                              width={240}
                              height={150}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex justify-center gap-xs pt-1">
                            <label
                              htmlFor={`modal-slot-input-${slotIdx}`}
                              className="px-2 py-1 bg-surface-container border border-outline-variant rounded text-[11px] font-label-md text-primary hover:text-secondary cursor-pointer inline-flex items-center gap-1"
                            >
                              <UploadCloud size={12} />
                              Changer
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setModalPhotos((prev) =>
                                  prev.filter((_, i) => i !== slotIdx)
                                )
                              }
                              className="px-2 py-1 bg-rose-50 border border-rose-200 rounded text-[11px] font-label-md text-rose-700 hover:bg-rose-100 cursor-pointer inline-flex items-center gap-1"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor={`modal-slot-input-${slotIdx}`}
                          className="aspect-[16/10] flex flex-col items-center justify-center gap-1 cursor-pointer rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          <UploadCloud size={24} className="text-primary" />
                          <span className="text-[11px] font-semibold text-primary">
                            Choisir une photo
                          </span>
                        </label>
                      )}

                      <input
                        id={`modal-slot-input-${slotIdx}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleModalSlotUpload(e, slotIdx)}
                        className="hidden"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-sm pt-sm border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setActiveService(null)}
                  className="px-md py-2 rounded-lg text-xs font-label-md text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingModal}
                  className="px-md py-2 rounded-lg text-xs font-label-md bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                >
                  {savingModal ? "Enregistrement..." : "Enregistrer les photos"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
