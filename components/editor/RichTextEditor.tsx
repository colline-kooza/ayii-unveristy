"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start typing...",
  className,
  minHeight = "400px"
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  }, []);

  const updateContent = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    updateContent();
  }, [updateContent]);

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  }, [execCommand]);

  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  }, [execCommand]);

  // Set initial content when value changes from outside
  useEffect(() => {
    if (editorRef.current && !isFocused && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isFocused]);

  const toolbarButtons = [
    { icon: Undo, command: "undo", label: "Undo" },
    { icon: Redo, command: "redo", label: "Redo" },
    { type: "separator" },
    { icon: Heading1, command: "formatBlock", value: "<h1>", label: "Heading 1" },
    { icon: Heading2, command: "formatBlock", value: "<h2>", label: "Heading 2" },
    { icon: Heading3, command: "formatBlock", value: "<h3>", label: "Heading 3" },
    { type: "separator" },
    { icon: Bold, command: "bold", label: "Bold" },
    { icon: Italic, command: "italic", label: "Italic" },
    { icon: Underline, command: "underline", label: "Underline" },
    { type: "separator" },
    { icon: AlignLeft, command: "justifyLeft", label: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", label: "Align Center" },
    { icon: AlignRight, command: "justifyRight", label: "Align Right" },
    { type: "separator" },
    { icon: List, command: "insertUnorderedList", label: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", label: "Numbered List" },
    { type: "separator" },
    { icon: Quote, command: "formatBlock", value: "<blockquote>", label: "Quote" },
    { icon: Code, command: "formatBlock", value: "<pre>", label: "Code Block" },
    { type: "separator" },
    { icon: LinkIcon, action: insertLink, label: "Insert Link" },
    { icon: ImageIcon, action: insertImage, label: "Insert Image" },
  ];

  return (
    <div className={cn("border rounded-2xl overflow-hidden bg-white", className)}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        {toolbarButtons.map((button, index) => {
          if (button.type === "separator") {
            return <div key={index} className="w-px bg-gray-200 mx-1" />;
          }

          const Icon = button.icon!;
          return (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-200"
              onClick={() => {
                if (button.action) {
                  button.action();
                } else {
                  execCommand(button.command!, button.value);
                }
              }}
              title={button.label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        dir="ltr"
        className={cn(
          "p-6 outline-none prose prose-sm max-w-none",
          "focus:ring-0",
          !value && !isFocused && "text-gray-400"
        )}
        style={{ minHeight }}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        suppressContentEditableWarning
      />
    </div>
  );
}
