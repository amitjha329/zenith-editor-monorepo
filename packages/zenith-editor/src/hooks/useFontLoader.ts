import { useState, useEffect, useCallback } from 'react';
import {
  FontLoader,
  CustomFontDefinition,
  FontLoadOptions,
  FontLoadResult,
  FontLoadStatus,
  loadCustomFont,
  loadCustomFonts,
  isCustomFontSupported
} from '../utils/fontLoader';

/**
 * Hook for managing custom fonts in the Zenith Editor
 */
export interface UseFontLoaderOptions {
  /** Auto-load fonts on mount */
  autoLoad?: boolean;
  /** Default timeout for font loading */
  timeout?: number;
  /** Test string for font loading detection */
  testString?: string;
}

/**
 * Font loading state
 */
export interface FontLoadingState {
  /** Currently loading fonts */
  loading: string[];
  /** Successfully loaded fonts */
  loaded: string[];
  /** Failed fonts with error messages */
  failed: Array<{ fontFamily: string; error: string }>;
  /** Overall loading status */
  isLoading: boolean;
}

/**
 * Hook return type
 */
export interface UseFontLoaderReturn {
  /** Current font loading state */
  state: FontLoadingState;
  /** Load a single font */
  loadFont: (fontDefinition: CustomFontDefinition, options?: FontLoadOptions) => Promise<FontLoadResult>;
  /** Load multiple fonts */
  loadFonts: (fontDefinitions: CustomFontDefinition[], options?: FontLoadOptions) => Promise<FontLoadResult[]>;
  /** Check if a font is loaded */
  isFontLoaded: (fontFamily: string) => boolean;
  /** Get all loaded fonts */
  getLoadedFonts: () => string[];
  /** Remove a loaded font */
  removeFont: (fontFamily: string) => boolean;
  /** Clear all loaded fonts */
  clearAllFonts: () => void;
  /** Check if custom fonts are supported */
  isSupported: boolean;
  /** Generate CSS font-face rule */
  createCSSFontFace: (fontDefinition: CustomFontDefinition) => string;
}

/**
 * React hook for loading and managing custom fonts
 */
export function useFontLoader(
  initialFonts: CustomFontDefinition[] = [],
  options: UseFontLoaderOptions = {}
): UseFontLoaderReturn {
  const { autoLoad = true, timeout = 5000, testString = 'BESbswy' } = options;

  const [state, setState] = useState<FontLoadingState>({
    loading: [],
    loaded: [],
    failed: [],
    isLoading: false
  });

  const fontLoader = FontLoader.getInstance();

  // Update state helper
  const updateState = useCallback((updater: (prev: FontLoadingState) => FontLoadingState) => {
    setState(prev => updater(prev));
  }, []);

  // Add font to loading state
  const addToLoading = useCallback((fontFamily: string) => {
    updateState(prev => ({
      ...prev,
      loading: [...prev.loading.filter(f => f !== fontFamily), fontFamily],
      isLoading: true
    }));
  }, [updateState]);

  // Remove font from loading state
  const removeFromLoading = useCallback((fontFamily: string) => {
    updateState(prev => {
      const newLoading = prev.loading.filter(f => f !== fontFamily);
      return {
        ...prev,
        loading: newLoading,
        isLoading: newLoading.length > 0
      };
    });
  }, [updateState]);

  // Add font to loaded state
  const addToLoaded = useCallback((fontFamily: string) => {
    updateState(prev => ({
      ...prev,
      loaded: [...prev.loaded.filter(f => f !== fontFamily), fontFamily],
      failed: prev.failed.filter(f => f.fontFamily !== fontFamily)
    }));
  }, [updateState]);

  // Add font to failed state
  const addToFailed = useCallback((fontFamily: string, error: string) => {
    updateState(prev => ({
      ...prev,
      failed: [
        ...prev.failed.filter(f => f.fontFamily !== fontFamily),
        { fontFamily, error }
      ],
      loaded: prev.loaded.filter(f => f !== fontFamily)
    }));
  }, [updateState]);

  // Load a single font
  const loadFont = useCallback(async (
    fontDefinition: CustomFontDefinition,
    loadOptions?: FontLoadOptions
  ): Promise<FontLoadResult> => {
    const { fontFamily } = fontDefinition;
    
    addToLoading(fontFamily);

    try {
      const result = await loadCustomFont(fontDefinition, {
        timeout,
        testString,
        ...loadOptions
      });

      removeFromLoading(fontFamily);

      if (result.status === 'loaded') {
        addToLoaded(fontFamily);
      } else {
        addToFailed(fontFamily, result.error || `Failed to load font: ${result.status}`);
      }

      return result;
    } catch (error) {
      removeFromLoading(fontFamily);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addToFailed(fontFamily, errorMessage);
      
      return {
        fontFamily,
        status: 'error' as FontLoadStatus,
        error: errorMessage
      };
    }
  }, [timeout, testString, addToLoading, removeFromLoading, addToLoaded, addToFailed]);

  // Load multiple fonts
  const loadFontsCallback = useCallback(async (
    fontDefinitions: CustomFontDefinition[],
    loadOptions?: FontLoadOptions
  ): Promise<FontLoadResult[]> => {
    // Add all fonts to loading state
    fontDefinitions.forEach(font => addToLoading(font.fontFamily));

    try {
      const results = await loadCustomFonts(fontDefinitions, {
        timeout,
        testString,
        ...loadOptions
      });

      // Update state based on results
      results.forEach(result => {
        removeFromLoading(result.fontFamily);
        
        if (result.status === 'loaded') {
          addToLoaded(result.fontFamily);
        } else {
          addToFailed(result.fontFamily, result.error || `Failed to load font: ${result.status}`);
        }
      });

      return results;
    } catch (error) {
      // Handle any global error
      fontDefinitions.forEach(font => {
        removeFromLoading(font.fontFamily);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        addToFailed(font.fontFamily, errorMessage);
      });

      throw error;
    }
  }, [timeout, testString, addToLoading, removeFromLoading, addToLoaded, addToFailed]);

  // Check if font is loaded
  const isFontLoaded = useCallback((fontFamily: string): boolean => {
    return fontLoader.isFontLoaded(fontFamily);
  }, [fontLoader]);

  // Get all loaded fonts
  const getLoadedFonts = useCallback((): string[] => {
    return fontLoader.getLoadedFonts();
  }, [fontLoader]);

  // Remove a font
  const removeFont = useCallback((fontFamily: string): boolean => {
    const success = fontLoader.removeFont(fontFamily);
    if (success) {
      updateState(prev => ({
        ...prev,
        loaded: prev.loaded.filter(f => f !== fontFamily),
        failed: prev.failed.filter(f => f.fontFamily !== fontFamily)
      }));
    }
    return success;
  }, [fontLoader, updateState]);

  // Clear all fonts
  const clearAllFonts = useCallback(() => {
    fontLoader.clearAllFonts();
    setState({
      loading: [],
      loaded: [],
      failed: [],
      isLoading: false
    });
  }, [fontLoader]);

  // Create CSS font-face rule
  const createCSSFontFace = useCallback((fontDefinition: CustomFontDefinition): string => {
    return FontLoader.createCSSFontFace(fontDefinition);
  }, []);

  // Auto-load initial fonts
  useEffect(() => {
    if (autoLoad && initialFonts.length > 0 && isCustomFontSupported()) {
      loadFontsCallback(initialFonts).catch(error => {
        console.warn('Failed to auto-load initial fonts:', error);
      });
    }
  }, [autoLoad, initialFonts, loadFontsCallback]);

  return {
    state,
    loadFont,
    loadFonts: loadFontsCallback,
    isFontLoaded,
    getLoadedFonts,
    removeFont,
    clearAllFonts,
    isSupported: isCustomFontSupported(),
    createCSSFontFace
  };
}

