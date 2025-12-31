import React from 'react';
import { BrandBadge } from './BrandBadge';

export const BrandBar: React.FC = () => (
  <div className="fixed top-5 left-6 z-30">
    <BrandBadge />
  </div>
);
