import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Editor } from '@tiptap/react';
import { Toolbar } from '../Toolbar';

function createCommandChain() {
  const commandChain = {
    focus: jest.fn(),
    toggleBold: jest.fn(),
    toggleItalic: jest.fn(),
    toggleUnderline: jest.fn(),
    toggleStrike: jest.fn(),
    toggleHeading: jest.fn(),
    toggleBulletList: jest.fn(),
    toggleOrderedList: jest.fn(),
    extendMarkRange: jest.fn(),
    setLink: jest.fn(),
    unsetLink: jest.fn(),
    setColor: jest.fn(),
    unsetColor: jest.fn(),
    setFontFamily: jest.fn(),
    unsetFontFamily: jest.fn(),
    toggleBlockquote: jest.fn(),
    toggleCodeBlock: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
    run: jest.fn().mockReturnValue(true),
  };

  commandChain.focus.mockReturnValue(commandChain);
  commandChain.toggleBold.mockReturnValue(commandChain);
  commandChain.toggleItalic.mockReturnValue(commandChain);
  commandChain.toggleUnderline.mockReturnValue(commandChain);
  commandChain.toggleStrike.mockReturnValue(commandChain);
  commandChain.toggleHeading.mockReturnValue(commandChain);
  commandChain.toggleBulletList.mockReturnValue(commandChain);
  commandChain.toggleOrderedList.mockReturnValue(commandChain);
  commandChain.extendMarkRange.mockReturnValue(commandChain);
  commandChain.setLink.mockReturnValue(commandChain);
  commandChain.unsetLink.mockReturnValue(commandChain);
  commandChain.setColor.mockReturnValue(commandChain);
  commandChain.unsetColor.mockReturnValue(commandChain);
  commandChain.setFontFamily.mockReturnValue(commandChain);
  commandChain.unsetFontFamily.mockReturnValue(commandChain);
  commandChain.toggleBlockquote.mockReturnValue(commandChain);
  commandChain.toggleCodeBlock.mockReturnValue(commandChain);
  commandChain.undo.mockReturnValue(commandChain);
  commandChain.redo.mockReturnValue(commandChain);

  return commandChain;
}

function createMockEditor(options?: {
  activeFormats?: string[];
  canUndo?: boolean;
  canRedo?: boolean;
}): Editor {
  const activeFormats = new Set(options?.activeFormats ?? []);
  const commandChain = createCommandChain();
  const canCommands = {
    undo: jest.fn().mockReturnValue(options?.canUndo ?? true),
    redo: jest.fn().mockReturnValue(options?.canRedo ?? true),
  };

  return {
    isActive: jest
      .fn()
      .mockImplementation((format: string) => activeFormats.has(format)),
    can: jest.fn().mockReturnValue(canCommands),
    chain: jest.fn().mockReturnValue(commandChain),
    getAttributes: jest.fn().mockReturnValue({}),
  } as unknown as Editor;
}

const mockEditor = createMockEditor();

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
    const activeEditor = createMockEditor({ activeFormats: ['bold'] });

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
    const disabledEditor = createMockEditor({ canUndo: false, canRedo: false });

    render(<Toolbar editor={disabledEditor} />);

    const undoButton = screen.getByTitle('Undo (Ctrl+Z)');
    const redoButton = screen.getByTitle('Redo (Ctrl+Y)');

    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();
  });
});
