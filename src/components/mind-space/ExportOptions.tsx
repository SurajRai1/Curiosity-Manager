import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileImage, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExportOptionsProps {
  onExportPNG: () => Promise<void>;
  onExportPDF: () => Promise<void>;
  onClose: () => void;
}

export default function ExportOptions({ onExportPNG, onExportPDF, onClose }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'png' | 'pdf' | null>(null);

  const handleExport = async (type: 'png' | 'pdf') => {
    setIsExporting(true);
    setExportType(type);
    
    try {
      if (type === 'png') {
        await onExportPNG();
      } else {
        await onExportPDF();
      }
    } catch (error) {
      console.error(`Error exporting as ${type.toUpperCase()}:`, error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Export Mind Map</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-neutral-600">
            Choose a format to export your mind map:
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleExport('png')}
              disabled={isExporting}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all duration-200",
                isExporting && exportType === 'png'
                  ? "bg-primary-50 border-primary-300 cursor-wait"
                  : "hover:border-primary-300 hover:bg-primary-50 border-neutral-200"
              )}
            >
              <FileImage className="w-12 h-12 text-primary-600 mb-3" />
              <span className="font-medium text-neutral-800">PNG Image</span>
              <span className="text-xs text-neutral-500 mt-1">High quality image</span>
            </button>

            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all duration-200",
                isExporting && exportType === 'pdf'
                  ? "bg-primary-50 border-primary-300 cursor-wait"
                  : "hover:border-primary-300 hover:bg-primary-50 border-neutral-200"
              )}
            >
              <FileText className="w-12 h-12 text-primary-600 mb-3" />
              <span className="font-medium text-neutral-800">PDF Document</span>
              <span className="text-xs text-neutral-500 mt-1">Printable document</span>
            </button>
          </div>

          {isExporting && (
            <div className="mt-4 p-3 bg-primary-50 border border-primary-100 rounded-lg flex items-center">
              <div className="animate-spin mr-3">
                <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full"></div>
              </div>
              <span className="text-primary-700">
                Exporting as {exportType?.toUpperCase()}...
              </span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-neutral-200 bg-neutral-50">
          <p className="text-sm text-neutral-500">
            <Download className="w-4 h-4 inline-block mr-1" />
            Files will be downloaded to your device automatically
          </p>
        </div>
      </motion.div>
    </div>
  );
} 