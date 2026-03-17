"use client";
import React from 'react';
import Globe from 'react-globe.gl';

const hotspots = [
  { lat: 25.27, lng: 55.29, label: "DUBAI", color: "#f59e0b" },
  { lat: 40.71, lng: -74.00, label: "NEW YORK", color: "#ef4444" },
  { lat: 51.50, lng: -0.12, label: "LONDON", color: "#3b82f6" }
];

export default function EliteGlobe({ onPinClick }: { onPinClick: (data: any) => void }) {
  return (
    <Globe
      width={800}
      height={550}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      htmlElementsData={hotspots}
      htmlElement={(d: any) => {
        const el = document.createElement('div');
        el.className = "cursor-pointer";
        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-6 h-6 bg-emerald-500/20 rounded-full animate-ping"></div>
            <div class="relative bg-slate-900 border border-emerald-500/50 p-2 rounded-full text-emerald-500 shadow-xl">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `;
        el.onclick = () => onPinClick(d);
        return el;
      }}
    />
  );
}