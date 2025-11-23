# PDF Playground

**PDF Playground** is a client-side React web application that allows you to merge, split, and convert PDF files directly in your browser.

> [!NOTE]
> All file processing happens entirely in your browser. No files are uploaded to any server, ensuring complete privacy and security.

## Features

### 1. Merge PDFs
- **Drag & Drop**: Upload multiple PDF files easily.
- **Reorder**: Arrange files in your desired order.
- **Merge**: Combine multiple PDFs into a single document instantly.

### 2. Split PDF
- **Range Split**: Extract a specific range of pages (e.g., 1-5).
- **Extract Pages**: Extract individual pages (e.g., 1, 3, 5).
- **Preview**: View file details before splitting.

### 3. Convert
- **Images to PDF**: Convert PNG/JPG images into a single PDF file.
- **PDF to Images**: Convert PDF pages into high-quality PNG images.

## Technical Details

- **Framework**: React + Vite
- **PDF Processing**: `pdf-lib` for manipulation, `pdfjs-dist` for rendering.
- **Styling**: Vanilla CSS with modern, responsive design.
- **Privacy**: 100% Client-Side processing.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Vivek-Vaidya/PDF-Playground.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## License

MIT
