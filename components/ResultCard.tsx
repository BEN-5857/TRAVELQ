import React from 'react';

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, icon, children }) => (
  <div className="w-full card backdrop-blur-lg rounded-2xl shadow-2xl p-6 animate-fade-in">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-cyan-400">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div>{children}</div>
  </div>
);

export default ResultCard;
