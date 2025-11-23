import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Scissors, ArrowDown, Loader2, FileText, X } from 'lucide-react';
import FileUploader from '../components/FileUploader';

const Split = () => {
    const [file, setFile] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [splitMode, setSplitMode] = useState('range'); // 'range' or 'extract'
    const [rangeStart, setRangeStart] = useState(1);
    const [rangeEnd, setRangeEnd] = useState(1);
    const [extractPages, setExtractPages] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelected = async (files) => {
        if (files.length > 0) {
            const selectedFile = files[0];
            setFile(selectedFile);

            try {
                const arrayBuffer = await selectedFile.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                setPageCount(pdf.getPageCount());
                setRangeEnd(pdf.getPageCount());
            } catch (error) {
                console.error('Error loading PDF:', error);
                alert('Invalid PDF file.');
                setFile(null);
            }
        }
    };

    const handleSplit = async () => {
        if (!file) return;

        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const srcPdf = await PDFDocument.load(arrayBuffer);
            const newPdf = await PDFDocument.create();

            let pageIndices = [];

            if (splitMode === 'range') {
                const start = Math.max(1, Math.min(rangeStart, pageCount));
                const end = Math.max(start, Math.min(rangeEnd, pageCount));

                for (let i = start; i <= end; i++) {
                    pageIndices.push(i - 1); // 0-based index
                }
            } else {
                // Extract specific pages (comma separated)
                const pages = extractPages.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
                pageIndices = pages.map(p => p - 1).filter(p => p >= 0 && p < pageCount);
            }

            if (pageIndices.length === 0) {
                alert('No valid pages selected.');
                setIsProcessing(false);
                return;
            }

            const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `split-${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error splitting PDF:', error);
            alert('Failed to split PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Split PDF</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Extract pages or split a PDF file by range.
                </p>
            </div>

            {!file ? (
                <div className="card">
                    <FileUploader onFilesSelected={handleFileSelected} multiple={false} label="Drop PDF to split" />
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
                                color: '#ef4444',
                                border: '1px solid var(--border)'
                            }}>
                                <FileText size={24} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{file.name}</div>
                                <div style={{ color: 'var(--text-secondary)' }}>{pageCount} pages</div>
                            </div>
                        </div>
                        <button onClick={() => setFile(null)} style={{ color: 'var(--text-secondary)', padding: '0.5rem' }}>
                            <X size={24} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <button
                            className="btn"
                            style={{
                                flex: 1,
                                backgroundColor: splitMode === 'range' ? 'var(--primary)' : 'var(--surface)',
                                color: splitMode === 'range' ? 'white' : 'var(--text)',
                                border: splitMode === 'range' ? 'none' : '1px solid var(--border)'
                            }}
                            onClick={() => setSplitMode('range')}
                        >
                            Split by Range
                        </button>
                        <button
                            className="btn"
                            style={{
                                flex: 1,
                                backgroundColor: splitMode === 'extract' ? 'var(--primary)' : 'var(--surface)',
                                color: splitMode === 'extract' ? 'white' : 'var(--text)',
                                border: splitMode === 'extract' ? 'none' : '1px solid var(--border)'
                            }}
                            onClick={() => setSplitMode('extract')}
                        >
                            Extract Pages
                        </button>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        {splitMode === 'range' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>From Page</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={pageCount}
                                        value={rangeStart}
                                        onChange={(e) => setRangeStart(parseInt(e.target.value))}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius)',
                                            border: '1px solid var(--border)',
                                            backgroundColor: 'var(--background)',
                                            color: 'var(--text)'
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>To Page</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={pageCount}
                                        value={rangeEnd}
                                        onChange={(e) => setRangeEnd(parseInt(e.target.value))}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius)',
                                            border: '1px solid var(--border)',
                                            backgroundColor: 'var(--background)',
                                            color: 'var(--text)'
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Page Numbers (e.g., 1, 3, 5-7)</label>
                                <input
                                    type="text"
                                    placeholder="1, 3, 5"
                                    value={extractPages}
                                    onChange={(e) => setExtractPages(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--background)',
                                        color: 'var(--text)'
                                    }}
                                />
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    Enter page numbers separated by commas.
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem' }}
                        onClick={handleSplit}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="animate-spin" size={20} style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                                Processing...
                            </>
                        ) : (
                            <>
                                Download Split PDF <ArrowDown size={20} style={{ marginLeft: '0.5rem' }} />
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

export default Split;
