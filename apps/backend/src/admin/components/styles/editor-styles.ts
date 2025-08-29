export const editorStyles = `
  .ProseMirror {
    min-height: var(--editor-min-height, 200px);
    max-height: var(--editor-max-height, 500px);
    overflow-y: auto;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    outline: none;
  }
  
  .ProseMirror:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  .ProseMirror.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    color: #9ca3af;
    float: left;
    height: 0;
    pointer-events: none;
  }
  
  .ProseMirror h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }
  
  .ProseMirror h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .ProseMirror h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .ProseMirror p {
    margin-bottom: 0.75rem;
    line-height: 1.6;
  }
  
  .ProseMirror ul,
  .ProseMirror ol {
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  .ProseMirror li {
    margin-bottom: 0.25rem;
  }
  
  .ProseMirror blockquote {
    padding-left: 1rem;
    border-left: 3px solid #e2e8f0;
    margin: 1rem 0;
    font-style: italic;
    color: #64748b;
  }
  
  .ProseMirror code {
    background-color: #f1f5f9;
    color: #e11d48;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: monospace;
  }
  
  .ProseMirror pre {
    background-color: #1e293b;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-bottom: 0.75rem;
  }
  
  .ProseMirror pre code {
    background: none;
    color: inherit;
    padding: 0;
  }
  
  .ProseMirror hr {
    border: none;
    border-top: 2px solid #e2e8f0;
    margin: 1.5rem 0;
  }
  
  .ProseMirror img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }
`;