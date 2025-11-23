# PDF Playground

**PDF Playground** is a client-side React web application that allows you to merge, split, and convert PDF files directly in your browser.

> [!NOTE]
> All file processing happens entirely in your browser. No files are uploaded to any server, ensuring complete privacy and security.

## Features

### Core Tools
- **Merge PDFs**: Combine multiple PDFs into a single document.
- **Split PDF**: Extract specific pages or split by range.
- **Convert**: 
  - Images to PDF
  - PDF to Images

### Advanced Tools (New)
- **Rotate**: Rotate pages by 90/180/270 degrees.
- **Protect**: Encrypt PDF with a password.
- **Watermark**: Add custom text watermarks with control over opacity, rotation, and color.
- **Organize**: Visual grid to reorder or remove pages within a PDF.

### UI/UX
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive Design**: Works on desktop and mobile.
- **Animations**: Smooth page transitions and interactions.

## Technical Details

- **Framework**: React + Vite
- **PDF Processing**: `pdf-lib` for manipulation, `pdfjs-dist` for rendering.
- **Styling**: Vanilla CSS with CSS variables.
- **Animations**: `framer-motion`.

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
