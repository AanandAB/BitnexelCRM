import React, { useState, useEffect } from 'react';
import { RouteType, ServiceBranch, PortalProject, CaseStudy } from './types';
import { mockClientProject } from './data/mockData';
import { CurrencyProvider } from './context/CurrencyContext';
import { AmbientBackground } from './components/AmbientBackground';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ServicesView } from './components/ServicesView';
import { WorkView } from './components/WorkView';
import { ShelfView } from './components/ShelfView';
import { CaseStudyDetail } from './components/CaseStudyDetail';
import { ProcessView } from './components/ProcessView';
import { PricingView } from './components/PricingView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { StartProjectWizard } from './components/StartProjectWizard';
import { ClientPortal } from './components/ClientPortal';
import { LoginView } from './components/LoginView';
import { LegalModal } from './components/LegalModals';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<RouteType>('home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Logged in by default to let user test the portal immediately
  const [activeProject, setActiveProject] = useState<PortalProject>(mockClientProject);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'sitemap' | null>(null);
  const [activeCaseStudy, setActiveCaseStudy] = useState<CaseStudy | null>(null);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as RouteType;
      if (hash && ['home', 'services', 'services/website', 'services/software', 'services/web-app', 'work', 'shelf', 'process', 'pricing', 'about', 'contact', 'start', 'portal', 'login', 'work-detail'].includes(hash)) {
        setCurrentRoute(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: RouteType) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCaseStudy = (caseStudy: CaseStudy) => {
    setActiveCaseStudy(caseStudy);
    navigateTo('work-detail');
  };

  const handlePortalLoginSuccess = () => {
    setIsLoggedIn(true);
    navigateTo('portal');
  };

  const handlePortalLogout = () => {
    setIsLoggedIn(false);
    navigateTo('home');
  };

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-[#6366F1]/30 selection:text-foreground">
        {/* Ambient Animated Gradient Background Mesh */}
        <AmbientBackground />

        {/* Global Glass Navigation */}
        <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />

        {/* Main Routed Content Area */}
        <main className="flex-grow pt-24 pb-16 z-10">
          {currentRoute === 'home' && (
            <HomeView onNavigate={navigateTo} onSelectCaseStudy={handleSelectCaseStudy} />
          )}

          {currentRoute === 'services' && (
            <ServicesView initialSubTab="all" onNavigate={navigateTo} />
          )}

          {currentRoute === 'services/website' && (
            <ServicesView initialSubTab="website" onNavigate={navigateTo} />
          )}

          {currentRoute === 'services/software' && (
            <ServicesView initialSubTab="software" onNavigate={navigateTo} />
          )}

          {currentRoute === 'services/web-app' && (
            <ServicesView initialSubTab="webapp" onNavigate={navigateTo} />
          )}

          {currentRoute === 'work' && (
            <WorkView onSelectCaseStudy={handleSelectCaseStudy} />
          )}

          {currentRoute === 'shelf' && (
            <ShelfView onNavigate={navigateTo} />
          )}

          {currentRoute === 'work-detail' && activeCaseStudy && (
            <CaseStudyDetail
              caseStudy={activeCaseStudy}
              onNavigate={navigateTo}
              onBack={() => navigateTo('work')}
            />
          )}

          {currentRoute === 'process' && (
            <ProcessView onNavigate={navigateTo} />
          )}

          {currentRoute === 'pricing' && (
            <PricingView onNavigate={navigateTo} />
          )}

          {currentRoute === 'about' && (
            <AboutView onNavigate={navigateTo} />
          )}

          {currentRoute === 'contact' && (
            <ContactView onNavigate={navigateTo} />
          )}

          {currentRoute === 'start' && (
            <StartProjectWizard 
              onNavigate={navigateTo}
              onCompletePortalSetup={(data) => {
                // Populate portal with newly onboarded project
                setActiveProject(prev => ({
                  ...prev,
                  name: data.company ? `${data.company} Flagship` : 'New Custom Build',
                  clientCompany: data.company || 'Client Organization',
                  clientName: data.contactName || 'Valued Partner',
                  clientEmail: data.contactEmail || 'client@company.com',
                  statusSummary: `Discovery & Architecture phase underway. Targeted for ${data.timeline || 'Q3/Q4'}.`,
                  currentStage: 'discovery',
                  stageProgress: 15
                }));
                setIsLoggedIn(true);
                navigateTo('portal');
              }}
            />
          )}

          {currentRoute === 'portal' && (
            isLoggedIn ? (
              <ClientPortal 
                project={activeProject} 
                onLogout={handlePortalLogout} 
                onNavigate={navigateTo} 
              />
            ) : (
              <LoginView 
                onLoginSuccess={handlePortalLoginSuccess} 
                onNavigate={navigateTo} 
              />
            )
          )}

          {currentRoute === 'login' && (
            <LoginView 
              onLoginSuccess={handlePortalLoginSuccess} 
              onNavigate={navigateTo} 
            />
          )}
        </main>

        {/* Global Footer */}
        <Footer 
          onNavigate={navigateTo} 
          onOpenTerms={() => setLegalModalType('terms')}
          onOpenPrivacy={() => setLegalModalType('privacy')}
          onOpenSitemap={() => setLegalModalType('sitemap')}
        />

        {/* Legal & Sitemap Modal */}
        {legalModalType && (
          <LegalModal 
            type={legalModalType} 
            onClose={() => setLegalModalType(null)} 
          />
        )}
      </div>
    </CurrencyProvider>
  );
}

