import React from 'react';
import { Card } from './ui/card';

const ColorVowelLegend = () => {
  return (
    <Card className="p-4 md:p-6" data-testid="color-vowel-chart-card">
      <h3 className="text-lg font-semibold mb-4">Color Vowel Chart</h3>
      <div className="mx-auto" style={{ maxWidth: '700px' }}>
        <img
          src={`${process.env.PUBLIC_URL}/color-vowel-chart.png`}
          alt="Color Vowel Chart"
          className="w-full h-auto rounded-lg"
          data-testid="color-vowel-chart-image"
        />
      </div>
    </Card>
  );
};

export default ColorVowelLegend;
