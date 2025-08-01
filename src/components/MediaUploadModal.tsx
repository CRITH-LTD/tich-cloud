import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, CheckCircle2, UploadCloud } from 'lucide-react';
import { toast } from 'react-toastify';

interface MediaUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFileSelect: (file: File) => void;
    title: string;
}

const MediaUploadModal: React.FC<MediaUploadModalProps> = ({ isOpen, onClose, onFileSelect, title }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Use useEffect to create and clean up the preview URL
    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
            // Clean up the object URL when the component unmounts or the file changes
            return () => URL.revokeObjectURL(objectUrl);
        }
        setPreviewUrl(null);
    }, [selectedFile]);

    // Reset the modal's state when it closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
        }
    }, [isOpen]);

    const handleFile = (file: File | null) => {
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file.', { autoClose: 2000 });
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files?.[0] || null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0] || null);
    };

    const handleUploadClick = () => {
        if (selectedFile) {
            onFileSelect(selectedFile);
            onClose();
        }
    };

    const handleCancelClick = () => {
        setSelectedFile(null);
        onClose();
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                                >
                                    {title}
                                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </Dialog.Title>

                                {/* Conditional rendering for preview or upload area */}
                                {previewUrl ? (
                                    <div className="mt-4 flex flex-col items-center">
                                        <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-contain rounded-lg" />
                                        <p className="mt-2 text-sm text-gray-600 font-medium">
                                            File: {selectedFile?.name}
                                        </p>
                                        <div className="mt-6 flex space-x-4">
                                            <button
                                                type="button"
                                                onClick={handleCancelClick}
                                                className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleUploadClick}
                                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                            >
                                                <CheckCircle2 className="w-5 h-5 mr-2" /> Upload
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <div
                                            className={`flex flex-col items-center justify-center p-8 rounded-lg transition-all duration-200
                                 border-2 border-dashed ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            <UploadCloud className={`w-12 h-12 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
                                            <p className={`mt-4 text-lg font-medium ${isDragging ? 'text-indigo-700' : 'text-gray-900'}`}>
                                                Drag and drop a file here
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                or
                                            </p>
                                            <label htmlFor="file-upload" className="mt-3 cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none">
                                                Browse Files
                                                <input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default MediaUploadModal;