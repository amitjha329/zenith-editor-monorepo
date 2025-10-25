import { FontLoader, loadCustomFont, loadCustomFonts, isCustomFontSupported } from '../fontLoader';

// Mock FontFace API
class MockFontFace {
  family: string;
  source: string;
  descriptors: any;

  constructor(family: string, source: string, descriptors: any = {}) {
    this.family = family;
    this.source = source;
    this.descriptors = descriptors;
  }

  async load() {
    // Simulate font loading
    await new Promise(resolve => setTimeout(resolve, 10));
    return this;
  }
}

// Mock document.fonts API
const mockFonts = {
  fonts: new Set(),
  add: jest.fn().mockImplementation(function(font: MockFontFace) {
    this.fonts.add(font);
  }),
  delete: jest.fn().mockImplementation(function(font: MockFontFace) {
    return this.fonts.delete(font);
  }),
  ready: Promise.resolve()
};

// Setup mocks
beforeAll(() => {
  // Mock FontFace API globally
  (global as any).FontFace = MockFontFace;
  (global as any).document = {
    fonts: mockFonts
  };
  
  // Mock the isSupported check to return true
  Object.defineProperty(global, 'FontFace', {
    value: MockFontFace,
    writable: true
  });
  
  Object.defineProperty(global, 'document', {
    value: {
      fonts: mockFonts
    },
    writable: true
  });
});

beforeEach(() => {
  // Reset mocks
  mockFonts.fonts.clear();
  mockFonts.add.mockClear();
  mockFonts.delete.mockClear();
  
  // Clear singleton instance
  // @ts-ignore
  FontLoader.instance = undefined;
});

