import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { EditorProps } from '../../types';

const RichTextEditor: React.FC<EditorProps> = ({ value, onChange, placeholder = 'Start writing your content...' }) => {
  const quillRef = useRef<ReactQuill>(null);

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  // Quill formats configuration
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'direction',
    'code-block', 'script'
  ];

  // Custom CSS for the editor
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ql-editor {
        min-height: 200px;
        font-size: 16px;
        line-height: 1.6;
      }
      .ql-editor h1 {
        font-size: 2em;
        margin-bottom: 0.5em;
      }
      .ql-editor h2 {
        font-size: 1.5em;
        margin-bottom: 0.5em;
      }
      .ql-editor h3 {
        font-size: 1.25em;
        margin-bottom: 0.5em;
      }
      .ql-editor p {
        margin-bottom: 1em;
      }
      .ql-editor blockquote {
        border-left: 4px solid #e5e7eb;
        padding-left: 1em;
        margin: 1em 0;
        font-style: italic;
        color: #6b7280;
      }
      .ql-editor code {
        background-color: #f3f4f6;
        padding: 0.2em 0.4em;
        border-radius: 0.25em;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      }
      .ql-editor pre {
        background-color: #1f2937;
        color: #f9fafb;
        padding: 1em;
        border-radius: 0.5em;
        overflow-x: auto;
      }
      .ql-editor pre code {
        background-color: transparent;
        color: inherit;
        padding: 0;
      }
      .ql-editor img {
        max-width: 100%;
        height: auto;
        border-radius: 0.5em;
        margin: 1em 0;
      }
      .ql-editor a {
        color: #3b82f6;
        text-decoration: underline;
      }
      .ql-editor a:hover {
        color: #2563eb;
      }
      .ql-toolbar {
        border-top: 1px solid #e5e7eb;
        border-left: 1px solid #e5e7eb;
        border-right: 1px solid #e5e7eb;
        border-bottom: none;
        border-radius: 0.5em 0.5em 0 0;
        background-color: #f9fafb;
      }
      .ql-container {
        border: 1px solid #e5e7eb;
        border-top: none;
        border-radius: 0 0 0.5em 0.5em;
        background-color: white;
      }
      .ql-editor:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleChange = (content: string, _delta: any, _source: any, _editor: any) => {
    onChange(content);
  };

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
};

export default RichTextEditor;
