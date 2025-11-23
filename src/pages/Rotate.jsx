import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { RotateCw, ArrowDown, Loader2, FileText, X, RotateCcw } from 'lucide-react';
import FileUploader from '../components/FileUploader';
import { useToast } from '../components/Toast';

const Rotate = () => {
    const { addToast } = useToast();
    const [file, setFile] = useState(null);
    const [rotation, setRotation] = useState(90);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelected = (files) => {
        if (files.length > 0) {
            setFile(files[0]);
        }
    };

    const handleRotate = async () => {
        if (!file) return;

        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();

            pages.forEach(page => {
                const currentRotation = page.getRotation().angle;
                page.setRotation(degrees(currentRotation + rotation));
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `rotated-${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            addToast('PDF rotated successfully!', 'success');
        } catch (error) {
            console.error('Error rotating PDF:', error);
            addToast('Failed to rotate PDF.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Rotate PDF</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Rotate all pages in your PDF document.
                </p>
            </div>

            {!file ? (
                <div className="card">
                    <FileUploader onFilesSelected={handleFileSelected} multiple={false} label="Drop PDF to rotate" />
                </div>
            ) : (
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '0.75rem',
                                backgroundColor: 'var(--surface)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#3b82f6',
                                border: '1px solid var(--border)'
                            }}>
                                <FileText size={24} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{file.name}</div>
                                <div style={{ color: 'var(--text-secondary)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                        </div>
                        <button onClick={() => setFile(null)} style={{ color: 'var(--text-secondary)', padding: '0.5rem' }}>
                            <X size={24} />
                        </button>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 500 }}>Rotation Direction</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {[90, 180, 270].map((deg) => (
                                <button
                                    key={deg}
                                    onClick={() => setRotation(deg)}
                                    className="btn"
                                    style={{
                                        flex: 1,
                                        backgroundColor: rotation === deg ? 'var(--primary)' : 'var(--surface)',
                                        color: rotation === deg ? 'white' : 'var(--text)',
                                        border: rotation === deg ? 'none' : '1px solid var(--border)',
                                        padding: '1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <RotateCw size={24} style={{ transform: `rotate(${deg}deg)` }} />
                                    <span>{deg}° Clockwise</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem' }}
                        onClick={handleRotate}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="animate-spin" size={20} style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                                Processing...
                            </>
                        ) : (
                            <>
                                Download Rotated PDF <ArrowDown size={20} style={{ marginLeft: '0.5rem' }} />
                            </>
                        )}
                    </button>
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

export default Rotate;
