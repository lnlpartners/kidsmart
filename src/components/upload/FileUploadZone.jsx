
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Camera, FileText, X, Plus } from "lucide-react";

export default function FileUploadZone({ onFileSelect, selectedFiles = [] }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = React.useState(false);

  const validateFile = (file) => {
    // Check file type
    const supportedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf'
    ];
    
    // Also check file extension (case-insensitive) as backup, as file.type can be unreliable
    const fileName = file.name.toLowerCase();
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];
    const hasValidExtension = supportedExtensions.some(ext => fileName.endsWith(ext));
    
    // Return true if type is supported OR extension is supported
    return supportedTypes.includes(file.type) || hasValidExtension;
  };

  const handleDrag = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);

    // Check for oversized files
    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 5MB limit
    const oversizedFiles = files.filter(f => f.size > MAX_FILE_SIZE_BYTES); 
    if (oversizedFiles.length > 0) {
      alert(`These files are too large (> ${MAX_FILE_SIZE_MB}MB): ${oversizedFiles.map(f => f.name).join(', ')}\nPlease compress or resize them before uploading.`);
      return; // Stop processing if any file is oversized
    }
    
    const validFiles = files.filter(validateFile);
    const invalidFiles = files.filter(file => !validateFile(file));
    
    if (invalidFiles.length > 0) {
      alert(`Unsupported file types: ${invalidFiles.map(f => f.name).join(', ')}\nSupported: JPG, JPEG, PNG, GIF, WEBP, PDF`);
    }
    
    if (validFiles.length > 0) {
      // Add new files to existing ones
      const combinedFiles = [...selectedFiles, ...validFiles];
      onFileSelect(combinedFiles);
    }
  }, [onFileSelect, selectedFiles]);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    
    // Log file sizes for debugging
    files.forEach(f => console.log(`Selected ${f.name}: ${(f.size / 1024 / 1024).toFixed(2)} MB`));
    
    // Check for oversized files
    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 5MB limit
    const oversizedFiles = files.filter(f => f.size > MAX_FILE_SIZE_BYTES); 
    if (oversizedFiles.length > 0) {
      alert(`These files are too large (> ${MAX_FILE_SIZE_MB}MB): ${oversizedFiles.map(f => f.name).join(', ')}\nPlease compress or resize them before uploading.`);
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return; // Stop processing if any file is oversized
    }
    
    const validFiles = files.filter(validateFile);
    const invalidFiles = files.filter(file => !validateFile(file));
    
    if (invalidFiles.length > 0) {
      alert(`Unsupported file types: ${invalidFiles.map(f => f.name).join(', ')}\nSupported: JPG, JPEG, PNG, GIF, WEBP, PDF`);
    }
    
    if (validFiles.length > 0) {
      // Add new files to existing ones instead of replacing
      const combinedFiles = [...selectedFiles, ...validFiles];
      onFileSelect(combinedFiles);
    }
    
    // Reset the input so the same file can be selected again if needed
    // Using fileInputRef.current.value directly ensures it's reset even if e.target is not available later
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    onFileSelect(updatedFiles);
  };

  const handleAddMoreFiles = () => {
    if (fileInputRef.current) {
      // Ensure the input is reset and ready to accept new files
      fileInputRef.current.value = '';
      // Small delay to ensure the reset is processed, sometimes necessary for file inputs
      setTimeout(() => {
        fileInputRef.current.click();
      }, 10);
    }
  };

  if (selectedFiles.length > 0) {
    return (
      <div className="space-y-4">
        {selectedFiles.map((file, index) => (
          <Card key={index} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{file.name}</h3>
                  <p className="text-sm text-gray-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemoveFile(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
        
        {/* Add more files button */}
        <Card className="p-4 border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 transition-colors">
          <Button
            variant="outline"
            onClick={handleAddMoreFiles}
            className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <Plus className="w-4 h-4" />
            Add More Files ({selectedFiles.length} selected)
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
        dragActive 
          ? "border-blue-400 bg-blue-50" 
          : "border-gray-300 hover:border-gray-400 bg-gray-50"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
          <Upload className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Homework Images or PDFs
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your files here, or click to browse. You can select multiple files.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Mobile camera capture
              if (fileInputRef.current) {
                // Ensure the input is reset before setting capture, to avoid issues
                fileInputRef.current.value = '';
                fileInputRef.current.setAttribute('capture', 'environment');
                fileInputRef.current.click();
              }
            }}
          >
            <Camera className="w-4 h-4 mr-2" />
            Take Photo
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          Supports: JPG, PNG, PDF • Max size: 5MB per file • Multiple files allowed
        </p>
      </div>
    </div>
  );
}
