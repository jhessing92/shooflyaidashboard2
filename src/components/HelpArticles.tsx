import React from 'react';
import { Book, Image, Plus, ArrowRightCircle, MoreHorizontal } from 'lucide-react';

const articles = [
  {
    title: "Getting Started with AI Automation",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1280&h=900",
    issue: "Guide 01",
    page: "Basics",
    tags: ["Automation", "AI", "Workflow", "Setup", "Integration", "Basics"],
  },
  {
    title: "Advanced Workflow Automation",
    image: "https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80&w=1280&h=900",
    issue: "Guide 02",
    page: "Advanced",
    tags: ["Advanced", "Workflow", "Enterprise", "Scaling", "Performance"],
  },
  {
    title: "API Integration Guide",
    image: "https://images.unsplash.com/photo-1676299081099-86c919aa7371?auto=format&fit=crop&q=80&w=1280&h=900",
    issue: "Guide 03",
    page: "Technical",
    tags: ["API", "Integration", "Development", "Technical", "Documentation"],
  }
];

const HelpArticles = () => {
  return (
    <section className="grid--container mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-white mb-8">Help Resources</h2>
      
      {articles.map((article, index) => (
        <div key={index} className="grid--cell">
          <article className="grid--item bg-[#171717] rounded-lg overflow-hidden">
            <div className="preview--container h-48">
              <a href="#" className="preview-image--container">
                <div 
                  className="preview-image h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${article.image})` }}
                />
              </a>
              
              <div className="meta--container">
                <a href="#" className="issue bg-[#0B1714] text-[#D0BEAD] px-3 py-1 text-sm font-mono">
                  {article.issue}
                </a>
                <a href="#" className="page bg-[#171717] text-[#D0BEAD] px-3 py-1 text-sm font-mono">
                  {article.page}
                </a>
              </div>
            </div>
            
            <div className="content--container p-4">
              <div className="title--container mb-4">
                <a href="#" className="title--text text-lg font-semibold text-[#D0BEAD] hover:underline">
                  {article.title}
                </a>
              </div>
              
              <div className="tags--overflow-container">
                <ul className="tags--container">
                  {article.tags.map((tag, tagIndex) => (
                    <li key={tagIndex}>
                      <a href="#" className="tag text-sm text-[#D0BEAD]">
                        {tag}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#" className="tag ellipsis">
                      <MoreHorizontal className="w-4 h-4" />
                    </a>
                  </li>
                </ul>
              </div>

              <div className="hover--options mt-4 flex gap-2">
                <a href="#" className="series button bg-[#172526] text-[#D0BEAD] px-4 py-2 rounded-full flex items-center">
                  <span className="icon-title">
                    <Book className="w-4 h-4" /> Series
                  </span>
                  <span className="new-tab">
                    <ArrowRightCircle className="w-4 h-4" />
                  </span>
                </a>
                
                <a href="#" className="latest button bg-[#0B1714] text-[#D0BEAD] px-4 py-2 rounded-full flex items-center">
                  <span className="icon-title">
                    <Image className="w-4 h-4" /> Latest
                  </span>
                  <span className="new-tab">
                    <ArrowRightCircle className="w-4 h-4" />
                  </span>
                </a>
                
                <a href="#" className="follow button w-10 h-10 bg-[#172526] text-[#D0BEAD] rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </a>
              </div>
            </div>
          </article>
        </div>
      ))}
    </section>
  );
};

export default HelpArticles;