import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import Delta from 'quill-delta';

const Embed = Quill.import('blots/block/embed');

class IframeBlot extends Embed {
  static create(iframeHTML) {
    const node = super.create();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = iframeHTML;
    const iframe = tempDiv.querySelector('iframe');
    if (iframe) {
      node.setAttribute('width', '560');
      node.setAttribute('height', '315');
      node.setAttribute('frameborder', '0');
      Array.from(iframe.attributes).forEach(attr => {
        node.setAttribute(attr.name, attr.value);
      });
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

const Icons = Quill.import('ui/icons');
Icons.iframe = `<svg viewBox="0 0 18 18">
  <rect class="ql-stroke" height="15" width="20" x="1" y="3"></rect>
  <line class="ql-stroke" x1="7" x2="11" y1="9" y2="9"></line>
</svg>`;

const ALLOWED_DOMAINS = [
  'youtube.com',
  'youtu.be',
  'maps.google.com',
];

const bindings = {
  'custom-backspace': {
    key: 'backspace',
    handler: function(range) {
      if (range.index === 0) return true;
      const [prevBlot, _] = this.quill.getLeaf(range.index - 1);
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
      const [nextBlot, _] = this.quill.getLeaf(range.index);
      if (nextBlot instanceof IframeBlot) {
        this.quill.deleteText(range.index, 1, Quill.sources.USER);
        return false;
      }
      return true;
    }
  }
};

const clipboardMatchers = [
  ['iframe', (node, delta) => {
    const iframeHtml = node.outerHTML;
    if (!iframeHtml || !iframeHtml.includes('<iframe')) {
      return delta;
    }
    return new Delta().insert({ iframe: iframeHtml });
  }]
];

Icons.video = `<svg viewBox="0 0 18 18">
  <polygon class="ql-stroke" points="5 3 15 9 5 15 5 3"></polygon>
</svg>`;

// helper for handling URLs
function getEmbedUrl(videoUrl) {
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    const videoId = videoUrl.split('v=')[1] || videoUrl.split('youtu.be/')[1];
    if (!videoId) throw new Error('Invalid YouTube URL');
    return `https://www.youtube.com/embed/${videoId.split('&')[0]}`;
    const videoId = videoUrl.split('vimeo.com/')[1];
    if (!videoId) throw new Error('Invalid Vimeo URL');
    return `https://player.vimeo.com/video/${videoId}`;
  }
  throw new Error('URL is not from a supported domain');
}

// helper for errors
function displayError(message) {
  alert(message || 'Invalid embed.');
}

export const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'iframe', 'video'],
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
            const tempFragment = document.createDocumentFragment();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = embedCode;
            tempFragment.appendChild(tempDiv);
            const iframe = tempDiv.querySelector('iframe');
            const src = iframe?.getAttribute('src');
            const isAllowed = ALLOWED_DOMAINS.some(domain => src && src.includes(domain));
            if (!isAllowed) {
              throw new Error('Domain not allowed');
            }
            const range = this.quill.getSelection(true);
            this.quill.insertEmbed(range.index, 'iframe', embedCode, Quill.sources.USER);
            this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
          } catch (error) {
            displayError(error.message);
          }
        }
      },
      video: function() {
        const videoUrl = prompt('Enter the video URL:');
        if (videoUrl) {
          try {
            const embedUrl = getEmbedUrl(videoUrl);
            const iframeHtml = `<iframe src="${embedUrl}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;
            const range = this.quill.getSelection(true);
            this.quill.insertEmbed(range.index, 'iframe', iframeHtml, Quill.sources.USER);
            this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
          } catch (error) {
            displayError(error.message);
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
  'iframe',
  'video'
];

export const quillStyles = `
.ql-iframe {
  width: 15px;
  height: 15px;
}

.ql-editor iframe {
  max-width: 100%;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.ql-editor .ql-video {
  position: relative;
  padding-bottom: 60%;
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
  const [editorContent, setEditorContent] = useState(initialContent || '');

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const iframeMatcher = (node, delta) => {
        const iframeHtml = node.outerHTML;
        return new Delta().insert({ iframe: iframeHtml });
      };
      quill.clipboard.addMatcher('IFRAME', iframeMatcher);
      const delta = quill.clipboard.convert(initialContent || '');
      quill.setContents(delta, 'silent');
      return () => {
        quill.clipboard.matchers = quill.clipboard.matchers.filter(matcher => matcher[1] !== iframeMatcher);
      };
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
