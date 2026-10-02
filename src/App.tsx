import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './store/AppStore';
import { Toaster } from './components/shared/Toaster';
import { NotFound } from './pages/NotFound';
import { Legal } from './pages/Legal';
import { DhoNotifications } from './pages/dho/DhoNotifications';
import { DhoAlertDetail } from './pages/dho/DhoAlertDetail';
import { DhoInvestigations } from './pages/dho/DhoInvestigations';
import { WarningHistory } from './pages/warning/WarningHistory';
import { PredictionHistory } from './pages/prediction/PredictionHistory';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/auth/Login';
import { Mfa } from './pages/auth/Mfa';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { RedirectLoading } from './pages/auth/RedirectLoading';
import { AccountLocked } from './pages/auth/AccountLocked';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminRoles } from './pages/admin/AdminRoles';
import { AdminDataSources } from './pages/admin/AdminDataSources';
import { AdminSystemConfig } from './pages/admin/AdminSystemConfig';
import { AdminAuditTrail } from './pages/admin/AdminAuditTrail';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminBackup } from './pages/admin/AdminBackup';
import { DhoOverview } from './pages/dho/DhoOverview';
import { DhoRiskMap } from './pages/dho/DhoRiskMap';
import { DhoAlerts } from './pages/dho/DhoAlerts';
import { DhoFacilities } from './pages/dho/DhoFacilities';
import { DhoTrends } from './pages/dho/DhoTrends';
import { DhoCHWReports } from './pages/dho/DhoCHWReports';
import { DhoInterventions } from './pages/dho/DhoInterventions';
import { DhoReports } from './pages/dho/DhoReports';
import { EpiOverview } from './pages/epi/EpiOverview';
import { EpiSurveillance } from './pages/epi/EpiSurveillance';
import { EpiInvestigation } from './pages/epi/EpiInvestigation';
import { EpiField } from './pages/epi/EpiField';
import { EpiPatterns } from './pages/epi/EpiPatterns';
import { EpiThresholds } from './pages/epi/EpiThresholds';
import { EpiLab } from './pages/epi/EpiLab';
import { EpiComparison } from './pages/epi/EpiComparison';
import { EpiReports } from './pages/epi/EpiReports';
import { AnalystOverview } from './pages/analyst/AnalystOverview';
import { AnalystIndicators } from './pages/analyst/AnalystIndicators';
import { AnalystExplore } from './pages/analyst/AnalystExplore';
import { AnalystCorrelation } from './pages/analyst/AnalystCorrelation';
import { AnalystRiskScores } from './pages/analyst/AnalystRiskScores';
import { AnalystVulnerable } from './pages/analyst/AnalystVulnerable';
import { AnalystDataQuality } from './pages/analyst/AnalystDataQuality';
import { AnalystScenarios } from './pages/analyst/AnalystScenarios';
import { AnalystReports } from './pages/analyst/AnalystReports';
import { IntegrationHome } from './pages/integration/IntegrationHome';
import { IntegrationSources } from './pages/integration/IntegrationSources';
import { IntegrationPipeline } from './pages/integration/IntegrationPipeline';
import { IntegrationValidation } from './pages/integration/IntegrationValidation';
import { IntegrationUpload } from './pages/integration/IntegrationUpload';
import { IntegrationMapping } from './pages/integration/IntegrationMapping';
import { IntegrationScheduling } from './pages/integration/IntegrationScheduling';
import { IntegrationHealth } from './pages/integration/IntegrationHealth';
import { IntegrationAudit } from './pages/integration/IntegrationAudit';
import { ProcessingHome } from './pages/processing/ProcessingHome';
import { ProcessingCleaning } from './pages/processing/ProcessingCleaning';
import { ProcessingMetrics } from './pages/processing/ProcessingMetrics';
import { ProcessingGeographic } from './pages/processing/ProcessingGeographic';
import { ProcessingFeatures } from './pages/processing/ProcessingFeatures';
import { ProcessingTrends } from './pages/processing/ProcessingTrends';
import { ProcessingScheduler } from './pages/processing/ProcessingScheduler';
import { ProcessingQuality } from './pages/processing/ProcessingQuality';
import { PredictionOverview } from './pages/prediction/PredictionOverview';
import { PredictionMap } from './pages/prediction/PredictionMap';
import { PredictionDisease } from './pages/prediction/PredictionDisease';
import { PredictionFactors } from './pages/prediction/PredictionFactors';
import { PredictionProbability } from './pages/prediction/PredictionProbability';
import { PredictionTimeline } from './pages/prediction/PredictionTimeline';
import { PredictionScenarios } from './pages/prediction/PredictionScenarios';
import { PredictionPerformance } from './pages/prediction/PredictionPerformance';
import { WarningOverview } from './pages/warning/WarningOverview';
import { WarningAlerts } from './pages/warning/WarningAlerts';
import { WarningDetail } from './pages/warning/WarningDetail';
import { WarningConfig } from './pages/warning/WarningConfig';
import { WarningEscalation } from './pages/warning/WarningEscalation';
import { WarningDelivery } from './pages/warning/WarningDelivery';
import { WarningEffectiveness } from './pages/warning/WarningEffectiveness';
import { WarningCrossBorder } from './pages/warning/WarningCrossBorder';
import { GeoOverview } from './pages/geo/GeoOverview';
import { GeoHeatMap } from './pages/geo/GeoHeatMap';
import { GeoFacilities } from './pages/geo/GeoFacilities';
import { GeoAccess } from './pages/geo/GeoAccess';
import { GeoAnimation } from './pages/geo/GeoAnimation';
import { GeoEnvironment } from './pages/geo/GeoEnvironment';
import { GeoCrossBorder } from './pages/geo/GeoCrossBorder';
import { GeoVulnerability } from './pages/geo/GeoVulnerability';
import { GeoExport } from './pages/geo/GeoExport';
// Reset scroll position on navigation (hash links on the landing page still work).
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function App() {
  return (
    <AppProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mfa" element={<Mfa />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/redirect" element={<RedirectLoading />} />
        <Route path="/locked" element={<AccountLocked />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Control Panel */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/roles" element={<AdminRoles />} />
        <Route path="/admin/data-sources" element={<AdminDataSources />} />
        <Route path="/admin/system-config" element={<AdminSystemConfig />} />
        <Route path="/admin/audit" element={<AdminAuditTrail />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/backup" element={<AdminBackup />} />

        {/* District Health Officer Dashboard (Huye District) */}
        <Route path="/dho" element={<DhoOverview />} />
        <Route path="/dho/risk-map" element={<DhoRiskMap />} />
        <Route path="/dho/alerts" element={<DhoAlerts />} />
        <Route path="/dho/alerts/:id" element={<DhoAlertDetail />} />
        <Route path="/dho/notifications" element={<DhoNotifications />} />
        <Route path="/dho/investigations" element={<DhoInvestigations />} />
        <Route path="/dho/investigations/:id" element={<DhoInvestigations />} />
        <Route path="/dho/facilities" element={<DhoFacilities />} />
        <Route path="/dho/trends" element={<DhoTrends />} />
        <Route path="/dho/chw-reports" element={<DhoCHWReports />} />
        <Route path="/dho/interventions" element={<DhoInterventions />} />
        <Route path="/dho/reports" element={<DhoReports />} />

        {/* Epidemiologist Dashboard (National View) */}
        <Route path="/epi" element={<EpiOverview />} />
        <Route path="/epi/surveillance" element={<EpiSurveillance />} />
        <Route path="/epi/investigations" element={<EpiInvestigation />} />
        <Route path="/epi/field" element={<EpiField />} />
        <Route path="/epi/patterns" element={<EpiPatterns />} />
        <Route path="/epi/thresholds" element={<EpiThresholds />} />
        <Route path="/epi/lab" element={<EpiLab />} />
        <Route path="/epi/comparison" element={<EpiComparison />} />
        <Route path="/epi/reports" element={<EpiReports />} />

        {/* Public Health Analyst Dashboard */}
        <Route path="/analyst" element={<AnalystOverview />} />
        <Route path="/analyst/indicators" element={<AnalystIndicators />} />
        <Route path="/analyst/explore" element={<AnalystExplore />} />
        <Route path="/analyst/correlation" element={<AnalystCorrelation />} />
        <Route path="/analyst/risk-scores" element={<AnalystRiskScores />} />
        <Route path="/analyst/vulnerable" element={<AnalystVulnerable />} />
        <Route path="/analyst/data-quality" element={<AnalystDataQuality />} />
        <Route path="/analyst/scenarios" element={<AnalystScenarios />} />
        <Route path="/analyst/reports" element={<AnalystReports />} />

        {/* Health Data Integration Module */}
        <Route path="/integration" element={<IntegrationHome />} />
        <Route path="/integration/sources" element={<IntegrationSources />} />
        <Route path="/integration/pipeline" element={<IntegrationPipeline />} />
        <Route
          path="/integration/validation"
          element={<IntegrationValidation />} />
        
        <Route path="/integration/upload" element={<IntegrationUpload />} />
        <Route path="/integration/mapping" element={<IntegrationMapping />} />
        <Route
          path="/integration/scheduling"
          element={<IntegrationScheduling />} />
        
        <Route path="/integration/health" element={<IntegrationHealth />} />
        <Route path="/integration/audit" element={<IntegrationAudit />} />

        {/* Data Processing & Feature Engineering Module */}
        <Route path="/processing" element={<ProcessingHome />} />
        <Route path="/processing/cleaning" element={<ProcessingCleaning />} />
        <Route path="/processing/metrics" element={<ProcessingMetrics />} />
        <Route
          path="/processing/geographic"
          element={<ProcessingGeographic />} />
        
        <Route path="/processing/features" element={<ProcessingFeatures />} />
        <Route path="/processing/trends" element={<ProcessingTrends />} />
        <Route path="/processing/scheduler" element={<ProcessingScheduler />} />
        <Route path="/processing/quality" element={<ProcessingQuality />} />

        {/* AI Risk Prediction Module */}
        <Route path="/prediction" element={<PredictionOverview />} />
        <Route path="/prediction/map" element={<PredictionMap />} />
        <Route path="/prediction/disease" element={<PredictionDisease />} />
        <Route path="/prediction/factors" element={<PredictionFactors />} />
        <Route
          path="/prediction/probability"
          element={<PredictionProbability />} />
        
        <Route path="/prediction/timeline" element={<PredictionTimeline />} />
        <Route path="/prediction/scenarios" element={<PredictionScenarios />} />
        <Route
          path="/prediction/performance"
          element={<PredictionPerformance />} />
        <Route path="/prediction/history" element={<PredictionHistory />} />


        {/* Early Warning Module */}
        <Route path="/warning" element={<WarningOverview />} />
        <Route path="/warning/alerts" element={<WarningAlerts />} />
        <Route path="/warning/detail" element={<WarningDetail />} />
        <Route path="/warning/config" element={<WarningConfig />} />
        <Route path="/warning/escalation" element={<WarningEscalation />} />
        <Route path="/warning/delivery" element={<WarningDelivery />} />
        <Route
          path="/warning/effectiveness"
          element={<WarningEffectiveness />} />
        
        <Route path="/warning/cross-border" element={<WarningCrossBorder />} />
        <Route path="/warning/history" element={<WarningHistory />} />

        {/* Geographic Health Intelligence Module */}
        <Route path="/geo" element={<GeoOverview />} />
        <Route path="/geo/heat" element={<GeoHeatMap />} />
        <Route path="/geo/facilities" element={<GeoFacilities />} />
        <Route path="/geo/access" element={<GeoAccess />} />
        <Route path="/geo/animation" element={<GeoAnimation />} />
        <Route path="/geo/environment" element={<GeoEnvironment />} />
        <Route path="/geo/cross-border" element={<GeoCrossBorder />} />
        <Route path="/geo/vulnerability" element={<GeoVulnerability />} />
        <Route path="/geo/export" element={<GeoExport />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </AppProvider>);

}