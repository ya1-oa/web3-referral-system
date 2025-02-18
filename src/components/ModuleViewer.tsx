import { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import ModuleProgress from './ModuleProgress';
import { useParams } from 'react-router-dom';
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

interface UserStats {
  referrer: string;
  referralCount: bigint;
  totalRewards: bigint;
  isRegistered: boolean;
  isSubscribed: boolean;
  tokenID: bigint;
}

interface ModuleProps {
  stats: UserStats | null;
  address: string | null;
}

function ModulesViewer({stats, address}: ModuleProps) {
  const { moduleId } = useParams();
  const [currentModule, setCurrentModule] = useState(0);

  return (
    <div className="min-h-screen bg-[#0A192F]">

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VideoPlayer 
              videoHash={modules[currentModule].videoHash}
              fallbackUrl={modules[currentModule].fallbackUrl}
            />
          </div>
          <div className="bg-[#112A45] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Course Modules</h2>
            <ModuleProgress 
              modules={modules}
              currentModule={currentModule}
              setCurrentModule={setCurrentModule}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ModulesViewer;