/**
 * Hook for applying custom fonts to editor content
 */
export interface UseEditorFontsOptions extends UseFontLoaderOptions {
  /** Apply fonts to content automatically when loaded */
  autoApply?: boolean;
  /** CSS selector for content (default: '.zenith-editor-content') */
  contentSelector?: string;
}

/**
 * Extended hook return type for editor integration
 */
export interface UseEditorFontsReturn extends UseFontLoaderReturn {
  /** Apply a font to the editor content */
  applyFontToContent: (fontFamily: string, additionalStyles?: React.CSSProperties) => void;
  /** Remove font styling from content */
  removeFontFromContent: () => void;
  /** Get current content font styling */
  getCurrentContentFont: () => string | null;
}

/**
 * Hook specifically designed for Zenith Editor font integration
 */
export function useEditorFonts(
  initialFonts: CustomFontDefinition[] = [],
  options: UseEditorFontsOptions = {}
): UseEditorFontsReturn {
  const {
    autoApply = true,
    contentSelector = '.zenith-editor-content-wrapper',
    ...fontLoaderOptions
  } = options;

  const fontLoader = useFontLoader(initialFonts, fontLoaderOptions);
  const [currentFont, setCurrentFont] = useState<string | null>(null);

  // Apply font to content
  const applyFontToContent = useCallback((
    fontFamily: string,
    additionalStyles: React.CSSProperties = {}
  ) => {
    const contentElements = document.querySelectorAll(contentSelector);
    
    contentElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.fontFamily = fontFamily;
      
      // Apply additional styles
      Object.assign(htmlElement.style, additionalStyles);
    });

    setCurrentFont(fontFamily);
  }, [contentSelector]);

  // Remove font styling from content
  const removeFontFromContent = useCallback(() => {
    const contentElements = document.querySelectorAll(contentSelector);
    
    contentElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.fontFamily = '';
    });

    setCurrentFont(null);
  }, [contentSelector]);

  // Get current content font
  const getCurrentContentFont = useCallback((): string | null => {
    return currentFont;
  }, [currentFont]);

  // Auto-apply fonts when they're loaded
  useEffect(() => {
    if (autoApply && fontLoader.state.loaded.length > 0) {
      const lastLoadedFont = fontLoader.state.loaded[fontLoader.state.loaded.length - 1];
      if (lastLoadedFont && lastLoadedFont !== currentFont) {
        applyFontToContent(lastLoadedFont);
      }
    }
  }, [autoApply, fontLoader.state.loaded, currentFont, applyFontToContent]);

  return {
    ...fontLoader,
    applyFontToContent,
    removeFontFromContent,
    getCurrentContentFont
  };
}