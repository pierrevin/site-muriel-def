
'use client';

import { useState, useRef, ChangeEvent, useId, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/firebaseClient';
import { useAuth } from '@/context/auth-context';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, UploadCloud, Scissors } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';

const MAX_IMAGE_DIMENSION = 2048;

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  folder?: string;
  currentImageUrl?: string;
  aspectRatio?: number; // e.g., 16 / 9 or 1
}

// Helper to get cropped and compressed image data
async function processImage(image: HTMLImageElement, crop?: Crop): Promise<Blob> {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const cropX = crop ? crop.x * scaleX : 0;
    const cropY = crop ? crop.y * scaleY : 0;
    const cropWidth = crop ? crop.width * scaleX : image.naturalWidth;
    const cropHeight = crop ? crop.height * scaleY : image.naturalHeight;

    let targetWidth = cropWidth;
    let targetHeight = cropHeight;

    // Resize logic: if the final cropped image is larger than MAX_IMAGE_DIMENSION, scale it down.
    if (targetWidth > MAX_IMAGE_DIMENSION || targetHeight > MAX_IMAGE_DIMENSION) {
        if (targetWidth > targetHeight) {
            targetHeight = (targetHeight / targetWidth) * MAX_IMAGE_DIMENSION;
            targetWidth = MAX_IMAGE_DIMENSION;
        } else {
            targetWidth = (targetWidth / targetHeight) * MAX_IMAGE_DIMENSION;
            targetHeight = MAX_IMAGE_DIMENSION;
        }
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return Promise.reject(new Error('Failed to get canvas context'));
    }

    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        targetWidth,
        targetHeight
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            },
            "image/webp", // Convert to modern, efficient format
            0.85 // Compress with 85% quality
        );
    });
}


export function ImageUploader({ onUploadComplete, folder = 'uploads', currentImageUrl, aspectRatio }: ImageUploaderProps) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const uniqueId = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Cropping state
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [imgSrc, setImgSrc] = useState('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);


  useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
        setError("Vous devez être connecté pour uploader une image.");
        return;
    }

    setOriginalFile(file);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        const resultSrc = reader.result?.toString() || '';
        setImgSrc(resultSrc);
        if (aspectRatio) {
            setIsCropModalOpen(true);
        } else {
            // If no aspect ratio, we still need an Image element to process
            const img = document.createElement('img');
            img.onload = async () => {
                const compressedBlob = await processImage(img);
                const newFileName = `${file.name.split('.').slice(0, -1).join('.')}.webp`;
                handleUpload(compressedBlob, newFileName);
            };
            img.src = resultSrc;
        }
    });
    reader.readAsDataURL(file);
    
     // Reset the input value to allow re-uploading the same file
    event.target.value = '';
  };
  
  const handleUpload = (fileToUpload: File | Blob, fileName?: string) => {
    if (!user) {
        setError("Authentification requise pour l'upload. Veuillez vous reconnecter.");
        return;
    }

    setProgress(0);
    setError(null);
    setUploadSuccess(false);
    setIsUploading(true);
    
    const finalFileName = fileName || (fileToUpload instanceof File ? fileToUpload.name : 'compressed-image.webp');
    // Path includes the user's UID to match storage rules
    const storageRef = ref(storage, `${folder}/${user.uid}/${Date.now()}-${finalFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on('state_changed',
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(pct);
      },
      (err: any) => {
        console.error("FIREBASE UPLOAD ERROR:", err);
        let friendlyError = "Échec de l'upload.";
        switch (err.code) {
          case 'storage/unauthorized':
            friendlyError = "Erreur de permission: Vérifiez les règles de sécurité de votre Storage Firebase.";
            break;
          case 'storage/canceled':
            friendlyError = "L'upload a été annulé.";
            break;
          case 'storage/object-not-found':
             friendlyError = "Fichier ou dossier de destination introuvable sur Firebase Storage.";
             break;
          case 'storage/unknown':
            friendlyError = "Une erreur inconnue s'est produite. Vérifiez votre connexion et la console.";
            break;
          default:
            friendlyError = `Une erreur inattendue est survenue : ${err.code || 'inconnue'}`;
            break;
        }
        setError(friendlyError);
        setIsUploading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete(url);
          setUploadSuccess(true);
          setPreview(url);
        } catch (downloadError: any) {
            console.error("Firebase get download URL failed:", downloadError);
            setError("Échec de la récupération de l'URL de l'image.");
        } finally {
            setIsUploading(false);
        }
      }
    );
  };
  
   function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspectRatio) {
      const { width, height } = e.currentTarget;
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspectRatio,
          width,
          height
        ),
        width,
        height
      );
      setCrop(crop);
    }
  }
  
  const handleCropConfirm = async () => {
      if (imgRef.current && originalFile) {
          const croppedBlob = await processImage(imgRef.current, completedCrop);
          setIsCropModalOpen(false);

          const originalFileName = originalFile.name || 'image.jpg';
          const newFileName = `${originalFileName.split('.').slice(0, -1).join('.')}.webp`;
          
          handleUpload(croppedBlob, newFileName);
      }
  }


  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card/50">
        <label htmlFor={uniqueId} className="group cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors">
            {preview && !isUploading && !error ? (
                 <div className="relative w-full h-full">
                    <Image src={preview} alt="Aperçu de l'image" fill className="object-contain p-2 rounded-lg" />
                 </div>
            ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    {aspectRatio ? <Scissors className="w-8 h-8 mb-4 text-muted-foreground group-hover:text-primary transition-colors" /> : <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                    <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">Cliquez pour choisir</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-muted-foreground">{aspectRatio ? "Le recadrage et la compression seront proposés" : "La compression sera automatique (PNG, JPG, WEBP)"}</p>
                </div>
            )}
            <Input
                id={uniqueId}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
            />
        </label>

        {isUploading && (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Chargement...</p>
                <Progress value={progress} className="w-full" />
            </div>
        )}

        {error && (
            <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur d'upload</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {uploadSuccess && (
            <Alert className="border-green-500 text-green-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Upload terminé !</AlertTitle>
                <AlertDescription>N'oubliez pas de sauvegarder la page.</AlertDescription>
            </Alert>
        )}

        <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Recadrer l'image</DialogTitle>
                </DialogHeader>
                <div className="my-4">
                {imgSrc && (
                    <ReactCrop
                        crop={crop}
                        onChange={c => setCrop(c)}
                        onComplete={c => setCompletedCrop(c)}
                        aspect={aspectRatio}
                        className="max-h-[70vh]"
                    >
                        <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} />
                    </ReactCrop>
                )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>Annuler</Button>
                    <Button onClick={handleCropConfirm} disabled={!completedCrop || isUploading}>
                        {isUploading ? 'Chargement...' : 'Confirmer et Uploader'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
