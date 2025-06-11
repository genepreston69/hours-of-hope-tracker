import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useCallback } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export const TiptapEditor = ({ 
  content, 
  onChange, 
  placeholder = "Start typing...", 
  className,
  editable = true 
}: TiptapEditorProps) => {
  const onUpdateRef = useRef(onChange);
  const isUpdatingRef = useRef(false);

  // Keep the onChange callback ref updated
  useEffect(() => {
    onUpdateRef.current = onChange;
  }, [onChange]);

  // Memoized onUpdate callback to prevent editor recreation
  const handleUpdate = useCallback(({ editor }: { editor: any }) => {
    if (isUpdatingRef.current) return;
    
    const html = editor.getHTML();
    console.log('TiptapEditor onUpdate:', html);
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
    content,
    editable,
    onUpdate: handleUpdate,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[100px] p-3',
          className
        ),
      },
    },
  });

  // Update editor content when content prop changes (but avoid infinite loops)
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !isUpdatingRef.current) {
      console.log('TiptapEditor useEffect - updating content:', content);
      isUpdatingRef.current = true;
      editor.commands.setContent(content, false);
      isUpdatingRef.current = false;
    }
  }, [editor, content]);

  if (!editor) {
    console.log('TiptapEditor - editor not ready yet');
    return (
      <div className="border border-input rounded-md p-3 min-h-[100px] flex items-center justify-center text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  console.log('TiptapEditor render - content:', content, 'editable:', editable);

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
      <EditorContent 
        editor={editor} 
        placeholder={placeholder}
        className="min-h-[100px]"
      />
    </div>
  );
};
