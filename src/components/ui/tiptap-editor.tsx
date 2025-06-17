
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils';
import { useRef, useCallback, memo, useEffect, useState } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
  fieldName?: string;
}

const TiptapEditor = memo(({ 
  content, 
  onChange, 
  placeholder = "Start typing...", 
  className,
  editable = true,
  fieldName = 'unknown'
}: TiptapEditorProps) => {
  const [instanceId] = useState(() => Math.random().toString(36).substr(2, 9));
  const onUpdateRef = useRef(onChange);
  const isUpdatingRef = useRef(false);

  console.log(`🏗️ TiptapEditor[${fieldName}:${instanceId}] rendering`);

  // Keep the onChange callback ref updated
  onUpdateRef.current = onChange;

  // Track mount/unmount
  useEffect(() => {
    console.log(`🔵 TiptapEditor[${fieldName}:${instanceId}] mounted`);
    return () => console.log(`🔴 TiptapEditor[${fieldName}:${instanceId}] unmounted`);
  }, [fieldName, instanceId]);

  // Memoized onUpdate callback to prevent editor recreation
  const handleUpdate = useCallback(({ editor }: { editor: any }) => {
    if (isUpdatingRef.current) return; // Prevent recursive updates
    
    const html = editor.getHTML();
    console.log(`📝 Editor[${fieldName}:${instanceId}] updated, focused:`, editor.isFocused, 'HTML:', html);
    
    isUpdatingRef.current = true;
    onUpdateRef.current(html);
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
  }, [fieldName, instanceId]);

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
    onCreate: ({ editor }) => {
      console.log(`✅ Editor[${fieldName}:${instanceId}] created`);
    },
    onDestroy: () => {
      console.log(`❌ Editor[${fieldName}:${instanceId}] destroyed`);
    },
    onUpdate: handleUpdate,
    onFocus: ({ editor, event }) => {
      console.log(`🟢 Editor[${fieldName}:${instanceId}] FOCUSED`, event.type);
    },
    onBlur: ({ editor, event }) => {
      console.log(`🔴 Editor[${fieldName}:${instanceId}] BLURRED`, event.type, 'Related target:', event.relatedTarget);
      
      // Only blur if we're not clicking on toolbar buttons
      const relatedTarget = event.relatedTarget as HTMLElement;
      if (relatedTarget && relatedTarget.closest('.tiptap-toolbar')) {
        event.preventDefault();
        setTimeout(() => editor.commands.focus(), 0);
        return;
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[100px] p-3',
          className
        ),
        spellcheck: 'false',
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'data-field': fieldName,
        'data-instance': instanceId,
      },
    },
  });

  // Update editor content only when it differs significantly and editor is not focused
  useEffect(() => {
    if (editor && !isUpdatingRef.current && !editor.isFocused) {
      const currentContent = editor.getHTML();
      if (currentContent !== content && content !== '') {
        console.log(`🔄 Updating editor content for ${fieldName}:${instanceId}`);
        editor.commands.setContent(content, false);
      }
    }
  }, [content, editor, fieldName, instanceId]);

  if (!editor) {
    console.log(`TiptapEditor[${fieldName}:${instanceId}] - editor not ready yet`);
    return (
      <div className="border border-input rounded-md p-3 min-h-[100px] flex items-center justify-center text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  console.log(`TiptapEditor[${fieldName}:${instanceId}] render - editable:`, editable);

  return (
    <div className="border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {editable && (
        <div className="tiptap-toolbar border-b border-input p-2 flex flex-wrap gap-1">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            onClick={() => {
              console.log(`Bold button clicked on ${fieldName}:${instanceId}`);
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
            onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            onClick={() => {
              console.log(`Italic button clicked on ${fieldName}:${instanceId}`);
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
            onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            onClick={() => {
              console.log(`Bullet list button clicked on ${fieldName}:${instanceId}`);
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
            onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            onClick={() => {
              console.log(`Ordered list button clicked on ${fieldName}:${instanceId}`);
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
      <div>
        <EditorContent 
          editor={editor} 
          placeholder={placeholder}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if editable, placeholder, className, or fieldName changes
  // Don't re-render when content changes since the editor manages its own state
  return (
    prevProps.editable === nextProps.editable &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.className === nextProps.className &&
    prevProps.fieldName === nextProps.fieldName
  );
});

TiptapEditor.displayName = 'TiptapEditor';

export { TiptapEditor };
