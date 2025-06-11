
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils';

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
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[100px] p-3',
          className
        ),
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <div className="border-b border-input p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'px-2 py-1 text-sm rounded hover:bg-muted',
            editor.isActive('bold') ? 'bg-muted font-semibold' : ''
          )}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'px-2 py-1 text-sm rounded hover:bg-muted',
            editor.isActive('italic') ? 'bg-muted font-semibold' : ''
          )}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'px-2 py-1 text-sm rounded hover:bg-muted',
            editor.isActive('bulletList') ? 'bg-muted font-semibold' : ''
          )}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'px-2 py-1 text-sm rounded hover:bg-muted',
            editor.isActive('orderedList') ? 'bg-muted font-semibold' : ''
          )}
        >
          1. List
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        placeholder={placeholder}
      />
    </div>
  );
};
