import React, { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import Delta from 'quill-delta';

// Register iframe format
const Embed = Quill.import('blots/block/embed');

class IframeBlot extends Embed {
  static create(iframeHTML) {
    const node = super.create();

    // Parse the iframe HTML to get attributes
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = iframeHTML;
    const iframe = tempDiv.querySelector('iframe');

    if (iframe) {
      // Copy all attributes from the parsed iframe
      Array.from(iframe.attributes).forEach(attr => {
        node.setAttribute(attr.name, attr.value);
      });

      // Ensure some basic attributes are set
      if (!node.getAttribute('width')) node.setAttribute('width', '560');
      if (!node.getAttribute('height')) node.setAttribute('height', '315');
      if (!node.getAttribute('frameborder')) node.setAttribute('frameborder', '0');
    }

    return node;
  }

  static value(node) {
    return node.outerHTML;
  }
}

IframeBlot.blotName = 'iframe';
IframeBlot.tagName = 'iframe';
Quill.register({
  'formats/iframe': IframeBlot
});

// Add custom icon for iframe button
const Icons = Quill.import('ui/icons');
Icons.iframe = `<svg viewBox="0 0 18 18">
  <rect class="ql-stroke" height="12" width="16" x="1" y="3"></rect>
  <line class="ql-stroke" x1="7" x2="11" y1="9" y2="9"></line>
</svg>`;

const ALLOWED_DOMAINS = [
  'youtube.com',
  'youtube-nocookie.com',
  'vimeo.com',
  'maps.google.com',
];

// Custom keyboard bindings
const bindings = {
  'custom-backspace': {
    key: 'backspace',
    handler: function(range) {
      if (range.index === 0) return true;
      const [prevBlot] = this.quill.getLeaf(range.index - 1);
      if (prevBlot instanceof IframeBlot) {
        this.quill.deleteText(range.index - 1, 1, Quill.sources.USER);
        return false;
      }
      return true;
    }
  },
  'custom-delete': {
    key: 'delete',
    handler: function(range) {
      const [nextBlot] = this.quill.getLeaf(range.index);
      if (nextBlot instanceof IframeBlot) {
        this.quill.deleteText(range.index, 1, Quill.sources.USER);
        return false;
      }
      return true;
    }
  }
};

// Clipboard matchers for iframe elements
const clipboardMatchers = [
  ['iframe', (node, delta) => {
    const iframeHtml = node.outerHTML;
    return new Delta().insert({ iframe: iframeHtml });
  }]
];

// Quill configuration
export const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'iframe'],
      ['clean']
    ],
    handlers: {
      iframe: function() {
        const embedCode = prompt('Paste the embed code (iframe):');
        if (embedCode) {
          try {
            if (!embedCode.includes('<iframe') || !embedCode.includes('</iframe>')) {
              throw new Error('Invalid iframe code');
            }

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = embedCode;
            const iframe = tempDiv.querySelector('iframe');
            const src = iframe.getAttribute('src');

            const isAllowed = ALLOWED_DOMAINS.some(domain =>
              src && src.includes(domain)
            );

            if (!isAllowed) {
              throw new Error('Domain not allowed');
            }

            const range = this.quill.getSelection(true);
            this.quill.insertEmbed(range.index, 'iframe', embedCode, Quill.sources.USER);
            this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
          } catch (error) {
            alert(
              "Invalid embed code or domain not allowed. Please ensure you're copying the full iframe code from a trusted source."
            );
          }
        }
      }
    }
  },
  clipboard: {
    matchVisual: false,
    matchers: clipboardMatchers
  },
  keyboard: {
    bindings: bindings
  }
};

export const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link',
  'iframe'
];

export const quillStyles = `
.ql-iframe {
  width: 18px;
  height: 18px;
}

.ql-editor iframe {
  max-width: 100%;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.ql-editor .ql-video {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}

.ql-editor .ql-video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
`;

function MyEditor({ initialContent }) {
  const quillRef = useRef(null);
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();

      // Add the iframe matcher to the clipboard
      quill.clipboard.addMatcher('IFRAME', function(node, delta) {
        const iframeHtml = node.outerHTML;
        return new Delta().insert({ iframe: iframeHtml });
      });

      // Process the initial content
      const delta = quill.clipboard.convert(initialContent || '');
      quill.setContents(delta, 'silent');
    }
  }, [initialContent]);

  return (
    <>
      <style>{quillStyles}</style>
      <ReactQuill
        ref={quillRef}
        value={editorContent}
        onChange={setEditorContent}
        modules={quillModules}
        formats={quillFormats}
      />
    </>
  );
}

export default MyEditor;
