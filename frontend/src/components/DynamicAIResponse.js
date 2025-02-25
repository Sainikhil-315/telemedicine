import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

const DynamicAIResponse = ({ content }) => {
  // Parse content into sections
  const parseSections = (text) => {
    // Split by double line breaks to identify sections
    const rawSections = text.split(/\n\n+/);
    
    return rawSections.map((section, index) => {
      // Check if this is a disclaimer (starts with "**Disclaimer")
      if (section.toLowerCase().includes('**disclaimer')) {
        return {
          type: 'disclaimer',
          content: formatText(section.replace(/^\*\*disclaimer:?\*\*/i, '').trim())
        };
      }
      
      // Check if this is a heading (wrapped in ** at the beginning of a section)
      else if (section.match(/^\*\*([^*]+)\*\*/)) {
        const headingMatch = section.match(/^\*\*([^*]+)\*\*/);
        const heading = headingMatch ? headingMatch[1] : '';
        const content = section.replace(/^\*\*([^*]+)\*\*/, '').trim();
        
        return {
          type: 'heading',
          heading: heading,
          content: content ? formatText(content) : ''
        };
      }
      
      // Check if this is an important note (wrapped in ** on both sides)
      else if (section.startsWith('**') && section.endsWith('**')) {
        return {
          type: 'important',
          content: formatText(section.replace(/^\*\*|\*\*$/g, ''))
        };
      }
      
      // Check if this is a list (contains * or - at the beginning of lines)
      else if (section.match(/^\s*[\*\-]\s+/m)) {
        return {
          type: 'list',
          items: section.split('\n')
            .filter(line => line.trim())
            .map(line => {
              // Check for nested lists
              const indentLevel = (line.match(/^\s+/) || [''])[0].length;
              const listItem = line.replace(/^\s*[\*\-]\s+/, '');
              return { 
                level: Math.floor(indentLevel / 2), 
                content: formatText(listItem)
              };
            })
        };
      }
      
      // Default to paragraph
      else {
        return {
          type: 'paragraph',
          content: formatText(section)
        };
      }
    });
  };
  
  // Format text, handling inline emphasis (** or *)
  const formatText = (text) => {
    // First replace triple asterisks (for both bold and italic)
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    
    // Then replace double asterisks (for bold)
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Then replace single asterisks (for italic)
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    return text;
  };

  // Render section based on its type
  const renderSection = (section, index) => {
    switch (section.type) {
      case 'disclaimer':
        return (
          <div key={index} className="mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex items-start gap-3">
            <AlertCircle className="text-yellow-500 h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-700 overflow-auto" 
                 dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        );
      
      case 'heading':
        return (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{section.heading}</h3>
            {section.content && (
              <div className="text-gray-700 overflow-auto" 
                   dangerouslySetInnerHTML={{ __html: section.content }} />
            )}
          </div>
        );
      
      case 'important':
        return (
          <div key={index} className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-start gap-3">
            <Info className="text-blue-500 h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="text-blue-800 font-medium overflow-auto" 
                 dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        );
      
      case 'list':
        return (
          <div key={index} className="mb-4 overflow-x-auto">
            <ul className="pl-5 space-y-1 text-gray-700">
              {section.items.map((item, i) => (
                <li 
                  key={i} 
                  className={`list-disc ml-${item.level * 4}`}
                  style={{ marginLeft: `${item.level * 1}rem`, listStyleType: "disc"}}
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              ))}
            </ul>
          </div>
        );
      
      case 'paragraph':
      default:
        return (
          <p key={index} 
             className="mb-4 text-gray-700 break-words" 
             dangerouslySetInnerHTML={{ __html: section.content }} />
        );
    }
  };

  const sections = parseSections(content);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 max-w-full w-full overflow-hidden">
      <div className="overflow-x-auto">
        {sections.map((section, index) => renderSection(section, index))}
      </div>
    </div>
  );
};

export default DynamicAIResponse;