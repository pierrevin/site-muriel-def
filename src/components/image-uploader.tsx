
'use client';

import { useState, useRef, ChangeEvent, useId, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '@/firebase/firebaseClient';
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

// Helper to get cropped image data
async function getCroppedImg(image: HTMLImageElement, crop: Crop): Promise<Blob> {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    let targetWidth = crop.width * scaleX;
    let targetHeight = crop.height * scaleY;

    // Resize logic
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
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
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
            "image/webp",
            0.85
        );
    });
}


export function ImageUploader({ onUploadComplete, folder = 'uploads', currentImageUrl, aspectRatio }: ImageUploaderProps) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const uniqueId = useId();
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  
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

    if (aspectRatio) {
        setOriginalFile(file);
        const reader = new FileReader();
        reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
        reader.readAsDataURL(file);
        setIsCropModalOpen(true);
    } else {
        handleUpload(file);
    }
     // Reset the input value to allow re-uploading the same file
    event.target.value = '';
  };
  
  const handleUpload = (fileToUpload: File | Blob, fileName?: string) => {
    setProgress(0);
    setError(null);
    setUploadSuccess(false);
    setIsUploading(true);

    const user = auth.currentUser;

    if (!user) {
      const authError = "Erreur: Utilisateur non connecté. Veuillez rafraîchir la page et vous reconnecter.";
      setError(authError);
      setIsUploading(false);
      return;
    }

    const finalFileName = fileName || (fileToUpload instanceof File ? fileToUpload.name : 'cropped-image.webp');
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
            friendlyError = "Erreur de permission: L'utilisateur n'est pas autorisé. Vérifiez les règles de sécurité de votre Storage Firebase et assurez-vous d'être bien connecté.";
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
      if (completedCrop?.width && completedCrop?.height && imgRef.current && originalFile) {
          const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
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
                    <p className="text-xs text-muted-foreground">{aspectRatio ? "Le recadrage sera proposé" : "PNG, JPG, WEBP (max 5Mo)"}</p>
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
