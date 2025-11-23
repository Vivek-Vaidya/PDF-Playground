import React, { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';

const FileUploader = ({ onFilesSelected, accept = "application/pdf", multiple = true, label = "Drop PDF files here" }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(file =>
            accept === "*" || file.type === accept || file.name.endsWith('.pdf') // Basic check
        );

        if (files.length > 0) {
            onFilesSelected(files);
        }
    }, [onFilesSelected, accept]);

    const handleFileInput = useCallback((e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            onFilesSelected(files);
        }
        // Reset value to allow selecting same file again
        e.target.value = null;
    }, [onFilesSelected]);

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
                border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                padding: '3rem',
                textAlign: 'center',
                backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.05)' : 'var(--surface)',
                transition: 'all 0.2s',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
            }}
            onClick={() => document.getElementById('file-input').click()}
        >
            <input
                type="file"
                id="file-input"
                multiple={multiple}
                accept={accept}
                onChange={handleFileInput}
                style={{ display: 'none' }}
            />
            <div style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                backgroundColor: 'var(--background)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
            }}>
                <Upload size={32} />
            </div>
            <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{label}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>or click to browse</p>
            </div>
        </div>
    );
};

export default FileUploader;
