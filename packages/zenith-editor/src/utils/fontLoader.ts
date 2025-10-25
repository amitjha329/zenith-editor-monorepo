/**
 * Font Loader Utility for Zenith Editor
 * Provides functionality to load custom fonts using the FontFace Web API
 */

export interface CustomFontDefinition {
  /** The font-family name that will be used in CSS */
  fontFamily: string;
  /** URL to the font file (TTF, WOFF, WOFF2, etc.) */
  src: string;
  /** Font format (optional, will be auto-detected from file extension) */
  format?: 'truetype' | 'woff' | 'woff2' | 'opentype' | 'embedded-opentype';
  /** Font weight (default: 'normal') */
  fontWeight?: string | number;
  /** Font style (default: 'normal') */
  fontStyle?: 'normal' | 'italic' | 'oblique';
  /** Font stretch (default: 'normal') */
  fontStretch?: string;
  /** Unicode range for subsetting (optional) */
  unicodeRange?: string;
  /** Font display behavior (default: 'swap') */
  fontDisplay?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}

export interface FontLoadOptions {
  /** Test string to use for font loading detection (default: 'BESbswy') */
  testString?: string;
  /** Timeout in milliseconds (default: 5000) */
  timeout?: number;
}

/**
 * Font loading status
 */
export type FontLoadStatus = 'loading' | 'loaded' | 'error' | 'timeout';

/**
 * Font loading result
 */
export interface FontLoadResult {
  fontFamily: string;
  status: FontLoadStatus;
  error?: string;
}

/**
 * Utility class for loading custom fonts using the FontFace Web API
 */
export class FontLoader {
  private static instance: FontLoader;
  private loadedFonts: Map<string, FontFace> = new Map();
  private loadingPromises: Map<string, Promise<FontLoadResult>> = new Map();

  private constructor() {}

  /**
   * Get the singleton instance of FontLoader
   */
  static getInstance(): FontLoader {
    if (!FontLoader.instance) {
      FontLoader.instance = new FontLoader();
    }
    return FontLoader.instance;
  }

  /**
   * Check if FontFace API is supported
   */
  static isSupported(): boolean {
    return typeof FontFace !== 'undefined' && 'fonts' in document;
  }

