import React from 'react';
import { render, screen } from '@testing-library/react';
import { ZenithEditor } from '../Editor';

// Mock useZenithEditor hook
jest.mock('../../hooks/useZenithEditor', () => ({
  useZenithEditor: () => ({
    editor: {
      getHTML: () => '<p>test content</p>',
      getJSON: () => ({ type: 'doc', content: [] }),
      isEmpty: false,
      isFocused: false,
      can: () => ({ undo: () => false, redo: () => false }),
      commands: {
        setContent: jest.fn(),
        clearContent: jest.fn(),
        focus: jest.fn(),
        undo: jest.fn(),
        redo: jest.fn(),
      },
    },
    getHTML: () => '<p>test content</p>',
    getJSON: () => ({ type: 'doc', content: [] }),
    setContent: jest.fn(),
    clearContent: jest.fn(),
    focus: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
    isEmpty: false,
    isFocused: false,
    canUndo: false,
    canRedo: false,
  }),
}));

// Mock EditorContent component
jest.mock('@tiptap/react', () => ({
  EditorContent: ({ style, className }: { style?: React.CSSProperties; className?: string }) => (
    <div data-testid="editor-content" style={style} className={className}>
      Editor Content
    </div>
  ),
}));

// Mock Toolbar component
jest.mock('../Toolbar', () => ({
  Toolbar: () => <div role="toolbar">Toolbar</div>,
}));

describe('ZenithEditor', () => {
  it('renders editor with default props', () => {
    render(<ZenithEditor />);
    
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });

  it('applies contentStyle to editor content', () => {
    const contentStyle = {
      fontFamily: 'Georgia, serif',
      fontSize: '16px',
      color: '#333',
    };

    render(<ZenithEditor contentStyle={contentStyle} />);
    
    const editorContent = screen.getByTestId('editor-content');
    expect(editorContent).toHaveStyle({
      fontFamily: 'Georgia, serif',
      fontSize: '16px',
      color: '#333',
    });
  });

  it('applies custom container className', () => {
    render(<ZenithEditor containerClassName="custom-container" />);
    
    const container = screen.getByTestId('editor-content').closest('.zenith-editor-container');
    expect(container).toHaveClass('custom-container');
  });

  it('applies custom editor className', () => {
    render(<ZenithEditor editorClassName="custom-editor" />);
    
    const editorContent = screen.getByTestId('editor-content');
    expect(editorContent).toHaveClass('custom-editor');
  });

  it('applies container style', () => {
    const containerStyle = { backgroundColor: 'red' };
    render(<ZenithEditor style={containerStyle} />);
    
    const container = screen.getByTestId('editor-content').closest('.zenith-editor-container');
    expect(container).toHaveStyle({ backgroundColor: 'red' });
  });

  it('shows toolbar by default', () => {
    render(<ZenithEditor />);
    
    const toolbar = screen.getByRole('toolbar', { hidden: true });
    expect(toolbar).toBeInTheDocument();
  });

  it('hides toolbar when showToolbar is false', () => {
    render(<ZenithEditor showToolbar={false} />);
    
    const toolbar = screen.queryByRole('toolbar', { hidden: true });
    expect(toolbar).not.toBeInTheDocument();
  });

  it('combines multiple styling options correctly', () => {
    const contentStyle = {
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.5',
    };
    
    const containerStyle = {
      border: '2px solid blue',
    };

    render(
      <ZenithEditor
        contentStyle={contentStyle}
        style={containerStyle}
        containerClassName="test-container"
        editorClassName="test-editor"
      />
    );
    
    const editorContent = screen.getByTestId('editor-content');
    const container = editorContent.closest('.zenith-editor-container');
    
    expect(editorContent).toHaveStyle({
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.5',
    });
    
    expect(container).toHaveStyle({
      border: '2px solid blue',
    });
    
    expect(container).toHaveClass('test-container');
    expect(editorContent).toHaveClass('test-editor');
  });
});