'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Import the editor dynamically to avoid SSR issues
const ZenithEditor = dynamic(
  () => import('zenith-editor').then((mod) => mod.ZenithEditor),
  {
    ssr: false,
    loading: () => (
      <div className="border border-gray-300 rounded-lg p-8 bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

export default function HomePage() {
  const [content, setContent] = useState(`
    <h1>Welcome to Zenith Editor! 🚀</h1>
    <p>This is a powerful, modern WYSIWYG editor built with React and TypeScript. Here are some features you can try:</p>
    
    <h2>Text Formatting</h2>
    <p>You can make text <strong>bold</strong>, <em>italic</em>, <u>underlined</u>, or <s>strikethrough</s>.</p>
    
    <h2>Lists</h2>
    <p>Create ordered lists:</p>
    <ol>
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
    </ol>
    
    <p>Or unordered lists:</p>
    <ul>
      <li>Bullet point one</li>
      <li>Bullet point two</li>
      <li>Bullet point three</li>
    </ul>
    
    <h2>Blockquotes</h2>
    <blockquote>
      <p>This is a beautiful blockquote that you can use to highlight important text or quotes.</p>
    </blockquote>
    
    <h2>Code Blocks</h2>
    <p>You can insert code blocks with syntax highlighting:</p>
    <pre><code class="language-javascript">function hello() {
  console.log("Hello, Zenith Editor!");
  return "Welcome to the future of text editing!";
}</code></pre>
    
    <h3>Links and Images</h3>
    <p>You can easily add <a href="https://github.com" target="_blank" rel="noopener noreferrer">links</a> and images to your content.</p>
    
    <p><strong>Try the toolbar above to experiment with all features!</strong></p>
  `);

  const [jsonOutput, setJsonOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  // Mock image upload function for demo
  const handleImageUpload = async (file: File): Promise<string> => {
    // In a real application, you would upload the file to your server/CDN
    // For demo purposes, we'll convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleContentUpdate = ({ html, json }: { html: string; json: any }) => {
    setContent(html);
    setJsonOutput(JSON.stringify(json, null, 2));
  };

  const sampleTemplates = [
    {
      name: 'Blog Post',
      content: `
        <h1>My Amazing Blog Post</h1>
        <p>Write your blog post content here. You can use <strong>bold text</strong>, <em>italic text</em>, and all the formatting options available in the toolbar.</p>
        <h2>Introduction</h2>
        <p>Start with a compelling introduction...</p>
        <h2>Main Content</h2>
        <p>Develop your ideas here...</p>
        <blockquote>
          <p>Add a powerful quote to engage your readers.</p>
        </blockquote>
        <h2>Conclusion</h2>
        <p>Wrap up your thoughts...</p>
      `,
    },
    {
      name: 'Meeting Notes',
      content: `
        <h1>Team Meeting - ${new Date().toLocaleDateString()}</h1>
        <h2>Attendees</h2>
        <ul>
          <li>John Doe</li>
          <li>Jane Smith</li>
          <li>Bob Johnson</li>
        </ul>
        <h2>Agenda</h2>
        <ol>
          <li>Project updates</li>
          <li>Budget review</li>
          <li>Next steps</li>
        </ol>
        <h2>Action Items</h2>
        <ul>
          <li><strong>John:</strong> Complete feature X by Friday</li>
          <li><strong>Jane:</strong> Review budget proposal</li>
          <li><strong>Bob:</strong> Schedule follow-up meeting</li>
        </ul>
      `,
    },
    {
      name: 'Documentation',
      content: `
        <h1>API Documentation</h1>
        <h2>Getting Started</h2>
        <p>This API allows you to interact with our service programmatically.</p>
        <h3>Authentication</h3>
        <p>Include your API key in the header:</p>
        <pre><code class="language-javascript">const response = await fetch('/api/endpoint', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});</code></pre>
        <h3>Endpoints</h3>
        <h4>GET /api/users</h4>
        <p>Retrieves a list of users.</p>
        <blockquote>
          <p><strong>Note:</strong> This endpoint requires admin privileges.</p>
        </blockquote>
      `,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Zenith Editor
              </h1>
              <p className="text-gray-600 mt-1">
                Modern WYSIWYG Editor for React & Next.js
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://github.com/zenith-editor/zenith-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.npmjs.com/package/zenith-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0H1.763zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113V5.323z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Editor</h2>
                <p className="text-gray-600 mt-1">
                  Try out all the features below!
                </p>
              </div>

              <div className="p-6">
                <ZenithEditor
                  initialContent={content}
                  placeholder="Start typing your content here..."
                  onUpdate={handleContentUpdate}
                  onImageUpload={handleImageUpload}
                  containerClassName="min-h-[400px]"
                  contentStyle={{
                    color:"red"
                    
                  }}
                />
              </div>
            </div>

            {/* Output Section */}
            <div className="mt-8 bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Output
                  </h2>
                  <button
                    onClick={() => setShowOutput(!showOutput)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {showOutput ? 'Hide' : 'Show'} Raw Output
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Rendered HTML
                    </h3>
                    <div
                      className="prose prose-sm max-w-none border border-gray-300 rounded-lg p-4 bg-gray-50"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>

                  {showOutput && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          HTML Output
                        </h3>
                        <pre className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-sm overflow-x-auto">
                          <code>{content}</code>
                        </pre>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          JSON Output
                        </h3>
                        <pre className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-sm overflow-x-auto">
                          <code>{jsonOutput}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Custom Fonts Demo */}
          <div className="lg:col-span-3 mt-8">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Custom Fonts</h2>
                <p className="text-gray-600 mt-1">
                  Load and use custom fonts in your editor content using the FontFace Web API
                </p>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>New Feature:</strong> Use the font selector in the toolbar to easily switch between available fonts while editing!
                  </p>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Google Fonts Example */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Google Fonts Integration</h3>
                  <ZenithEditor
                    initialContent="<h2>Custom Font Demo</h2><p>This editor uses a custom font loaded via the FontFace Web API. You can load fonts from Google Fonts, Adobe Fonts, or your own hosted font files.</p>"
                    placeholder="Start typing with custom fonts..."
                    contentStyle={{
                      fontFamily: 'Roboto, sans-serif',
                      fontSize: '15px',
                      lineHeight: '1.6'
                    }}
                    containerClassName="min-h-[250px]"
                  />
                </div>

                {/* Multiple Font Weights Example */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Multiple Font Weights</h3>
                  <ZenithEditor
                    initialContent="<h2>Font Weight Variations</h2><p>This demonstrates loading multiple weights of the same font family for richer typography.</p><p><strong>Bold text</strong> and <em>italic text</em> use different font weights.</p>"
                    placeholder="Type with multiple font weights..."
                    customFonts={[
                      {
                        fontFamily: 'Inter',
                        src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
                        format: 'woff2',
                        fontWeight: '400',
                        fontDisplay: 'swap'
                      },
                      {
                        fontFamily: 'Inter',
                        src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2',
                        format: 'woff2',
                        fontWeight: '700',
                        fontDisplay: 'swap'
                      }
                    ]}
                    contentStyle={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}
                    containerClassName="min-h-[250px]"
                  />
                </div>

                {/* Custom Local Font Example */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Local Font Files</h3>
                  <ZenithEditor
                    initialContent="<h2>Hindi Font Example</h2><p>यह एक कस्टम हिंदी फॉन्ट का उदाहरण है। Custom fonts can support various languages and scripts.</p><p>This demonstrates loading fonts from your local server or CDN.</p>"
                    placeholder="Type in multiple languages..."
                    customFonts={[
                      {
                        fontFamily: 'HindiFont',
                        src: '/fonts/hindi_font.ttf',
                        format: 'truetype',
                        fontDisplay: 'swap'
                      }
                    ]}
                    contentStyle={{
                      fontFamily: 'HindiFont, Noto Sans Devanagari, sans-serif',
                      fontSize: '16px',
                      lineHeight: '1.7'
                    }}
                    containerClassName="min-h-[250px]"
                    onFontsLoaded={(fonts) => console.log('Fonts loaded:', fonts)}
                    onFontLoadError={(error) => console.warn('Font load error:', error)}
                  />
                </div>

                {/* Font Loading Status Example */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Font Loading Status</h3>
                  <div className="space-y-4">
                    <ZenithEditor
                      initialContent="<h2>Font Loading Demo</h2><p>This editor shows how to handle font loading states and errors. Check the console for loading status updates.</p>"
                      placeholder="Font loading example..."
                      customFonts={[
                        {
                          fontFamily: 'Poppins',
                          src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJDUc1NECPY.woff2',
                          format: 'woff2',
                          fontDisplay: 'swap'
                        }
                      ]}
                      contentStyle={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '15px',
                        lineHeight: '1.6'
                      }}
                      containerClassName="min-h-[250px]"
                      fontLoadOptions={{
                        timeout: 10000,
                        testString: 'ABC'
                      }}
                    />
                    <div className="text-sm text-gray-600">
                      <p>• Fonts are loaded automatically when the editor mounts</p>
                      <p>• Loading status and errors are logged to console</p>
                      <p>• Fallback fonts are used until custom fonts load</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Styling Demo */}
          <div className="lg:col-span-3 mt-8">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Content Styling Options</h2>
                <p className="text-gray-600 mt-1">
                  Customize the appearance of your editor content with custom styles
                </p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Elegant Serif Style */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Elegant Serif</h3>
                  <ZenithEditor
                    initialContent="<h2>Elegant Typography</h2><p>This editor uses Georgia serif font with comfortable line spacing for a classic, readable appearance perfect for articles and blogs.</p>"
                    placeholder="Start typing with elegant typography..."
                    contentStyle={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: '16px',
                      lineHeight: '1.7',
                      color: '#2c3e50'
                    }}
                    containerClassName="min-h-[250px]"
                  />
                </div>

                {/* Modern Sans-Serif Style */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Modern Sans-Serif</h3>
                  <ZenithEditor
                    initialContent="<h2>Clean & Modern</h2><p>A contemporary look with system fonts, optimized for readability across all devices and platforms.</p>"
                    placeholder="Start typing with modern typography..."
                    contentStyle={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      color: '#ff0000',
                      letterSpacing: '0.025em'
                    }}
                    containerClassName="min-h-[250px]"
                  />
                </div>

                {/* Code-Friendly Style */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Developer Style</h3>
                  <ZenithEditor
                    initialContent="<h2>Code Documentation</h2><p>Perfect for technical writing with monospace influences and syntax-friendly styling for developers.</p><pre><code>console.log('Hello, World!');</code></pre>"
                    placeholder="Start typing technical content..."
                    contentStyle={{
                      fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: '#1f2937',
                      backgroundColor: '#f8fafc'
                    }}
                    containerClassName="min-h-[250px]"
                  />
                </div>

                {/* Creative Style */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Creative Style</h3>
                  <ZenithEditor
                    initialContent="<h2>Creative Writing</h2><p>Artistic and expressive styling with custom colors and spacing, perfect for creative content and storytelling.</p>"
                    placeholder="Start your creative writing..."
                    contentStyle={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: '17px',
                      lineHeight: '1.8',
                      color: '#7c3aed',
                      textAlign: 'center' as const
                    }}
                    containerClassName="min-h-[250px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Templates
                </h2>
                <p className="text-gray-600 mt-1">
                  Try different content types
                </p>
              </div>

              <div className="p-6 space-y-4">
                {sampleTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setContent(template.content)}
                    className="w-full text-left p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <div className="font-medium text-gray-900">
                      {template.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Load sample {template.name.toLowerCase()} content
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Features
                </h2>
              </div>

              <div className="p-6">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Rich text formatting
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Custom font loading (FontFace API)
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Custom content styling
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Headings (H1, H2, H3)
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Lists (ordered & unordered)
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Links with popup editor
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Image upload support
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Code blocks with syntax highlighting
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Blockquotes
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Undo/Redo history
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Drag & drop images
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Multi-language font support
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Next.js SSR compatible
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    TypeScript support
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Tailwind CSS styling
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>
              Built with ❤️ using React, TypeScript, and Tiptap.
              <a
                href="https://github.com/zenith-editor/zenith-editor"
                className="text-blue-600 hover:text-blue-800 ml-1"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
