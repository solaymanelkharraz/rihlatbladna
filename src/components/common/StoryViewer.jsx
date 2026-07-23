import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StoryViewer = ({ 
  agenciesWithStories, 
  activeStoryIdx, 
  setActiveStoryIdx, 
  storyProgress, 
  setStoryProgress,
  isStoryPaused,
  setIsStoryPaused,
  handleNextStory,
  handlePrevStory
}) => {
  const navigate = useNavigate();

  if (activeStoryIdx === null || !agenciesWithStories[activeStoryIdx.agencyIndex]) {
    return null;
  }

  const currentAgency = agenciesWithStories[activeStoryIdx.agencyIndex];
  const currentStory = currentAgency.stories[activeStoryIdx.storyIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none">
      {/* Progress bars at the top */}
      <div className="absolute top-6 left-0 right-0 max-w-md mx-auto px-6 flex gap-1 z-50">
        {currentAgency.stories.map((_, i) => (
          <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ease-linear ${
                i < activeStoryIdx.storyIndex 
                  ? 'bg-white w-full' 
                  : i === activeStoryIdx.storyIndex 
                    ? 'bg-white' 
                    : 'bg-transparent w-0'
              }`}
              style={{ width: i === activeStoryIdx.storyIndex ? `${storyProgress}%` : undefined }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button 
        onClick={() => setActiveStoryIdx(null)}
        className="absolute top-8 right-6 text-white/70 hover:text-white text-3xl font-light z-50 focus:outline-none cursor-pointer p-2 border-none bg-transparent"
      >
        &times;
      </button>

      {/* Content Card */}
      <div 
        className="relative w-full max-w-md h-[85vh] md:h-[80vh] mx-auto flex flex-col justify-between items-center text-center overflow-hidden md:rounded-[2rem] bg-slate-900 border border-white/10"
        onPointerDown={() => setIsStoryPaused(true)}
        onPointerUp={() => setIsStoryPaused(false)}
        onPointerLeave={() => setIsStoryPaused(false)}
      >
        {/* Nav Zones */}
        <div 
          className="absolute top-20 bottom-24 left-0 w-1/3 z-30 cursor-pointer" 
          onClick={(e) => { e.stopPropagation(); handlePrevStory(); }}
        />
        <div 
          className="absolute top-20 bottom-24 right-0 w-1/3 z-30 cursor-pointer" 
          onClick={(e) => { e.stopPropagation(); handleNextStory(); }}
        />

        {/* Agency Header info */}
        <div 
          className="flex items-center gap-3 self-start text-left bg-gradient-to-b from-black/80 to-transparent p-6 absolute top-0 left-0 right-0 z-40 cursor-pointer"
          onClick={() => {
            setActiveStoryIdx(null);
            navigate(`/agency/${currentAgency.id}`);
          }}
        >
          <img src={currentAgency.avatar || '/MorP.jpg'} alt={currentAgency.name} className="w-10 h-10 rounded-full object-cover border border-white/20" />
          <div>
            <h4 className="font-extrabold text-white text-sm">{currentAgency.name}</h4>
            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">
              {Math.max(0, Math.floor((new Date() - new Date(currentStory.createdAt)) / (1000 * 60 * 60)))}h ago
            </span>
          </div>
        </div>

        {/* Main Story Image */}
        <div className="w-full h-full relative">
          <img 
            src={currentStory.imageUrl} 
            alt="Agency Active Story" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-6 left-0 right-0 px-6 flex gap-4 z-40">
          <button 
            onClick={() => {
              setActiveStoryIdx(null);
              navigate(`/agency/${currentAgency.id}`);
            }}
            className="flex-1 bg-white hover:bg-slate-200 text-slate-900 font-extrabold py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-sm shadow-lg border-none"
          >
            View Profile
          </button>
          <button 
            onClick={() => {
              setActiveStoryIdx(null);
              navigate(`/agency/messages`);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all cursor-pointer text-sm shadow-lg shadow-blue-500/20 border-none"
          >
            Chat Direct
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
