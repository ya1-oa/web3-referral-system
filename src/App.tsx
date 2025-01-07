import { ReferralDashboard } from './components/ReferralDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
            </div>
          </div>
        </div>
      </nav>

      <main>
        <ReferralDashboard />
      </main>
    </div>
  );
}

export default App;
