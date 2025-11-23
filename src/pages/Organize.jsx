import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Grid, ArrowDown, Loader2, X, ArrowLeft, ArrowRight } from 'lucide-react';
import FileUploader from '../components/FileUploader';
import { useToast } from '../components/Toast';

// Ensure worker is set (might be redundant if already set in Convert, but good for safety)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const Organize = () => {
    const { addToast } = useToast();
    const [file, setFile] = useState(null);
    const [pages, setPages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSelected = async (files) => {
        if (files.length > 0) {
            setFile(files[0]);
            await loadPages(files[0]);
        }
    };

    const loadPages = async (file) => {
        setIsLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument(arrayBuffer);
            const pdf = await loadingTask.promise;

            const loadedPages = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.5 }); // Thumbnail scale

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                loadedPages.push({
                    pageIndex: i - 1, // 0-based index for pdf-lib
                    originalIndex: i, // 1-based for display
                    thumbnail: canvas.toDataURL()
                });
            }
            setPages(loadedPages);
        } catch (error) {
            console.error('Error loading pages:', error);
            addToast('Failed to load PDF pages.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const movePage = (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === pages.length - 1)) return;

        setPages(prev => {
            const newPages = [...prev];
            const temp = newPages[index];
            newPages[index] = newPages[index + direction];
            newPages[index + direction] = temp;
            return newPages;
        });
    };

    const removePage = (index) => {
        setPages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!file || pages.length === 0) return;

        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const srcPdf = await PDFDocument.load(arrayBuffer);
            const newPdf = await PDFDocument.create();

            const pageIndices = pages.map(p => p.pageIndex);
            const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);

            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `organized-${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            addToast('PDF organized successfully!', 'success');
        } catch (error) {
            console.error('Error saving PDF:', error);
            addToast('Failed to save PDF.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Organize PDF</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Reorder or remove pages from your PDF.
                </p>
            </div>

            {!file ? (
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <FileUploader onFilesSelected={handleFileSelected} multiple={false} label="Drop PDF to organize" />
                </div>
            ) : (
                <div>
                    <div className="card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 600 }}>{file.name}</div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn"
                                onClick={() => { setFile(null); setPages([]); }}
                                style={{ border: '1px solid var(--border)' }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSave}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Save & Download <ArrowDown size={20} style={{ marginLeft: '0.5rem' }} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                            <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading pages...</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            {pages.map((page, index) => (
                                <div key={index} className="card" style={{ padding: '0.5rem', position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '0.5rem',
                                        left: '0.5rem',
                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '0.25rem',
                                        fontSize: '0.75rem'
                                    }}>
                                        Page {page.originalIndex}
                                    </div>
                                    <button
                                        onClick={() => removePage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '0.5rem',
                                            right: '0.5rem',
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            padding: '0.25rem',
                                            borderRadius: '0.25rem',
                                            display: 'flex'
                                        }}
                                    >
                                        <X size={16} />
                                    </button>

                                    <img src={page.thumbnail} alt={`Page ${page.originalIndex}`} style={{ width: '100%', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />

                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button
                                            onClick={() => movePage(index, -1)}
                                            disabled={index === 0}
                                            className="btn"
                                            style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--border)' }}
                                        >
                                            <ArrowLeft size={16} />
                                        </button>
                                        <button
                                            onClick={() => movePage(index, 1)}
                                            disabled={index === pages.length - 1}
                                            className="btn"
                                            style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--border)' }}
                                        >
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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

export default Organize;
