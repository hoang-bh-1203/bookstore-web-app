import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import useUpload from '@/hooks/useUpload';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  multiple?: boolean;
  maxCount?: number;
  // listType "text" and "picture" are omitted for simplicity in this refactor, default to card style
  value?: string[];
  onChange?: (urls: string[]) => void;
  toggleUploading?: (value: boolean) => void;
}

const ImageUploader: React.FC<ImageUploadProps> = ({
  multiple = false,
  maxCount = 1,
  value = [],
  onChange,
  toggleUploading,
}) => {
  // Normalize value to array
  const initialFiles = Array.isArray(value) ? value : value ? [value] : [];
  const [fileUrls, setFileUrls] = useState<string[]>(initialFiles);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, deleteImage } = useUpload();

  // Sync internal state with external value prop
  useEffect(() => {
    const newFiles = Array.isArray(value) ? value : value ? [value] : [];
    // Simple array comparison to avoid infinite loops
    if (JSON.stringify(newFiles) !== JSON.stringify(fileUrls)) {
      setFileUrls(newFiles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const triggerUpload = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate max count
    if (fileUrls.length + files.length > maxCount) {
      toast.error(`Chỉ được upload tối đa ${maxCount} ảnh`);
      return;
    }

    // Validate file types
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.startsWith('image/')) {
        toast.error(`${files[i].name} không phải là file ảnh hợp lệ`);
        return;
      }
    }

    try {
      setIsUploading(true);
      toggleUploading?.(true);

      const uploadPromises = Array.from(files).map((file) =>
        uploadImage(file as File),
      );
      // Note: your useUpload hook might return different structures.
      // Assuming it returns an object with { url: string, id: string } based on original code usage.
      // Adjust this part based on your actual hook return type.
      const results = await Promise.all(uploadPromises);

      const newUrls = results.map((res: any) => res.url || res);
      const updatedUrls = [...fileUrls, ...newUrls].slice(0, maxCount);

      setFileUrls(updatedUrls);
      onChange?.(updatedUrls);
      toast.success('Upload thành công');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload thất bại');
    } finally {
      setIsUploading(false);
      toggleUploading?.(false);
      if (inputRef.current) {
        inputRef.current.value = ''; // Reset input
      }
    }
  };

  const handleRemove = async (urlToRemove: string, index: number) => {
    try {
      // Optional: Call delete API if you have the ID.
      // Since we only have URL here in simplified state, you might need to adjust
      // if you strictly need to delete from server immediately.
      // For now, we just remove from UI state as typically forms handle final submission.

      // If you absolutely need to call deleteImage(id), you need to store objects {id, url} instead of just strings.
      // Assuming standard behavior where removing from list is enough for the UI:

      const newUrls = fileUrls.filter((_, i) => i !== index);
      setFileUrls(newUrls);
      onChange?.(newUrls);
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Xoá ảnh thất bại');
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {fileUrls.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className="relative group w-[104px] h-[104px] rounded-md border overflow-hidden flex items-center justify-center bg-muted/20"
        >
          <img
            src={url}
            alt="uploaded"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-200"
              title="Xem ảnh"
            >
              <ImageIcon className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => handleRemove(url, index)}
              className="text-white hover:text-red-400"
              title="Xoá ảnh"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {fileUrls.length < maxCount && (
        <div
          onClick={triggerUpload}
          className={cn(
            'w-[104px] h-[104px] rounded-md border border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/10',
            isUploading && 'opacity-50 cursor-not-allowed',
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Plus className="h-5 w-5 text-muted-foreground" />
              <span className="mt-2 text-xs text-muted-foreground">Upload</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
