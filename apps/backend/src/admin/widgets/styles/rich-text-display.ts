export const richTextDisplayStyles = `
  .rich-text-display h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }
  .rich-text-display h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .rich-text-display h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .rich-text-display p {
    margin-bottom: 0.75rem;
    line-height: 1.6;
  }
  .rich-text-display ul,
  .rich-text-display ol {
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
  }
  .rich-text-display ul {
    list-style-type: disc;
  }
  .rich-text-display ol {
    list-style-type: decimal;
  }
  .rich-text-display ul ul {
    list-style-type: circle;
  }
  .rich-text-display ul ul ul {
    list-style-type: square;
  }
  .rich-text-display li {
    margin-bottom: 0.25rem;
    display: list-item;
  }
  .rich-text-display blockquote {
    padding-left: 1rem;
    border-left: 3px solid #e2e8f0;
    margin: 1rem 0;
    font-style: italic;
    color: #64748b;
  }
  .rich-text-display code {
    background-color: #f1f5f9;
    color: #e11d48;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: monospace;
  }
  .rich-text-display pre {
    background-color: #1e293b;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-bottom: 0.75rem;
  }
  .rich-text-display pre code {
    background: none;
    color: inherit;
    padding: 0;
  }
  .rich-text-display hr {
    border: none;
    border-top: 2px solid #e2e8f0;
    margin: 1.5rem 0;
  }
  .rich-text-display img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }
  .rich-text-display a {
    color: #8b5cf6;
    text-decoration: underline;
  }
  .rich-text-display strong {
    font-weight: 600;
  }
  .rich-text-display em {
    font-style: italic;
  }
  
  /* Video embed styles for display mode */
  .rich-text-display iframe[src*="youtube"],
  .rich-text-display iframe[src*="vimeo"],
  .rich-text-display div[data-youtube-video] {
    width: 100%;
    max-width: 640px;
    aspect-ratio: 16 / 9;
    border-radius: 0.5rem;
    margin: 1rem 0;
    border: none;
  }
  
  .rich-text-display div[data-youtube-video] {
    position: relative;
    background: #000;
    overflow: hidden;
  }
  
  .rich-text-display div[data-youtube-video] iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;