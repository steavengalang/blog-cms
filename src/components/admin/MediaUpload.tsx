import React, { useState, useRef, useCallback } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import {
  PhotoIcon,
  DocumentIcon,
  VideoCameraIcon,
  CloudArrowUpIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: number;
  uploadedAt: string;
  alt?: string;
  caption?: string;
}

interface MediaUploadProps {
  className?: string;
  onFileSelect?: (files: MediaFile[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  className = '',
  onFileSelect,
  multiple = true,
  accept = 'image/*,video/*,.pdf,.doc,.docx',
  maxSize = 10
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = async (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      const isValidType = accept.split(',').some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type || file.name.endsWith(type.slice(1));
      });

      const isValidSize = file.size <= maxSize * 1024 * 1024;

      if (!isValidType) {
        console.warn(`File ${file.name} has unsupported type: ${file.type}`);
      }
      if (!isValidSize) {
        console.warn(`File ${file.name} is too large: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      }

      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    const newFiles: MediaFile[] = [];

    for (const file of validFiles) {
      try {
        const fileId = `file-${Date.now()}-${Math.random()}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setUploadProgress(prev => ({ ...prev, [fileId]: i }));
        }

        const mediaFile: MediaFile = {
          id: fileId,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
          url: URL.createObjectURL(file),
          size: file.size,
          uploadedAt: new Date().toISOString(),
          alt: file.name,
          caption: ''
        };

        newFiles.push(mediaFile);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
    setIsUploading(false);
    setUploadProgress({});

    if (onFileSelect) {
      onFileSelect(multiple ? [...files, ...newFiles] : newFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const updateFileMetadata = (fileId: string, field: 'alt' | 'caption', value: string) => {
    setFiles(prev => prev.map(file =>
      file.id === fileId ? { ...file, [field]: value } : file
    ));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="w-8 h-8 text-blue-500" />;
      case 'video':
        return <VideoCameraIcon className="w-8 h-8 text-purple-500" />;
      case 'document':
        return <DocumentIcon className="w-8 h-8 text-green-500" />;
      default:
        return <DocumentIcon className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-900">
            Drop files here or click to upload
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Supports images, videos, and documents up to {maxSize}MB
          </p>
        </div>
        <div className="mt-6">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="primary"
            disabled={isUploading}
          >
            <CloudArrowUpIcon className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Choose Files'}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Uploading...</span>
                <span className="text-gray-500">{progress}%</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Uploaded Files ({files.length})
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* File Preview */}
                <div className="flex items-center space-x-3 mb-3">
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.alt || file.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                    <Badge variant="default" className="mt-1">
                      {file.type}
                    </Badge>
                  </div>
                </div>

                {/* File Metadata */}
                <div className="space-y-2">
                  <Input
                    placeholder="Alt text"
                    value={file.alt || ''}
                    onChange={(e) => updateFileMetadata(file.id, 'alt', e.target.value)}
                    size={16}
                  />
                  <Input
                    placeholder="Caption"
                    value={file.caption || ''}
                    onChange={(e) => updateFileMetadata(file.id, 'caption', e.target.value)}
                    size={16}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <EyeIcon className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="danger"
                      size="xs"
                      onClick={() => removeFile(file.id)}
                    >
                      <TrashIcon className="w-3 h-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
