import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils';
import { useRef, useCallback, memo, useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

const TiptapEditor = memo(({ 
  content, 
  onChange, 
  placeholder = "Start typing...", 
  className,
  editable = true 
}: TiptapEditorProps) => {
  const onUpdateRef = useRef(onChange);
  const editorRef = useRef(null);

  // Keep the onChange callback ref updated
  onUpdateRef.current = onChange;

  // Track mount/unmount
  useEffect(() => {
    console.log('🔵 TiptapEditor mounted');
    return () => console.log('🔴 TiptapEditor unmounted');
  }, []);

  // Memoized onUpdate callback to prevent editor recreation
  const handleUpdate = useCallback(({ editor }: { editor: any }) => {
    const html = editor.getHTML();
    console.log('📝 Editor updated, has focus:', editor.isFocused, 'HTML:', html);
    onUpdateRef.current(html);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content, // Only used for initial content
    editable,
    onUpdate: handleUpdate,
    onFocus: ({ editor, event }) => {
      console.log('🟢 Editor FOCUSED', event.type);
    },
    onBlur: ({ editor, event }) => {
      console.log('🔴 Editor BLURRED', event.type, 'Related target:', event.relatedTarget);
      console.trace('Blur stack trace');
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[100px] p-3',
          className
        ),
        spellcheck: 'false', // Disable spellcheck to prevent focus loss
      },
    },
  });

  // Monitor editor instance changes
  useEffect(() => {
    console.log('🔄 Editor instance changed:', editor);
  }, [editor]);

  if (!editor) {
    console.log('TiptapEditor - editor not ready yet');
    return (
      <div className="border border-input rounded-md p-3 min-h-[100px] flex items-center justify-center text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  console.log('TiptapEditor render - editable:', editable);

  return (
    <div className="border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {editable && (
        <div className="border-b border-input p-2 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => {
              console.log('Bold button clicked');
              editor.chain().focus().toggleBold().run();
            }}
            className={cn(
              'px-2 py-1 text-sm rounded hover:bg-muted',
              editor.isActive('bold') ? 'bg-muted font-semibold' : ''
            )}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => {
              console.log('Italic button clicked');
              editor.chain().focus().toggleItalic().run();
            }}
            className={cn(
              'px-2 py-1 text-sm rounded hover:bg-muted',
              editor.isActive('italic') ? 'bg-muted font-semibold' : ''
            )}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => {
              console.log('Bullet list button clicked');
              editor.chain().focus().toggleBulletList().run();
            }}
            className={cn(
              'px-2 py-1 text-sm rounded hover:bg-muted',
              editor.isActive('bulletList') ? 'bg-muted font-semibold' : ''
            )}
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => {
              console.log('Ordered list button clicked');
              editor.chain().focus().toggleOrderedList().run();
            }}
            className={cn(
              'px-2 py-1 text-sm rounded hover:bg-muted',
              editor.isActive('orderedList') ? 'bg-muted font-semibold' : ''
            )}
          >
            1. List
          </button>
        </div>
      )}
      <div 
        ref={editorRef}
        onFocus={(e) => console.log('🟡 Wrapper div focused', e.target)}
        onBlur={(e) => console.log('🟠 Wrapper div blurred', e.target)}
      >
        <EditorContent 
          editor={editor} 
          placeholder={placeholder}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if editable, placeholder, or className changes
  // Don't re-render when content changes since the editor manages its own state
  return (
    prevProps.editable === nextProps.editable &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.className === nextProps.className
  );
});

TiptapEditor.displayName = 'TiptapEditor';

export { TiptapEditor };
