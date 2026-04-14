import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { Editor } from '@tiptap/react';
import { ColorPicker } from '../ColorPicker';

function createMockEditor(color = '#000000'): Editor {
  const chainedCommands = {
    focus: jest.fn(),
    setColor: jest.fn(),
    unsetColor: jest.fn(),
    run: jest.fn().mockReturnValue(true),
  };

  chainedCommands.focus.mockReturnValue(chainedCommands);
  chainedCommands.setColor.mockReturnValue(chainedCommands);
  chainedCommands.unsetColor.mockReturnValue(chainedCommands);

  return {
    isEditable: true,
    getAttributes: jest
      .fn()
      .mockImplementation((attribute: string) =>
        attribute === 'textStyle' ? { color } : {}
      ),
    chain: jest.fn().mockReturnValue(chainedCommands),
  } as unknown as Editor;
}

describe('ColorPicker', () => {
  it('renders color picker button', () => {
    const mockEditor = createMockEditor();

    render(<ColorPicker editor={mockEditor} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Text Color (#000000)');
  });

  it('opens dropdown when button is clicked', () => {
    const mockEditor = createMockEditor();

    render(<ColorPicker editor={mockEditor} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Check for predefined color buttons
    expect(screen.getByTitle('#ef4444')).toBeInTheDocument();
    expect(screen.getByTitle('#22c55e')).toBeInTheDocument();

    // Check for custom color section
    expect(screen.getByText('Custom:')).toBeInTheDocument();
  });

  it('does not render when editor is null', () => {
    const { container } = render(
      <ColorPicker editor={null as unknown as Editor} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows current color in title', () => {
    const editorWithColor = createMockEditor('#ef4444');

    render(<ColorPicker editor={editorWithColor} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Text Color (#ef4444)');
  });
});
