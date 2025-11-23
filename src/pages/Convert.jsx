import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { RefreshCw, Image as ImageIcon, FileText, ArrowDown, Loader2, X } from 'lucide-react';
import FileUploader from '../components/FileUploader';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const Convert = () => {
    const [mode, setMode] = useState('img-to-pdf'); // 'img-to-pdf' or 'pdf-to-img'
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [generatedImages, setGeneratedImages] = useState([]);

    useEffect(() => {
        setFiles([]);
        setGeneratedImages([]);
    }, [mode]);

    const handleFilesSelected = (newFiles) => {
        if (mode === 'img-to-pdf') {
            setFiles(prev => [...prev, ...newFiles]);
        } else {
            // PDF to Image only accepts one file at a time for simplicity
            setFiles([newFiles[0]]);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleImageToPdf = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        try {
            const pdfDoc = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                let image;

                if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                    image = await pdfDoc.embedJpg(arrayBuffer);
                } else if (file.type === 'image/png') {
                    image = await pdfDoc.embedPng(arrayBuffer);
                } else {
                    continue; // Skip unsupported
                }

                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'converted-images.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error converting images to PDF:', error);
            alert('Failed to convert images.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePdfToImage = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        setGeneratedImages([]);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument(arrayBuffer);
            const pdf = await loadingTask.promise;

            const images = [];
            const totalPages = pdf.numPages;

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // High quality

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                const imgData = canvas.toDataURL('image/png');
                images.push({ page: i, data: imgData });
            }

            setGeneratedImages(images);

        } catch (error) {
            console.error('Error converting PDF to images:', error);
            alert('Failed to convert PDF. ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadImage = (data, pageNum) => {
        const link = document.createElement('a');
        link.href = data;
        link.download = `page-${pageNum}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Convert Files</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Convert Images to PDF or PDF to Images.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    className="btn"
                    style={{
                        flex: 1,
                        backgroundColor: mode === 'img-to-pdf' ? 'var(--primary)' : 'var(--surface)',
                        color: mode === 'img-to-pdf' ? 'white' : 'var(--text)',
                        border: mode === 'img-to-pdf' ? 'none' : '1px solid var(--border)'
                    }}
                    onClick={() => setMode('img-to-pdf')}
                >
                    Images to PDF
                </button>
                <button
                    className="btn"
                    style={{
                        flex: 1,
                        backgroundColor: mode === 'pdf-to-img' ? 'var(--primary)' : 'var(--surface)',
                        color: mode === 'pdf-to-img' ? 'white' : 'var(--text)',
                        border: mode === 'pdf-to-img' ? 'none' : '1px solid var(--border)'
                    }}
                    onClick={() => setMode('pdf-to-img')}
                >
                    PDF to Images
                </button>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <FileUploader
                    onFilesSelected={handleFilesSelected}
                    accept={mode === 'img-to-pdf' ? "image/png, image/jpeg, image/jpg" : "application/pdf"}
                    multiple={mode === 'img-to-pdf'}
                    label={mode === 'img-to-pdf' ? "Drop images here" : "Drop PDF here"}
                />
            </div>

            {files.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Selected Files</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {files.map((file, index) => (
                            <div key={index} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {mode === 'img-to-pdf' ? <ImageIcon size={20} /> : <FileText size={20} />}
                                    <span>{file.name}</span>
                                </div>
                                <button onClick={() => removeFile(index)} style={{ color: '#ef4444' }}><X size={20} /></button>
                            </div>
                        ))}
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
                        onClick={mode === 'img-to-pdf' ? handleImageToPdf : handlePdfToImage}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="animate-spin" size={20} style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                                Converting...
                            </>
                        ) : (
                            <>
                                Convert <RefreshCw size={20} style={{ marginLeft: '0.5rem' }} />
                            </>
                        )}
                    </button>
                </div>
            )}

            {generatedImages.length > 0 && (
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Converted Pages</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {generatedImages.map((img) => (
                            <div key={img.page} className="card" style={{ padding: '0.5rem' }}>
                                <img src={img.data} alt={`Page ${img.page}`} style={{ width: '100%', borderRadius: 'var(--radius)', marginBottom: '0.5rem' }} />
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', fontSize: '0.875rem' }}
                                    onClick={() => downloadImage(img.data, img.page)}
                                >
                                    Download Page {img.page}
                                </button>
                            </div>
                        ))}
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

export default Convert;