  /**
   * Auto-detect font format from file extension
   */
  private detectFontFormat(src: string): string {
    const extension = src.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'woff2':
        return 'woff2';
      case 'woff':
        return 'woff';
      case 'ttf':
        return 'truetype';
      case 'otf':
        return 'opentype';
      case 'eot':
        return 'embedded-opentype';
      default:
        return 'truetype'; // Default fallback
    }
  }

  /**
   * Create a FontFace source string with format
   */
  private createFontSource(src: string, format?: string): string {
    const detectedFormat = format || this.detectFontFormat(src);
    return `url("${src}") format("${detectedFormat}")`;
  }

  /**
   * Load a single custom font
   */
  async loadFont(
    fontDefinition: CustomFontDefinition,
    options: FontLoadOptions = {}
  ): Promise<FontLoadResult> {
    const {
      fontFamily,
      src,
      format,
      fontWeight = 'normal',
      fontStyle = 'normal',
      fontStretch = 'normal',
      unicodeRange,
      fontDisplay = 'swap'
    } = fontDefinition;

    const { testString = 'BESbswy', timeout = 5000 } = options;

    // Check if font is already loaded
    if (this.loadedFonts.has(fontFamily)) {
      return {
        fontFamily,
        status: 'loaded'
      };
    }

    // Check if font is currently being loaded
    if (this.loadingPromises.has(fontFamily)) {
      return this.loadingPromises.get(fontFamily)!;
    }

    // Check if FontFace API is supported
    if (!FontLoader.isSupported()) {
      const error = 'FontFace API is not supported in this browser';
      console.warn(`FontLoader: ${error}`);
      return {
        fontFamily,
        status: 'error',
        error
      };
    }

    // Create loading promise
    const loadingPromise = this.performFontLoad(
      fontDefinition,
      testString,
      timeout
    );

    this.loadingPromises.set(fontFamily, loadingPromise);

    try {
      const result = await loadingPromise;
      
      if (result.status === 'loaded') {
        // Store the loaded font for future reference
        const fontFace = new FontFace(
          fontFamily,
          this.createFontSource(src, format),
          {
            weight: fontWeight.toString(),
            style: fontStyle,
            stretch: fontStretch,
            unicodeRange,
            display: fontDisplay
          }
        );
        
        this.loadedFonts.set(fontFamily, fontFace);
      }

      return result;
    } finally {
      // Clean up loading promise
      this.loadingPromises.delete(fontFamily);
    }
  }

  /**
   * Perform the actual font loading
   */
  private async performFontLoad(
    fontDefinition: CustomFontDefinition,
    testString: string,
    timeout: number
  ): Promise<FontLoadResult> {
    const {
      fontFamily,
      src,
      format,
      fontWeight = 'normal',
      fontStyle = 'normal',
      fontStretch = 'normal',
      unicodeRange,
      fontDisplay = 'swap'
    } = fontDefinition;

    try {
      // Create FontFace instance
      const fontFace = new FontFace(
        fontFamily,
        this.createFontSource(src, format),
        {
          weight: fontWeight.toString(),
          style: fontStyle,
          stretch: fontStretch,
          unicodeRange,
          display: fontDisplay
        }
      );

      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Font loading timeout after ${timeout}ms`));
        }, timeout);
      });

      // Load the font with timeout
      const loadedFont = await Promise.race([
        fontFace.load(),
        timeoutPromise
      ]);

      // Add font to document's font set
      document.fonts.add(loadedFont);

      // Wait for font to be ready
      await document.fonts.ready;

      console.log(`FontLoader: Successfully loaded font "${fontFamily}"`);

      return {
        fontFamily,
        status: 'loaded'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`FontLoader: Failed to load font "${fontFamily}":`, errorMessage);

      return {
        fontFamily,
        status: errorMessage.includes('timeout') ? 'timeout' : 'error',
        error: errorMessage
      };
    }
  }

  /**
   * Load multiple fonts concurrently
   */
  async loadFonts(
    fontDefinitions: CustomFontDefinition[],
    options: FontLoadOptions = {}
  ): Promise<FontLoadResult[]> {
    const loadPromises = fontDefinitions.map(font => 
      this.loadFont(font, options)
    );

    return Promise.all(loadPromises);
  }

  /**
   * Check if a font is loaded
   */
  isFontLoaded(fontFamily: string): boolean {
    return this.loadedFonts.has(fontFamily);
  }

  /**
   * Get all loaded fonts
   */
  getLoadedFonts(): string[] {
    return Array.from(this.loadedFonts.keys());
  }

  /**
   * Remove a loaded font
   */
  removeFont(fontFamily: string): boolean {
    const fontFace = this.loadedFonts.get(fontFamily);
    if (fontFace) {
      document.fonts.delete(fontFace);
      this.loadedFonts.delete(fontFamily);
      return true;
    }
    return false;
  }

  /**
   * Clear all loaded fonts
   */
  clearAllFonts(): void {
    this.loadedFonts.forEach((fontFace) => {
      document.fonts.delete(fontFace);
    });
    this.loadedFonts.clear();
    this.loadingPromises.clear();
  }

  /**
   * Create CSS @font-face rule string (for fallback or debugging)
   */
  static createCSSFontFace(fontDefinition: CustomFontDefinition): string {
    const {
      fontFamily,
      src,
      format,
      fontWeight = 'normal',
      fontStyle = 'normal',
      fontStretch = 'normal',
      unicodeRange,
      fontDisplay = 'swap'
    } = fontDefinition;

    const fontLoader = FontLoader.getInstance();
    const detectedFormat = format || fontLoader.detectFontFormat(src);

    let css = `@font-face {\n`;
    css += `  font-family: '${fontFamily}';\n`;
    css += `  src: url('${src}') format('${detectedFormat}');\n`;
    css += `  font-weight: ${fontWeight};\n`;
    css += `  font-style: ${fontStyle};\n`;
    css += `  font-stretch: ${fontStretch};\n`;
    css += `  font-display: ${fontDisplay};\n`;
    
    if (unicodeRange) {
      css += `  unicode-range: ${unicodeRange};\n`;
    }
    
    css += `}`;

    return css;
  }
}

/**
 * Convenience function to load a single font
 */
export async function loadCustomFont(
  fontDefinition: CustomFontDefinition,
  options?: FontLoadOptions
): Promise<FontLoadResult> {
  const fontLoader = FontLoader.getInstance();
  return fontLoader.loadFont(fontDefinition, options);
}

/**
 * Convenience function to load multiple fonts
 */
export async function loadCustomFonts(
  fontDefinitions: CustomFontDefinition[],
  options?: FontLoadOptions
): Promise<FontLoadResult[]> {
  const fontLoader = FontLoader.getInstance();
  return fontLoader.loadFonts(fontDefinitions, options);
}

/**
 * Check if custom fonts are supported
 */
export const isCustomFontSupported = FontLoader.isSupported;