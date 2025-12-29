import React from 'react';
import { ExternalLink, Code, BookOpen, Briefcase, GraduationCap, Terminal } from 'lucide-react';

interface ProductiveSitesListProps {
  sites: string[];
}

const getIcon = (site: string) => {
  const lower = site.toLowerCase();
  if (lower.includes('stack') || lower.includes('coding')) return Code;
  if (lower.includes('documentation') || lower.includes('docs')) return BookOpen;
  if (lower.includes('project') || lower.includes('management')) return Briefcase;
  if (lower.includes('course') || lower.includes('learning')) return GraduationCap;
  if (lower.includes('terminal') || lower.includes('platform')) return Terminal;
  return ExternalLink;
};

// Dummy counts for display
const getCounts = (index: number): number => {
  const counts = [20, 15, 12, 10, 8];
  return counts[index] || 5;
};

export const ProductiveSitesList: React.FC<ProductiveSitesListProps> = ({ sites }) => {
  return (
    <div className="focus-card">
      <h3 className="font-display font-semibold text-lg mb-4">Top Productive Sites</h3>
      <div className="space-y-3">
        {sites.map((site, index) => {
          const Icon = getIcon(site);
          return (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-success/10 rounded-lg">
                  <Icon className="w-4 h-4 text-success" />
                </div>
                <span className="text-sm font-medium">{site}</span>
              </div>
              <span className="text-sm text-muted-foreground">{getCounts(index)} counts</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
