
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { healingFrequencies } from '@/data/frequencies';
import { Upload, Music } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MusicUploadFormProps {
  onUpload: (file: File, title: string, description: string, frequencyId: string) => Promise<any>;
  isUploading: boolean;
}

const MusicUploadForm: React.FC<MusicUploadFormProps> = ({ onUpload, isUploading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequencyId, setFrequencyId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    // Check if file is an audio file
    if (!file.type.startsWith('audio/')) {
      setFileError('Please select an audio file (MP3, WAV, etc.)');
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setFileError('Please select an audio file');
      return;
    }
    
    if (!title.trim()) {
      return;
    }
    
    if (!frequencyId) {
      return;
    }
    
    const result = await onUpload(selectedFile, title, description, frequencyId);
    
    if (result) {
      // Reset form
      setTitle('');
      setDescription('');
      setFrequencyId('');
      setSelectedFile(null);
      // Clear the file input by recreating it
      const fileInput = document.getElementById('music-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <Card className="bg-black/70 backdrop-blur-md border border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-xl text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-400">
          Upload Meditation Music
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter music title"
              className="bg-white/10 text-white border-white/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for this music"
              className="bg-white/10 text-white border-white/20 min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-white">Associated Frequency</Label>
            <Select value={frequencyId} onValueChange={setFrequencyId} required>
              <SelectTrigger className="bg-white/10 text-white border-white/20">
                <SelectValue placeholder="Select a frequency" />
              </SelectTrigger>
              <SelectContent>
                {healingFrequencies.map(frequency => (
                  <SelectItem key={frequency.id} value={frequency.id}>
                    {frequency.name} - {frequency.frequency}Hz
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="music-file" className="text-white">Audio File</Label>
            <div className="flex items-center">
              <Input
                id="music-file"
                type="file"
                onChange={handleFileChange}
                accept="audio/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="mr-2 bg-white/10 text-white border-white/20"
                onClick={() => document.getElementById('music-file')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select File
              </Button>
              <span className="text-white/80 text-sm truncate">
                {selectedFile ? selectedFile.name : 'No file selected'}
              </span>
            </div>
            {fileError && (
              <Alert variant="destructive" className="mt-2 bg-red-500/20 border-red-500/40 text-white">
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}
            <p className="text-xs text-white/60 mt-1">
              Maximum file size: 10MB. Supported formats: MP3, WAV, etc.
            </p>
          </div>
          
          <CardFooter className="px-0 pt-4">
            <Button
              type="submit"
              disabled={isUploading || !selectedFile || !title.trim() || !frequencyId}
              className="w-full"
            >
              {isUploading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">◌</span>
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center">
                  <Music className="h-4 w-4 mr-2" />
                  Upload Music
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default MusicUploadForm;