describe('FontLoader', () => {
  describe('isSupported', () => {
    it('should return true when FontFace API is available', () => {
      expect(isCustomFontSupported()).toBe(true);
    });
  });

  describe('getInstance', () => {
    it('should return a singleton instance', () => {
      const instance1 = FontLoader.getInstance();
      const instance2 = FontLoader.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('loadFont', () => {
    it('should load a single font successfully', async () => {
      const fontLoader = FontLoader.getInstance();
      
      const result = await fontLoader.loadFont({
        fontFamily: 'TestFont',
        src: '/fonts/test.woff2',
        format: 'woff2'
      });

      expect(result.status).toBe('loaded');
      expect(result.fontFamily).toBe('TestFont');
      expect(mockFonts.add).toHaveBeenCalled();
    });

    it('should return existing font if already loaded', async () => {
      const fontLoader = FontLoader.getInstance();
      
      // Load font first time
      await fontLoader.loadFont({
        fontFamily: 'TestFont',
        src: '/fonts/test.woff2'
      });

      // Load same font again
      const result = await fontLoader.loadFont({
        fontFamily: 'TestFont',
        src: '/fonts/test.woff2'
      });

      expect(result.status).toBe('loaded');
      expect(result.fontFamily).toBe('TestFont');
    });

    it('should auto-detect font format from file extension', async () => {
      const fontLoader = FontLoader.getInstance();
      
      const result = await fontLoader.loadFont({
        fontFamily: 'TestFont',
        src: '/fonts/test.ttf'
      });

      expect(result.status).toBe('loaded');
    });

    it('should handle font loading timeout', async () => {
      // Mock a slow loading font
      jest.spyOn(MockFontFace.prototype, 'load').mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );

      const fontLoader = FontLoader.getInstance();
      
      const result = await fontLoader.loadFont(
        {
          fontFamily: 'SlowFont',
          src: '/fonts/slow.woff2'
        },
        { timeout: 50 } // Very short timeout
      );

      expect(result.status).toBe('timeout');
      expect(result.error).toContain('timeout');
    });

    it('should handle font loading errors', async () => {
      // Mock a failing font load
      jest.spyOn(MockFontFace.prototype, 'load').mockRejectedValue(
        new Error('Font not found')
      );

      const fontLoader = FontLoader.getInstance();
      
      const result = await fontLoader.loadFont({
        fontFamily: 'FailFont',
        src: '/fonts/fail.woff2'
      });

      expect(result.status).toBe('error');
      expect(result.error).toBe('Font not found');
    });
  });

  describe('loadFonts', () => {
    it('should load multiple fonts successfully', async () => {
      const fontLoader = FontLoader.getInstance();
      
      const results = await fontLoader.loadFonts([
        { fontFamily: 'Font1', src: '/fonts/font1.woff2' },
        { fontFamily: 'Font2', src: '/fonts/font2.woff2' }
      ]);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe('loaded');
      expect(results[1].status).toBe('loaded');
      expect(mockFonts.add).toHaveBeenCalledTimes(2);
    });
  });

  describe('utility methods', () => {
    it('should check if font is loaded', async () => {
      const fontLoader = FontLoader.getInstance();
      
      expect(fontLoader.isFontLoaded('TestFont')).toBe(false);
      
      await fontLoader.loadFont({
        fontFamily: 'TestFont',
        src: '/fonts/test.woff2'
      });

      expect(fontLoader.isFontLoaded('TestFont')).toBe(true);
    });

    it('should get loaded fonts list', async () => {
      const fontLoader = FontLoader.getInstance();
      
      expect(fontLoader.getLoadedFonts()).toEqual([]);
      
      await fontLoader.loadFont({
        fontFamily: 'TestFont',
        src: '/fonts/test.woff2'
      });

      expect(fontLoader.getLoadedFonts()).toEqual(['TestFont']);
    });

    it('should remove font', async () => {
      const fontLoader = FontLoader.getInstance();
      
      await fontLoader.loadFont({
        fontFamily: 'TestFont',
        src: '/fonts/test.woff2'
      });

      expect(fontLoader.isFontLoaded('TestFont')).toBe(true);
      
      const removed = fontLoader.removeFont('TestFont');
      
      expect(removed).toBe(true);
      expect(fontLoader.isFontLoaded('TestFont')).toBe(false);
      expect(mockFonts.delete).toHaveBeenCalled();
    });

    it('should clear all fonts', async () => {
      const fontLoader = FontLoader.getInstance();
      
      await fontLoader.loadFonts([
        { fontFamily: 'Font1', src: '/fonts/font1.woff2' },
        { fontFamily: 'Font2', src: '/fonts/font2.woff2' }
      ]);

      expect(fontLoader.getLoadedFonts()).toHaveLength(2);
      
      fontLoader.clearAllFonts();
      
      expect(fontLoader.getLoadedFonts()).toHaveLength(0);
    });
  });

  describe('createCSSFontFace', () => {
    it('should generate correct CSS @font-face rule', () => {
      const css = FontLoader.createCSSFontFace({
        fontFamily: 'TestFont',
        src: '/fonts/test.woff2',
        fontWeight: '400',
        fontStyle: 'normal'
      });

      expect(css).toContain("font-family: 'TestFont';");
      expect(css).toContain("src: url('/fonts/test.woff2') format('woff2');");
      expect(css).toContain('font-weight: 400;');
      expect(css).toContain('font-style: normal;');
    });
  });
});

describe('Standalone font loading functions', () => {
  it('should load single font with loadCustomFont', async () => {
    const result = await loadCustomFont({
      fontFamily: 'StandaloneFont',
      src: '/fonts/standalone.woff2'
    });

    expect(result.status).toBe('loaded');
    expect(result.fontFamily).toBe('StandaloneFont');
  });

  it('should load multiple fonts with loadCustomFonts', async () => {
    const results = await loadCustomFonts([
      { fontFamily: 'Font1', src: '/fonts/font1.woff2' },
      { fontFamily: 'Font2', src: '/fonts/font2.woff2' }
    ]);

    expect(results).toHaveLength(2);
    expect(results.every(r => r.status === 'loaded')).toBe(true);
  });
});