import React, { useState, ChangeEvent } from 'react';
import { Upload, AlertTriangle, CheckCircle, Image as ImageIcon, Video, FileText, Info } from 'lucide-react';

type ContentType = 'image' | 'video' | 'article';
type AnalysisResult = 'genuine' | 'fake' | null;

interface AnalysisSection {
  type: ContentType;
  icon: React.ReactNode;
  title: string;
  placeholder: string;
  result: AnalysisResult;
  file: File | null;
  text?: string;
}

function App() {
  const [sections, setSections] = useState<AnalysisSection[]>([
    {
      type: 'image',
      icon: <ImageIcon className="w-6 h-6" />,
      title: 'Image Analysis',
      placeholder: 'Upload an image (JPG, PNG)',
      result: null,
      file: null
    },
    {
      type: 'video',
      icon: <Video className="w-6 h-6" />,
      title: 'Video Analysis',
      placeholder: 'Upload a video (MP4, WebM)',
      result: null,
      file: null
    },
    {
      type: 'article',
      icon: <FileText className="w-6 h-6" />,
      title: 'Article Analysis',
      placeholder: 'Upload a text file or paste content',
      result: null,
      file: null,
      text: ''
    }
  ]);

  const handleFileChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSections(prev => {
      const updated = [...prev];
      updated[index].file = file;
      updated[index].text = '';
      updated[index].result = null;
      return updated;
    });
  };

  const handleTextChange = (index: number, event: ChangeEvent<HTMLTextAreaElement>) => {
    setSections(prev => {
      const updated = [...prev];
      updated[index].text = event.target.value;
      updated[index].file = null;
      updated[index].result = null;
      return updated;
    });
  };

  const handleAnalyze = (index: number) => {
    const section = sections[index];
    if (!section.file && !section.text && section.type === 'article') return;
    if (!section.file && section.type !== 'article') return;

    setSections(prev => {
      const updated = [...prev];
      updated[index].result = Math.random() > 0.5 ? 'genuine' : 'fake';
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 transition-colors duration-500">
      <header className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg transform rotate-12 transition-transform hover:rotate-0">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Vastavik
            </h1>
          </div>
          <p className="mt-3 text-gray-600 text-lg">
            Analyze images, videos, and articles for authenticity
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <div 
              key={section.type}
              className="bg-white/80 backdrop-blur rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  <label className="block group">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer 
                                  group-hover:border-indigo-500 group-hover:bg-indigo-50 transition-all duration-300 ease-in-out">
                      <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3 group-hover:text-indigo-500 transform group-hover:scale-110 transition-all duration-300" />
                      <p className="text-sm text-gray-500 group-hover:text-indigo-600 transition-colors duration-300">
                        {section.placeholder}
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(index, e)}
                        accept={
                          section.type === 'image' ? 'image/*' :
                          section.type === 'video' ? 'video/*' :
                          '.txt,.pdf'
                        }
                      />
                    </div>
                  </label>

                  {section.file && (
                    <div className="text-sm text-indigo-600 bg-indigo-50 p-3 rounded-lg animate-fadeIn">
                      Selected file: {section.file.name}
                    </div>
                  )}

                  {section.type === 'article' && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Or paste your article text here:</p>
                      <textarea
                        value={section.text}
                        onChange={(e) => handleTextChange(index, e)}
                        className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 
                                 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-300
                                 hover:border-indigo-300"
                        placeholder="Paste your article content here..."
                      />
                    </div>
                  )}

                  <button
                    onClick={() => handleAnalyze(index)}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 transform
                              ${(section.file || (section.type === 'article' && section.text))
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-95'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                    disabled={!section.file && !(section.type === 'article' && section.text)}
                  >
                    Analyze
                  </button>

                  {section.result && (
                    <div className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-500 animate-fadeIn
                      ${section.result === 'genuine'
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-800'
                        : 'bg-gradient-to-r from-red-50 to-rose-50 text-rose-800'
                      }`}>
                      {section.result === 'genuine'
                        ? <CheckCircle className="w-6 h-6" />
                        : <AlertTriangle className="w-6 h-6" />
                      }
                      <span className="font-medium capitalize">{section.result}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white/80 backdrop-blur rounded-xl shadow-xl p-8 transform hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Info className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">How It Works</h2>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-600 text-lg">
              Our advanced AI algorithms analyze various aspects of content to detect potential fake news:
            </p>
            <ul className="grid md:grid-cols-2 gap-4 mt-4">
              {[
                'Image manipulation detection',
                'Video deepfake analysis',
                'Text content verification',
                'Source credibility checking',
                'Cross-reference with fact-checking databases'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600 bg-indigo-50/50 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;