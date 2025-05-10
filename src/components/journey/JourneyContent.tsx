
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Journey } from '@/types/journey';
import { Card, CardContent } from '@/components/ui/card';
import { normalizeStringArray } from '@/utils/parsers';
import { parseJourneyFrontmatter, removeFrontmatter } from '@/utils/journeyLoader';

interface JourneyContentProps {
  journey: Journey | null;
  content: string;
}

const JourneyContent: React.FC<JourneyContentProps> = ({ journey, content }) => {
  // Function to render markdown content with proper styling
  const renderMarkdownContent = () => {
    if (!content) return null;
    
    return (
      <div className="prose prose-invert max-w-none text-white leading-relaxed">
        <ReactMarkdown>{removeFrontmatter(content)}</ReactMarkdown>
      </div>
    );
  };

  // Extract tags from content if available
  const extractTagsFromContent = () => {
    if (!content) return [];
    
    const frontmatter = parseJourneyFrontmatter(content);
    if (frontmatter.tags) {
      return normalizeStringArray(frontmatter.tags);
    }
    return [];
  };

  const journeyTags = journey?.tags?.length ? journey.tags : extractTagsFromContent();

  return (
    <Card className="bg-black/80 backdrop-blur-lg border-purple-500/30 shadow-xl">
      <CardContent className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-white">{journey?.title}</h1>
        
        {journeyTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {journeyTags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-purple-900/60 rounded-full text-xs text-white font-medium">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {renderMarkdownContent()}
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyContent;
