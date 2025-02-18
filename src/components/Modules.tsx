import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock, TestTube, TrendingUp, LineChart, BarChart2, Brain, Microscope, Gauge } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  level: string;
  duration: string;
  tier: 'basic' | 'advanced' | 'pro';
  lessons: Lesson[];
  locked: boolean;
  progress?: number;
}
interface ModulesPageProps {
  userTier?: string;
}
function ModulesPage({userTier}: ModulesPageProps) {
  const navigate = useNavigate();
  let modules: Module[] = [
    {
      id: 'market-basics',
      title: "Market Fundamentals",
      description: "Essential concepts and market mechanics",
      icon: <TestTube className="w-6 h-6 text-cyan-400" />,
      level: "Beginner",
      duration: "4 weeks",
      tier: 'basic',
      lessons: [ {
        id: 'lesson-1',
        title: 'Introduction to Market Structure',
        duration: '15:30',
        videoUrl: 'https://example.com/video1.mp4',
        completed: true
      },
      {
        id: 'lesson-2',
        title: 'Order Types and Execution',
        duration: '22:45',
        videoUrl: 'https://example.com/video2.mp4',
        completed: true
      },
      {
        id: 'lesson-3',
        title: 'Price Action Fundamentals',
        duration: '18:15',
        videoUrl: 'https://example.com/video3.mp4',
        completed: false
      },
      {
        id: 'lesson-4',
        title: 'Market Participants',
        duration: '20:00',
        videoUrl: 'https://example.com/video4.mp4',
        completed: false
      }
    ],
      locked: false,
      progress: 75
    },
    {
      id: 'technical-analysis',
      title: "Technical Analysis Lab",
      description: "Scientific approach to chart patterns",
      icon: <LineChart className="w-6 h-6 text-cyan-400" />,
      level: "Beginner",
      duration: "6 weeks",
      tier: 'basic',
      lessons: [ {
        id: 'lesson-1',
        title: 'Introduction to Market Structure',
        duration: '15:30',
        videoUrl: 'https://example.com/video1.mp4',
        completed: true
      },
      {
        id: 'lesson-2',
        title: 'Order Types and Execution',
        duration: '22:45',
        videoUrl: 'https://example.com/video2.mp4',
        completed: true
      },
      {
        id: 'lesson-3',
        title: 'Price Action Fundamentals',
        duration: '18:15',
        videoUrl: 'https://example.com/video3.mp4',
        completed: false
      },
      {
        id: 'lesson-4',
        title: 'Market Participants',
        duration: '20:00',
        videoUrl: 'https://example.com/video4.mp4',
        completed: false
      }
    ],
      locked: false,
      progress: 30
    },
    {
      id: 'risk-management',
      title: "Risk Management",
      description: "Data-driven position sizing and risk control",
      icon: <Gauge className="w-6 h-6 text-cyan-400" />,
      level: "Intermediate",
      duration: "4 weeks",
      tier: 'basic',
      lessons: [ {
        id: 'lesson-1',
        title: 'Introduction to Market Structure',
        duration: '15:30',
        videoUrl: 'https://example.com/video1.mp4',
        completed: true
      },
      {
        id: 'lesson-2',
        title: 'Order Types and Execution',
        duration: '22:45',
        videoUrl: 'https://example.com/video2.mp4',
        completed: true
      },
      {
        id: 'lesson-3',
        title: 'Price Action Fundamentals',
        duration: '18:15',
        videoUrl: 'https://example.com/video3.mp4',
        completed: false
      },
      {
        id: 'lesson-4',
        title: 'Market Participants',
        duration: '20:00',
        videoUrl: 'https://example.com/video4.mp4',
        completed: false
      }
    ],
      locked: false
    },
    {
      id: 'advanced-patterns',
      title: "Advanced Pattern Recognition",
      description: "Complex chart patterns and market psychology",
      icon: <Brain className="w-6 h-6 text-cyan-400" />,
      level: "Advanced",
      duration: "8 weeks",
      tier: 'advanced',
      lessons: [ {
        id: 'lesson-1',
        title: 'Introduction to Market Structure',
        duration: '15:30',
        videoUrl: 'https://example.com/video1.mp4',
        completed: true
      },
      {
        id: 'lesson-2',
        title: 'Order Types and Execution',
        duration: '22:45',
        videoUrl: 'https://example.com/video2.mp4',
        completed: true
      },
      {
        id: 'lesson-3',
        title: 'Price Action Fundamentals',
        duration: '18:15',
        videoUrl: 'https://example.com/video3.mp4',
        completed: false
      },
      {
        id: 'lesson-4',
        title: 'Market Participants',
        duration: '20:00',
        videoUrl: 'https://example.com/video4.mp4',
        completed: false
      }
    ],
      locked: true
    },
    {
      id: 'quant-strategies',
      title: "Quantitative Strategies",
      description: "Mathematical models and algorithmic trading",
      icon: <BarChart2 className="w-6 h-6 text-cyan-400" />,
      level: "Advanced",
      duration: "10 weeks",
      tier: 'advanced',
      lessons: [ {
        id: 'lesson-1',
        title: 'Introduction to Market Structure',
        duration: '15:30',
        videoUrl: 'https://example.com/video1.mp4',
        completed: true
      },
      {
        id: 'lesson-2',
        title: 'Order Types and Execution',
        duration: '22:45',
        videoUrl: 'https://example.com/video2.mp4',
        completed: true
      },
      {
        id: 'lesson-3',
        title: 'Price Action Fundamentals',
        duration: '18:15',
        videoUrl: 'https://example.com/video3.mp4',
        completed: false
      },
      {
        id: 'lesson-4',
        title: 'Market Participants',
        duration: '20:00',
        videoUrl: 'https://example.com/video4.mp4',
        completed: false
      }
    ],
      locked: true
    },
    {
      id: 'institutional',
      title: "Institutional Trading Lab",
      description: "Professional trading desk methodologies",
      icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,
      level: "Pro",
      duration: "12 weeks",
      tier: 'pro',
      lessons: [ {
        id: 'lesson-1',
        title: 'Introduction to Market Structure',
        duration: '15:30',
        videoUrl: 'https://example.com/video1.mp4',
        completed: true
      },
      {
        id: 'lesson-2',
        title: 'Order Types and Execution',
        duration: '22:45',
        videoUrl: 'https://example.com/video2.mp4',
        completed: true
      },
      {
        id: 'lesson-3',
        title: 'Price Action Fundamentals',
        duration: '18:15',
        videoUrl: 'https://example.com/video3.mp4',
        completed: false
      },
      {
        id: 'lesson-4',
        title: 'Market Participants',
        duration: '20:00',
        videoUrl: 'https://example.com/video4.mp4',
        completed: false
      }
    ],
      locked: true
    }
  ];
  
  if (userTier) {
      modules = modules.filter(m => m.tier === userTier)
  }

  const handleModuleClick = (moduleId: string, locked: boolean) => {
    if (!locked) {
      navigate(`/module/${moduleId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Your Modules</h1>
        <div className="flex items-center space-x-2 text-sm">
          <span className="flex items-center text-green-400">
            <Unlock className="w-4 h-4 mr-1" /> Available
          </span>
          <span className="flex items-center text-gray-400">
            <Lock className="w-4 h-4 mr-1" /> Locked
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">Basic Tier</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.filter(m => m.tier === 'basic').map(module => (
              <div
                key={module.id}
                onClick={() => handleModuleClick(module.id, module.locked)}
                className={`bg-[#112A45] border border-cyan-900/50 rounded-xl p-6 relative overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] ${
                  module.locked ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    {module.icon}
                  </div>
                  {module.locked ? (
                    <Lock className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Unlock className="w-5 h-5 text-green-400" />
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <p className="text-gray-400 mb-4">{module.description}</p>
                
                {module.progress !== undefined && (
                  <div className="mb-4">
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{module.progress}% Complete</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{module.level}</span>
                  <span>{module.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {modules.filter(m => m.tier === 'advanced').length > 0 
        ?
        <div>
          <h2 className='text-xl font-semibold text-cyan-400 mb-4'>Advanced Tier</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.filter(m => m.tier === 'advanced').map(module => (
              <div
                key={module.id}
                className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    {module.icon}
                  </div>
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <p className="text-gray-400 mb-4">{module.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{module.level}</span>
                  <span>{module.duration}</span>
                </div>

                <div className="absolute inset-0 bg-[#0A1929]/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-6">
                    <Lock className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <p className="text-white font-medium mb-2">Advanced Tier Required</p>
                    <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors">
                      Upgrade to Access
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> 
        : 
        <></>
        }

      {modules.filter(m => m.tier === 'pro').length > 0 
      ?
      <div>
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">Pro Tier</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.filter(m => m.tier === 'pro').map(module => (
              <div
                key={module.id}
                className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    {module.icon}
                  </div>
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <p className="text-gray-400 mb-4">{module.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{module.level}</span>
                  <span>{module.duration}</span>
                </div>

                <div className="absolute inset-0 bg-[#0A1929]/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-6">
                    <Lock className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <p className="text-white font-medium mb-2">Pro Tier Required</p>
                    <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors">
                      Upgrade to Access
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
       :
       <></>
       }
        
      </div>
    </div>
  );
}

export default ModulesPage;