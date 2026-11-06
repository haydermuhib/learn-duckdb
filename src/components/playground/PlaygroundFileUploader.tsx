import React, { useState, useRef } from 'react';
import { Upload, FileUp, Loader2, AlertCircle } from 'lucide-react';

interface PlaygroundFileUploaderProps {
  onFilesUploaded: (files: File[]) => Promise<void>;
  isUploading: boolean;
}

export const PlaygroundFileUploader: React.FC<PlaygroundFileUploaderProps> = ({
  onFilesUploaded,
  isUploading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setErrorMessage(null);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    await processFiles(droppedFiles);
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length === 0) return;

    await processFiles(selectedFiles);
    e.target.value = '';
  };

  const processFiles = async (files: File[]) => {
    const validExtensions = ['.csv', '.parquet', '.json'];
    const validFiles = files.filter(f =>
      validExtensions.some(ext => f.name.toLowerCase().endsWith(ext))
    );

    if (validFiles.length === 0) {
      setErrorMessage('Please select CSV, Parquet, or JSON files (.csv, .parquet, .json).');
      return;
    }

    try {
      await onFilesUploaded(validFiles);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to import one or more files.');
    }
  };

  return (
    <div className="flex flex-col border-3 border-ink bg-white shadow-brutal p-3">
      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-ink bg-duck-light shadow-inner'
            : 'border-slate-300 hover:border-ink hover:bg-slate-50'
        } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.parquet,.json"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-1.5 text-xs text-ink">
          {isUploading ? (
            <>
              <Loader2 size={24} className="text-amber-600 animate-spin" />
              <span className="font-bold text-xs mt-1">Importing into DuckDB-Wasm...</span>
              <span className="text-[11px] text-ink-muted">Parsing and creating tables</span>
            </>
          ) : (
            <>
              <FileUp size={22} className="text-ink-muted" />
              <p className="font-extrabold text-xs">
                Drag & Drop or <span className="underline decoration-2 text-ink">Browse Files</span>
              </p>
              <p className="text-[10px] text-ink-muted font-mono">
                Supports .csv, .parquet, .json (multi-file)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message if any */}
      {errorMessage && (
        <div className="mt-2 p-2 bg-rose-50 border border-rose-300 text-rose-800 text-[11px] flex items-start gap-1.5">
          <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
