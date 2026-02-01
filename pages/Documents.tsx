import React, { useState } from 'react';
import { GlassCard, Button, Input } from '../components/UI';
import { FileText, Upload, Search, File, Eye } from 'lucide-react';
import { StudyDocument } from '../types';

export const Documents: React.FC = () => {
  const [docs, setDocs] = useState<StudyDocument[]>([
    { id: '1', name: 'N5 Vocabulary List.pdf', type: 'pdf', size: '2.4 MB', uploadDate: '2023-10-12', url: '#' },
    { id: '2', name: 'Kanji Cheat Sheet.png', type: 'image', size: '1.1 MB', uploadDate: '2023-10-15', url: '#' }
  ]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setUploading(true);
        // Simulate upload
        setTimeout(() => {
            const newDoc: StudyDocument = {
                id: Date.now().toString(),
                name: file.name,
                type: file.name.endsWith('pdf') ? 'pdf' : 'image',
                size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
                uploadDate: new Date().toISOString().split('T')[0],
                url: '#'
            };
            setDocs([newDoc, ...docs]);
            setUploading(false);
        }, 1500);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-white">Study Documents</h1>
                <p className="text-slate-400">Manage your notes and PDF resources</p>
            </div>
            <div className="relative">
                <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    onChange={handleUpload}
                    accept=".pdf,.png,.jpg,.jpeg,.doc"
                />
                <label htmlFor="file-upload">
                    <div className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 transition-colors">
                        <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload File'}
                    </div>
                </label>
            </div>
       </div>

       {/* Filters */}
       <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                <Input placeholder="Search documents..." className="pl-10" />
            </div>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {docs.map(doc => (
               <GlassCard key={doc.id} className="relative group overflow-hidden">
                   <div className="h-32 bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                       {doc.type === 'pdf' ? <FileText size={48} className="text-red-400" /> : <File size={48} className="text-blue-400" />}
                   </div>
                   <h3 className="font-bold text-white truncate">{doc.name}</h3>
                   <div className="flex justify-between text-xs text-slate-500 mt-2">
                       <span>{doc.size}</span>
                       <span>{doc.uploadDate}</span>
                   </div>
                   
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="secondary" className="rounded-full p-3 h-auto"><Eye size={20} /></Button>
                   </div>
               </GlassCard>
           ))}
       </div>
    </div>
  );
};
