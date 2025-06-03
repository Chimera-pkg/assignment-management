"use client"

import { useState } from 'react';
import { FileText, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFViewerProps {
  url: string;
  className?: string;
}

export function PDFViewer({ url, className = "" }: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const openInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`w-full h-full relative ${className}`}>
      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Memuat PDF...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 mx-auto text-destructive" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Tidak dapat memuat PDF</p>
              <p className="text-sm text-muted-foreground">
                File PDF mungkin tidak dapat diakses atau format tidak didukung
              </p>
            </div>
            <Button onClick={openInNewTab} variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Buka di Tab Baru
            </Button>
          </div>
        </div>
      )}

      {/* PDF iframe */}
      <iframe
        src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
        className="w-full h-full border-0"
        title="PDF Viewer"
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: loading || error ? 'none' : 'block' }}
      />

      {/* Fallback link if iframe is not supported */}
      <noscript>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">JavaScript diperlukan</p>
            <Button onClick={openInNewTab} variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Buka PDF di Tab Baru
            </Button>
          </div>
        </div>
      </noscript>
    </div>
  );
}
