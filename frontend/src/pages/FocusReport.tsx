import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Share2, CheckCircle, Clock, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FocusScoreGauge } from '@/components/FocusScoreGauge';
import { QualityMetrics } from '@/components/QualityMetrics';
import { MetricCard } from '@/components/MetricCard';
import { ProductivityChart } from '@/components/ProductivityChart';
import { DurationStats } from '@/components/DurationStats';
import { DistractionList } from '@/components/DistractionList';
import { ProductiveSitesList } from '@/components/ProductiveSitesList';
import { InsightBox } from '@/components/InsightBox';
import { SessionReport } from '@/types/session';
import { mockSessionReport, simulateApiDelay } from '@/data/mockData';

const FocusReport: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState<SessionReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      // Simulate API call: GET /session/:id/report
      const sessionId = location.state?.sessionId;
      console.log('Fetching report for session:', sessionId);
      
      await simulateApiDelay(800);
      setReport(mockSessionReport);
      setIsLoading(false);
    };

    fetchReport();
  }, [location.state]);

  const handleNewSession = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Generating your focus report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-2xl font-bold text-foreground">
                Focus Report Overview
              </h1>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              Actionable insights from your focus sessions
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleNewSession}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Session
            </Button>
            <Button variant="success">
              <Share2 className="w-4 h-4 mr-2" />
              Share Report
            </Button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left column - Score section */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            {/* Main score card */}
            <div className="focus-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-sm text-muted-foreground font-medium mb-4">Overall Focus Score</h3>
              <div className="flex items-start justify-between">
                <div>
                  <FocusScoreGauge score={report.overall_focus_score} />
                  <p className="text-xs text-success mt-2 text-center">
                    ↑ 5 Compared to previous period
                  </p>
                </div>
                <QualityMetrics 
                  focusQuality={report.focus_quality} 
                  resilience={report.resilience} 
                />
              </div>
            </div>

            {/* Productivity chart & Duration stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <ProductivityChart
                  productiveSeconds={report.productive_time_seconds}
                  unproductiveSeconds={report.unproductive_time_seconds}
                />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <DurationStats
                  totalMinutes={120}
                  avgMinutes={35}
                  maxMinutes={90}
                />
              </div>
            </div>
          </div>

          {/* Right column - Metrics and insight */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Top metrics row */}
            <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <MetricCard
                icon={CheckCircle}
                label="Successful Nudges"
                value={report.successful_nudges}
                unit="counts"
                variant="success"
              />
              <MetricCard
                icon={Clock}
                label="Est. Time Saved"
                value={report.estimated_time_saved_minutes}
                unit="minutes"
                variant="warning"
              />
            </div>

            {/* AI Insight box */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <InsightBox text={report.summary_text} />
            </div>

            {/* Distractions and Productive sites */}
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <DistractionList distractions={report.top_distractions} />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <ProductiveSitesList sites={report.productive_sites} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusReport;
