
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Save, PlusCircle, Trash2, CheckCircle, GripVertical } from 'lucide-react';
import { ImageUploader } from '@/components/image-uploader';
import { CreatableSelect } from '@/components/ui/creatable-select';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

async function saveContent(content: any) {
    const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
    return response.json();
}

type SaveStatus = "unsaved" | "saving" | "saved";


interface SortableCreationItemProps {
    item: any;
    index: number;
    handleCreationItemChange: (index: number, field: 'src' | 'title' | 'description' | 'category', value: string) => void;
    handleRemoveCreationItem: (index: number) => void;
    categories: string[];
}

const SortableCreationItem = ({ item, index, handleCreationItemChange, handleRemoveCreationItem, categories }: SortableCreationItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.src + index }); // Ensure unique ID

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} >
            <Card className="p-4 bg-muted/50 relative">
                <div {...attributes} {...listeners} className="absolute -top-2 left-2 cursor-grab touch-none p-1" aria-label="Déplacer la création">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-7 w-7 rounded-full z-10"
                  onClick={() => handleRemoveCreationItem(index)}
                  aria-label="Supprimer la création"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                <h4 className="font-semibold mb-2 ml-8">Création {index + 1}</h4>
                <div className="space-y-4">
                    <div>
                        <Label>Image (format 3/4)</Label>
                        <ImageUploader 
                            currentImageUrl={item.src}
                            onUploadComplete={(url) => handleCreationItemChange(index, 'src', url)}
                            aspectRatio={3/4}
                        />
                    </div>
                    <div>
                        <Label htmlFor={`creation-title-${index}`}>Titre</Label>
                        <Input id={`creation-title-${index}`} value={item.title} onChange={(e) => handleCreationItemChange(index, 'title', e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor={`creation-description-${index}`}>Description</Label>
                        <Textarea id={`creation-description-${index}`} value={item.description} onChange={(e) => handleCreationItemChange(index, 'description', e.target.value)} />
                    </div>
                     <div>
                        <Label htmlFor={`creation-category-${index}`}>Catégorie</Label>
                        <CreatableSelect
                            id={`creation-category-${index}`}
                            options={categories.map((c: string) => ({ value: c, label: c }))}
                            value={item.category}
                            onChange={(value) => handleCreationItemChange(index, 'category', value)}
                            placeholder="Choisir ou créer une catégorie..."
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};


export function AdminEditor({ initialContent: initialContentProp }: { initialContent: any }) {
  const [content, setContent] = useState(initialContentProp);
  const [initialContent, setInitialContent] = useState(initialContentProp);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const { toast } = useToast();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (JSON.stringify(content) !== JSON.stringify(initialContent)) {
      setSaveStatus("unsaved");
    } else {
      setSaveStatus("saved");
    }
  }, [content, initialContent]);

  useEffect(() => {
    setContent(initialContentProp);
    setInitialContent(initialContentProp);
  }, [initialContentProp]);

  const handleSave = async () => {
    setSaveStatus("saving");
    
    // Crée une nouvelle copie modifiable du contenu
    let updatedContent = JSON.parse(JSON.stringify(content));

    // Garantit que la liste des catégories est synchronisée avec les catégories utilisées
    if (updatedContent.creations.items) {
      const usedCategories = Array.from(new Set(updatedContent.creations.items.map((item: any) => item.category)));
      updatedContent.creations.categories = usedCategories.filter(Boolean);
    }
    
    // Met à jour l'interface immédiatement avec le contenu correct
    setContent(updatedContent);

    // Sauvegarde le contenu qui vient d'être calculé et mis à jour
    const result = await saveContent(updatedContent);

    if (result?.success) {
      // La revalidation de Next.js va rafraîchir les props,
      // et le useEffect ci-dessus mettra à jour l'état.
      setSaveStatus("saved");
    } else {
      setSaveStatus("unsaved");
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'La sauvegarde a échoué. Veuillez réessayer.',
      });
    }
  };


  const handleFieldChange = (section: string, field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };
  
   const handleContactFieldChange = (field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const handleContactDetailsChange = (field: 'phone' | 'address', value: string) => {
      setContent((prev: any) => ({
          ...prev,
          contact: {
              ...prev.contact,
              details: {
                  ...prev.contact.details,
                  [field]: value,
              },
          },
      }));
  };


  const handleListItemChange = (section: string, listName: string, index: number, field: string, value: string) => {
    setContent((prev: any) => {
        const newList = [...prev[section][listName]];
        newList[index] = { ...newList[index], [field]: value };
        return {
            ...prev,
            [section]: {
                ...prev[section],
                [listName]: newList,
            }
        }
    });
  };
  
  const handleCreationItemChange = (index: number, field: 'src' | 'title' | 'description' | 'category', value: string) => {
      setContent((prev: any) => {
        const newItems = [...prev.creations.items];
        newItems[index] = { ...newItems[index], [field]: value };

        const updatedContent = {
            ...prev,
            creations: {
                ...prev.creations,
                items: newItems,
            }
        };

        if (field === 'category' && value && !prev.creations.categories.includes(value)) {
            updatedContent.creations.categories.push(value);
        }

        return updatedContent;
    });
  };

  const handleAddCreationItem = () => {
    setContent((prev: any) => ({
      ...prev,
      creations: {
        ...prev.creations,
        items: [
          ...prev.creations.items,
          { src: 'https://placehold.co/600x800.png', title: 'Nouveau titre', description: 'Nouvelle description', category: 'Autre' }
        ],
      }
    }));
  };

  const handleRemoveCreationItem = (indexToRemove: number) => {
    setContent((prev: any) => ({
      ...prev,
      creations: {
        ...prev.creations,
        items: prev.creations.items.filter((_: any, index: number) => index !== indexToRemove),
      }
    }));
  };
  
  const handleCreationsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setContent((prev: any) => {
        const oldIndex = prev.creations.items.findIndex((item: any, index: number) => (item.src + index) === active.id);
        const newIndex = prev.creations.items.findIndex((item: any, index: number) => (item.src + index) === over.id);

        return {
            ...prev,
            creations: {
                ...prev.creations,
                items: arrayMove(prev.creations.items, oldIndex, newIndex),
            }
        };
      });
    }
  };


  const handleAddTestimonialItem = () => {
    setContent((prev: any) => ({
        ...prev,
        testimonials: {
            ...prev.testimonials,
            items: [
                ...prev.testimonials.items,
                { quote: '', author: '', company: '' }
            ],
        }
    }));
  };

  const handleRemoveTestimonialItem = (indexToRemove: number) => {
      setContent((prev: any) => ({
          ...prev,
          testimonials: {
              ...prev.testimonials,
              items: prev.testimonials.items.filter((_: any, index: number) => index !== indexToRemove),
          }
      }));
  };
  
  if (!content) return null;

  return (
    <>
      <div className="space-y-8 mb-24">
        <Card>
          <CardHeader>
            <CardTitle>Contenu du site</CardTitle>
            <CardDescription>Modifiez les différentes sections de votre page d'accueil.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full" defaultValue="hero">

              <AccordionItem value="hero">
                <AccordionTrigger className="text-xl font-headline">Accueil</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="hero-title">Titre principal</Label>
                    <Input id="hero-title" value={content.hero.title} onChange={(e) => handleFieldChange('hero', 'title', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="hero-subtitle">Sous-titre</Label>
                    <Textarea id="hero-subtitle" value={content.hero.subtitle} onChange={(e) => handleFieldChange('hero', 'subtitle', e.target.value)} />
                  </div>
                   <div>
                      <Label>Image de fond (format 16/9)</Label>
                      <ImageUploader 
                          currentImageUrl={content.hero.imageUrl}
                          onUploadComplete={(url) => handleFieldChange('hero', 'imageUrl', url)} 
                          aspectRatio={16 / 9}
                      />
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="features">
                <AccordionTrigger className="text-xl font-headline">Section "Engagements"</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="features-title">Titre de la section</Label>
                    <Input id="features-title" value={content.features.title} onChange={(e) => handleFieldChange('features', 'title', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="features-subtitle">Sous-titre de la section</Label>
                    <Textarea id="features-subtitle" value={content.features.subtitle} onChange={(e) => handleFieldChange('features', 'subtitle', e.target.value)} />
                  </div>
                  <div className="space-y-4">
                      <Label>Cartes d'engagement</Label>
                      {content.features.items.map((item: any, index: number) => (
                          <Card key={index} className="p-4 bg-muted/50">
                              <h4 className="font-semibold mb-2">Carte {index + 1}</h4>
                              <div className="space-y-2">
                                  <Label htmlFor={`feature-title-${index}`}>Titre de la carte</Label>
                                  <Input id={`feature-title-${index}`} value={item.title} onChange={(e) => handleListItemChange('features', 'items', index, 'title', e.target.value)} />
                                  <Label htmlFor={`feature-desc-${index}`}>Description</Label>
                                  <Textarea id={`feature-desc-${index}`} value={item.description} onChange={(e) => handleListItemChange('features', 'items', index, 'description', e.target.value)} />
                              </div>
                          </Card>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="about">
                <AccordionTrigger className="text-xl font-headline">Section "À Propos"</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                      <Label htmlFor="about-title">Titre</Label>
                      <Input id="about-title" value={content.about.title} onChange={(e) => handleFieldChange('about', 'title', e.target.value)} />
                  </div>
                  <div>
                      <Label htmlFor="about-p1">Paragraphe 1</Label>
                      <Textarea id="about-p1" value={content.about.paragraph1} onChange={(e) => handleFieldChange('about', 'paragraph1', e.target.value)} />
                  </div>
                  <div>
                      <Label htmlFor="about-p2">Paragraphe 2</Label>
                      <Textarea id="about-p2" value={content.about.paragraph2} onChange={(e) => handleFieldChange('about', 'paragraph2', e.target.value)} />
                  </div>
                  <div>
                      <Label htmlFor="about-p3">Paragraphe 3</Label>
                      <Textarea id="about-p3" value={content.about.paragraph3} onChange={(e) => handleFieldChange('about', 'paragraph3', e.target.value)} />
                  </div>
                  <div>
                      <Label>Image de la section (format 4/5)</Label>
                       <ImageUploader 
                          currentImageUrl={content.about.imageUrl}
                          onUploadComplete={(url) => handleFieldChange('about', 'imageUrl', url)} 
                          aspectRatio={4 / 5}
                       />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="creations">
                  <AccordionTrigger className="text-xl font-headline">Section "Créations"</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                       <div>
                          <Label htmlFor="creations-title">Titre de la section</Label>
                          <Input id="creations-title" value={content.creations.title} onChange={(e) => handleFieldChange('creations', 'title', e.target.value)} />
                      </div>
                      <div>
                          <Label htmlFor="creations-subtitle">Sous-titre de la section</Label>
                          <Textarea id="creations-subtitle" value={content.creations.subtitle} onChange={(e) => handleFieldChange('creations', 'subtitle', e.target.value)} />
                      </div>
                      <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleCreationsDragEnd}
                      >
                          <SortableContext
                              items={content.creations.items.map((item: any, index: number) => item.src + index)}
                              strategy={verticalListSortingStrategy}
                          >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {content.creations.items.map((item: any, index: number) => (
                                      <SortableCreationItem
                                          key={item.src + index}
                                          item={item}
                                          index={index}
                                          handleCreationItemChange={handleCreationItemChange}
                                          handleRemoveCreationItem={handleRemoveCreationItem}
                                          categories={content.creations.categories || []}
                                      />
                                  ))}
                              </div>
                          </SortableContext>
                      </DndContext>
                      <div className="flex justify-center mt-6">
                          <Button variant="outline" onClick={handleAddCreationItem}>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Ajouter une création
                          </Button>
                      </div>
                  </AccordionContent>
              </AccordionItem>

              <AccordionItem value="testimonials">
                  <AccordionTrigger className="text-xl font-headline">Section "Témoignages"</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                       <div>
                          <Label htmlFor="testimonials-title">Titre de la section</Label>
                          <Input id="testimonials-title" value={content.testimonials.title} onChange={(e) => handleFieldChange('testimonials', 'title', e.target.value)} />
                      </div>
                       <div className="space-y-4">
                          <Label>Témoignages</Label>
                          {content.testimonials.items.map((item: any, index: number) => (
                              <Card key={`testimonial-${index}`} className="p-4 bg-muted/50 relative">
                                  <Button
                                      variant="destructive"
                                      size="icon"
                                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full z-10"
                                      onClick={() => handleRemoveTestimonialItem(index)}
                                      aria-label="Supprimer le témoignage"
                                  >
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <h4 className="font-semibold mb-2">Témoignage {index + 1}</h4>
                                  <div className="space-y-2">
                                      <Label htmlFor={`testimonial-quote-${index}`}>Citation</Label>
                                      <Textarea id={`testimonial-quote-${index}`} value={item.quote} onChange={(e) => handleListItemChange('testimonials', 'items', index, 'quote', e.target.value)} />
                                      <Label htmlFor={`testimonial-author-${index}`}>Auteur</Label>
                                      <Input id={`testimonial-author-${index}`} value={item.author} onChange={(e) => handleListItemChange('testimonials', 'items', index, 'author', e.target.value)} />
                                      <Label htmlFor={`testimonial-company-${index}`}>Entreprise/Lieu</Label>
                                      <Input id={`testimonial-company-${index}`} value={item.company} onChange={(e) => handleListItemChange('testimonials', 'items', index, 'company', e.target.value)} />
                                  </div>
                              </Card>
                          ))}
                      </div>
                      <div className="flex justify-center mt-6">
                          <Button variant="outline" onClick={handleAddTestimonialItem}>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Ajouter un témoignage
                          </Button>
                      </div>
                  </AccordionContent>
              </AccordionItem>
              
               <AccordionItem value="contact">
                  <AccordionTrigger className="text-xl font-headline">Section "Contact"</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                       <div>
                          <Label htmlFor="contact-title">Titre de la section</Label>
                          <Input id="contact-title" value={content.contact.title} onChange={(e) => handleContactFieldChange('title', e.target.value)} />
                      </div>
                       <div>
                          <Label htmlFor="contact-subtitle">Sous-titre de la section</Label>
                          <Textarea id="contact-subtitle" value={content.contact.subtitle} onChange={(e) => handleContactFieldChange('subtitle', e.target.value)} />
                      </div>
                      <div>
                          <Label htmlFor="contact-details-title">Titre "Coordonnées"</Label>
                          <Input id="contact-details-title" value={content.contact.detailsTitle} onChange={(e) => handleContactFieldChange('detailsTitle', e.target.value)} />
                      </div>
                      <div>
                          <Label htmlFor="contact-phone">Téléphone</Label>
                          <Input id="contact-phone" value={content.contact.details.phone} onChange={(e) => handleContactDetailsChange('phone', e.target.value)} />
                      </div>
                      <div>
                          <Label htmlFor="contact-address">Adresse</Label>
                          <Input id="contact-address" value={content.contact.details.address} onChange={(e) => handleContactDetailsChange('address', e.target.value)} />
                      </div>
                       <div>
                          <Label htmlFor="contact-form-title">Titre "Formulaire"</Label>
                          <Input id="contact-form-title" value={content.contact.formTitle} onChange={(e) => handleContactFieldChange('formTitle', e.target.value)} />
                      </div>
                  </AccordionContent>
              </AccordionItem>
              
               <AccordionItem value="general">
                <AccordionTrigger className="text-xl font-headline">Réglages généraux</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                    <Label>Logo du site (format libre)</Label>
                    <ImageUploader 
                      currentImageUrl={content.general.logoUrl}
                      onUploadComplete={(url) => handleFieldChange('general', 'logoUrl', url)} 
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleSave}
          disabled={saveStatus === 'saved'}
          size="lg"
          className="shadow-2xl rounded-full pl-6 pr-6 h-14"
        >
          {saveStatus === 'saving' && <><LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Sauvegarde...</>}
          {saveStatus === 'saved' && <><CheckCircle className="mr-2 h-5 w-5" /> Enregistré</>}
          {saveStatus === 'unsaved' && <><Save className="mr-2 h-5 w-5" /> Sauvegarder les changements</>}
        </Button>
      </div>
    </>
  );
}

    
    
