import { useCallback, useRef, useState } from 'react';
import { Editor } from '@tiptap/react';

export interface ImageUploadState {
  /** Whether an image is currently being uploaded */
  isUploading: boolean;
  /** Error message from the last failed upload, if any */
  error: string | null;
}

export interface UseImageUploadOptions {
  /** The Tiptap editor instance */
  editor: Editor | null;
  /** Callback to handle the actual file upload. Must return the image URL. */
  onImageUpload?: (file: File) => Promise<string>;
}

export interface UseImageUploadReturn {
  /** Current upload state */
  uploadState: ImageUploadState;
  /** Ref to attach to a hidden file input element */
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  /** Handler for file input change events */
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Trigger the file picker dialog */
  openFilePicker: () => void;
  /** Clear any existing error */
  clearError: () => void;
}

/**
 * Hook that encapsulates image upload logic for the editor toolbar.
 * Manages loading/error states and file input interactions.
 */
export function useImageUpload({
  editor,
  onImageUpload,
}: UseImageUploadOptions): UseImageUploadReturn {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<ImageUploadState>({
    isUploading: false,
    error: null,
  });

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !onImageUpload || !editor) return;

      setUploadState({ isUploading: true, error: null });

      try {
        const url = await onImageUpload(file);
        if (url) {
          editor.chain().focus().setImageResize({ src: url }).run();
        }
        setUploadState({ isUploading: false, error: null });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Image upload failed';
        setUploadState({ isUploading: false, error: message });
        console.error('Image upload failed:', err);
      }

      // Reset the input so the same file can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [editor, onImageUpload]
  );

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearError = useCallback(() => {
    setUploadState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    uploadState,
    fileInputRef,
    handleFileChange,
    openFilePicker,
    clearError,
  };
}
