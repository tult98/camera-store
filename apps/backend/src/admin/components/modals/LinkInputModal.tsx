import React, { useState, useEffect } from "react";
import { Button, Input, Label, Select, Text } from "@medusajs/ui";
import { X } from "lucide-react";

interface LinkInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { type: 'link' | 'video'; url: string; text?: string }) => void;
  initialUrl?: string;
  initialText?: string;
}

export const LinkInputModal: React.FC<LinkInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = "",
  initialText = "",
}) => {
  const [type, setType] = useState<'link' | 'video'>('link');
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
      setError(null);
      
      // Auto-detect video URL
      if (initialUrl && (
        initialUrl.includes('youtube.com') || 
        initialUrl.includes('youtu.be') || 
        initialUrl.includes('vimeo.com')
      )) {
        setType('video');
      }
    }
  }, [isOpen, initialUrl, initialText]);

  const validateUrl = (urlString: string): boolean => {
    if (!urlString) return false;
    
    try {
      const urlObj = new URL(urlString);
      
      if (type === 'video') {
        // Validate video URLs
        const isYoutube = urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be');
        const isVimeo = urlObj.hostname.includes('vimeo.com');
        
        if (!isYoutube && !isVimeo) {
          setError('Please enter a valid YouTube or Vimeo URL');
          return false;
        }
      }
      
      return true;
    } catch {
      setError('Please enter a valid URL');
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUrl(url)) {
      return;
    }

    if (type === 'link' && !text) {
      setError('Please enter link text');
      return;
    }

    onSubmit({ type, url, text: type === 'link' ? text : undefined });
    handleClose();
  };

  const handleClose = () => {
    setUrl("");
    setText("");
    setType('link');
    setError(null);
    onClose();
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError(null);
    
    // Auto-detect video URL
    if (newUrl && (
      newUrl.includes('youtube.com') || 
      newUrl.includes('youtu.be') || 
      newUrl.includes('vimeo.com')
    )) {
      setType('video');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Insert Link or Video</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-type" className="mb-2">
                Type
              </Label>
              <Select
                value={type}
                onValueChange={(value) => {
                  setType(value as 'link' | 'video');
                  setError(null);
                }}
              >
                <Select.Trigger id="link-type">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="link">
                    <Text>Hyperlink</Text>
                  </Select.Item>
                  <Select.Item value="video">
                    <Text>Video (YouTube/Vimeo)</Text>
                  </Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div>
              <Label htmlFor="link-url" className="mb-2">
                {type === 'video' ? 'Video URL' : 'URL'}
              </Label>
              <Input
                id="link-url"
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder={
                  type === 'video' 
                    ? "https://www.youtube.com/watch?v=..." 
                    : "https://example.com"
                }
                required
              />
              {type === 'video' && (
                <Text size="small" className="mt-1 text-gray-500">
                  Supports YouTube and Vimeo videos
                </Text>
              )}
            </div>

            {type === 'link' && (
              <div>
                <Label htmlFor="link-text" className="mb-2">
                  Link Text
                </Label>
                <Input
                  id="link-text"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Click here"
                  required
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <Text size="small" className="text-red-600">
                  {error}
                </Text>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Insert {type === 'video' ? 'Video' : 'Link'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};