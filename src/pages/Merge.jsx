import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileText, X, ArrowDown, Loader2 } from 'lucide-react';
import FileUploader from '../components/FileUploader';

const Merge = () => {
    const [files, setFiles] = useState([]);
    const [isMerging, setIsMerging] = useState(false);

    const handleFilesSelected = (newFiles) => {
        setFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveFile = (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === files.length - 1)) return;

        setFiles(prev => {
            const newFiles = [...prev];
            const temp = newFiles[index];
            newFiles[index] = newFiles[index + direction];
            newFiles[index + direction] = temp;
            return newFiles;
        });
    };

    const handleMerge = async () => {
        if (files.length < 2) return;

        setIsMerging(true);
        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const fileBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(fileBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'merged-document.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error merging PDFs:', error);
            alert('Failed to merge PDFs. Please try again.');
        } finally {
            setIsMerging(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Merge PDFs</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Combine multiple PDF files into one. Drag and drop to reorder.
                </p>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <FileUploader onFilesSelected={handleFilesSelected} label="Drop PDFs to merge" />
            </div>

            {files.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {files.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="card" style={{
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: 'var(--background)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: 'var(--surface)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary)'
                                }}>
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 500 }}>{file.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button
                                    onClick={() => moveFile(index, -1)}
                                    disabled={index === 0}
                                    style={{ padding: '0.5rem', color: index === 0 ? 'var(--border)' : 'var(--text-secondary)' }}
                                >
                                    ↑
                                </button>
                                <button
                                    onClick={() => moveFile(index, 1)}
                                    disabled={index === files.length - 1}
                                    style={{ padding: '0.5rem', color: index === files.length - 1 ? 'var(--border)' : 'var(--text-secondary)' }}
                                >
                                    ↓
                                </button>
                                <button
                                    onClick={() => removeFile(index)}
                                    style={{ padding: '0.5rem', color: '#ef4444' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleMerge}
                            disabled={files.length < 2 || isMerging}
                            style={{
                                opacity: files.length < 2 || isMerging ? 0.5 : 1,
                                cursor: files.length < 2 || isMerging ? 'not-allowed' : 'pointer',
                                minWidth: '150px'
                            }}
                        >
                            {isMerging ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                                    Merging...
                                </>
                            ) : (
                                <>
                                    Merge PDFs <ArrowDown size={20} style={{ marginLeft: '0.5rem' }} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Merge;
