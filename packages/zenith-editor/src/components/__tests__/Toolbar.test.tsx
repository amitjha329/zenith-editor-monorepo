import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toolbar } from '../Toolbar';

// Mock Tiptap editor
const mockEditor = {
  isActive: jest.fn().mockReturnValue(false),
  can: jest.fn().mockReturnValue({
    undo: jest.fn().mockReturnValue(true),
    redo: jest.fn().mockReturnValue(true),
  }),
  chain: jest.fn().mockReturnValue({
    focus: jest.fn().mockReturnValue({
      toggleBold: jest.fn().mockReturnValue({
        run: jest.fn(),
      }),
      toggleItalic: jest.fn().mockReturnValue({
        run: jest.fn(),
      }),
      undo: jest.fn().mockReturnValue({
        run: jest.fn(),
      }),
      redo: jest.fn().mockReturnValue({
        run: jest.fn(),
      }),
    }),
  }),
  getAttributes: jest.fn().mockReturnValue({}),
} as any;

describe('Toolbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all toolbar buttons', () => {
    render(<Toolbar editor={mockEditor} />);
    
    // Check for formatting buttons
    expect(screen.getByTitle('Bold (Ctrl+B)')).toBeInTheDocument();
    expect(screen.getByTitle('Italic (Ctrl+I)')).toBeInTheDocument();
    expect(screen.getByTitle('Underline (Ctrl+U)')).toBeInTheDocument();
    expect(screen.getByTitle('Strikethrough')).toBeInTheDocument();
    
    // Check for heading buttons
    expect(screen.getByTitle('Heading 1')).toBeInTheDocument();
    expect(screen.getByTitle('Heading 2')).toBeInTheDocument();
    expect(screen.getByTitle('Heading 3')).toBeInTheDocument();
    
    // Check for list buttons
    expect(screen.getByTitle('Bullet List')).toBeInTheDocument();
    expect(screen.getByTitle('Ordered List')).toBeInTheDocument();
    
    // Check for other buttons
    expect(screen.getByTitle('Add Link')).toBeInTheDocument();
    expect(screen.getByTitle('Blockquote')).toBeInTheDocument();
    expect(screen.getByTitle('Code Block')).toBeInTheDocument();
    expect(screen.getByTitle('Undo (Ctrl+Z)')).toBeInTheDocument();
    expect(screen.getByTitle('Redo (Ctrl+Y)')).toBeInTheDocument();
  });

  it('calls editor methods when buttons are clicked', () => {
    render(<Toolbar editor={mockEditor} />);
    
    // Test bold button
    const boldButton = screen.getByTitle('Bold (Ctrl+B)');
    fireEvent.click(boldButton);
    
    expect(mockEditor.chain).toHaveBeenCalled();
  });

  it('shows active state for active formatting', () => {
    const activeEditor = {
      ...mockEditor,
      isActive: jest.fn().mockImplementation((format) => format === 'bold'),
    };
    
    render(<Toolbar editor={activeEditor} />);
    
    const boldButton = screen.getByTitle('Bold (Ctrl+B)');
    expect(boldButton).toHaveClass('bg-gray-200');
  });

  it('shows image upload button when onImageUpload is provided', () => {
    const mockImageUpload = jest.fn();
    render(<Toolbar editor={mockEditor} onImageUpload={mockImageUpload} />);
    
    expect(screen.getByTitle('Add Image')).toBeInTheDocument();
  });

  it('does not show image upload button when onImageUpload is not provided', () => {
    render(<Toolbar editor={mockEditor} />);
    
    expect(screen.queryByTitle('Add Image')).not.toBeInTheDocument();
  });

  it('disables undo/redo buttons when not available', () => {
    const disabledEditor = {
      ...mockEditor,
      can: jest.fn().mockReturnValue({
        undo: jest.fn().mockReturnValue(false),
        redo: jest.fn().mockReturnValue(false),
      }),
    };
    
    render(<Toolbar editor={disabledEditor} />);
    
    const undoButton = screen.getByTitle('Undo (Ctrl+Z)');
    const redoButton = screen.getByTitle('Redo (Ctrl+Y)');
    
    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();
  });
});
