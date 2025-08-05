import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';

export const ImageResize: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const { src, alt, title, width: initialWidth, height: initialHeight } = node.attrs;
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({
    width: initialWidth || 300,
    height: initialHeight || 200,
  });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startDimensions, setStartDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState(1);
  const [showDimensions, setShowDimensions] = useState(false);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate aspect ratio when image loads
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      const ratio = naturalWidth / naturalHeight;
      setAspectRatio(ratio);
      
      // If no initial dimensions, set to natural size (max 600px width)
      if (!initialWidth && !initialHeight) {
        const maxWidth = 600;
        const newWidth = Math.min(naturalWidth, maxWidth);
        const newHeight = newWidth / ratio;
        
        setDimensions({ width: newWidth, height: newHeight });
        updateAttributes({ width: newWidth, height: newHeight });
      }
    }
  }, [initialWidth, initialHeight, updateAttributes]);

  // Handle mouse down on resize handles
  const handleMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeHandle(handle);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartDimensions({ ...dimensions });
    setShowDimensions(true);
  }, [dimensions]);

  // Handle mouse move during resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeHandle) return;
      
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      
      let newWidth = startDimensions.width;
      let newHeight = startDimensions.height;
      
      // Calculate new dimensions based on handle
      switch (resizeHandle) {
        case 'se': // Southeast corner
          newWidth = Math.max(50, startDimensions.width + deltaX);
          newHeight = Math.max(50, startDimensions.height + deltaY);
          break;
        case 'sw': // Southwest corner
          newWidth = Math.max(50, startDimensions.width - deltaX);
          newHeight = Math.max(50, startDimensions.height + deltaY);
          break;
        case 'ne': // Northeast corner
          newWidth = Math.max(50, startDimensions.width + deltaX);
          newHeight = Math.max(50, startDimensions.height - deltaY);
          break;
        case 'nw': // Northwest corner
          newWidth = Math.max(50, startDimensions.width - deltaX);
          newHeight = Math.max(50, startDimensions.height - deltaY);
          break;
        case 'e': // East edge
          newWidth = Math.max(50, startDimensions.width + deltaX);
          newHeight = newWidth / aspectRatio;
          break;
        case 'w': // West edge
          newWidth = Math.max(50, startDimensions.width - deltaX);
          newHeight = newWidth / aspectRatio;
          break;
        case 'n': // North edge
          newHeight = Math.max(50, startDimensions.height - deltaY);
          newWidth = newHeight * aspectRatio;
          break;
        case 's': // South edge
          newHeight = Math.max(50, startDimensions.height + deltaY);
          newWidth = newHeight * aspectRatio;
          break;
      }
      
      // Maintain aspect ratio for corner handles if shift is pressed
      if (e.shiftKey && ['se', 'sw', 'ne', 'nw'].includes(resizeHandle)) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }
      }
      
      setDimensions({ width: Math.round(newWidth), height: Math.round(newHeight) });
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        setResizeHandle(null);
        setShowDimensions(false);
        
        // Update the node attributes
        updateAttributes({
          width: dimensions.width,
          height: dimensions.height,
        });
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, resizeHandle, startPos, startDimensions, aspectRatio, dimensions, updateAttributes]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selected) return;
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Let the editor handle deletion
        return;
      }
      
      // Reset to original size with Ctrl+0
      if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        if (imageRef.current) {
          const { naturalWidth, naturalHeight } = imageRef.current;
          const maxWidth = 600;
          const newWidth = Math.min(naturalWidth, maxWidth);
          const newHeight = newWidth / aspectRatio;
          
          setDimensions({ width: newWidth, height: newHeight });
          updateAttributes({ width: newWidth, height: newHeight });
        }
      }
    };
    
    if (selected) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selected, aspectRatio, updateAttributes]);

  const resizeHandles = [
    { position: 'nw', cursor: 'nw-resize', className: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2' },
    { position: 'n', cursor: 'n-resize', className: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
    { position: 'ne', cursor: 'ne-resize', className: 'top-0 right-0 translate-x-1/2 -translate-y-1/2' },
    { position: 'e', cursor: 'e-resize', className: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2' },
    { position: 'se', cursor: 'se-resize', className: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2' },
    { position: 's', cursor: 's-resize', className: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
    { position: 'sw', cursor: 'sw-resize', className: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2' },
    { position: 'w', cursor: 'w-resize', className: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2' },
  ];

  return (
    <NodeViewWrapper>
      <div
        ref={containerRef}
        className={`relative inline-block group ${selected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          title={title}
          width={dimensions.width}
          height={dimensions.height}
          onLoad={handleImageLoad}
          className="block w-full h-full object-contain rounded-lg"
          draggable={false}
        />
        
        {/* Resize handles - only show when selected */}
        {selected && (
          <>
            {resizeHandles.map(({ position, cursor, className }) => (
              <div
                key={position}
                className={`absolute w-3 h-3 bg-blue-500 border border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${className}`}
                style={{ cursor }}
                onMouseDown={(e) => handleMouseDown(e, position)}
              />
            ))}
            
            {/* Dimension tooltip */}
            {showDimensions && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                {dimensions.width} × {dimensions.height}
              </div>
            )}
            
            {/* Instructions tooltip */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Drag to resize • Shift+drag to maintain aspect ratio • Ctrl+0 to reset
            </div>
          </>
        )}
        
        {/* Loading overlay */}
        {!imageRef.current?.complete && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-gray-400 text-sm">Loading...</div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};
