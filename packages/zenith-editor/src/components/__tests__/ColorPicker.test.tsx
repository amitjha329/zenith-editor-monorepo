import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ColorPicker } from '../ColorPicker';

// Mock the editor
const mockEditor = {
  isEditable: true,
  getAttributes: () => ({ color: '#000000' }),
  chain: () => ({
    focus: () => ({
      setColor: () => ({
        run: () => {},
      }),
      unsetColor: () => ({
        run: () => {},
      }),
    }),
  }),
} as any;

describe('ColorPicker', () => {
  it('renders color picker button', () => {
    render(<ColorPicker editor={mockEditor} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Text Color (#000000)');
  });

  it('opens dropdown when button is clicked', () => {
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
    const { container } = render(<ColorPicker editor={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows current color in title', () => {
    const editorWithColor = {
      ...mockEditor,
      getAttributes: () => ({ color: '#ef4444' }),
    } as any;

    render(<ColorPicker editor={editorWithColor} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Text Color (#ef4444)');
  });
});