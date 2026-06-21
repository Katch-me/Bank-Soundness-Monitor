import { useState } from 'react';
import { 
  Activity, 
  Info, 
  FileText,
  Landmark,
  ExternalLink
} from 'lucide-react';
import { assessBank, isDSib } from './pcaLogic';
import type { BankAssessment, RiskGrade } from './pcaLogic';
import bankData from '../data/banks_q3fy26.json';

const BANK_IR_LINKS: Record<string, string> = {
  SBIN: "https://www.sbi.co.in/web/investor-relations/quarterly-results",
  HDFCBANK: "https://www.hdfcbank.com/personal/about-us/investor-relations/financial-results",
  ICICIBANK: "https://www.icicibank.com/about-us/investor-relations",
  PNB: "https://www.pnbindia.in/investor-relations.html",
  BANKBARODA: "https://www.bankofbaroda.in/investor-relations",
};

export default function App() {
  const [selectedBankTicker, setSelectedBankTicker] = useState<string>('SBIN');

  // Assess all banks using the PCA logic
  const banks: BankAssessment[] = bankData.banks.map((bank) => assessBank(bank));
  const selectedBank = banks.find((b) => b.ticker === selectedBankTicker) || banks[0];

  // Helpers for badge styles in the Light Theme
  const getBadgeStyle = (status: RiskGrade) => {
    switch (status) {
      case 'CLEAR':
        return 'bg-clear-bgLight text-clear-light border-clear-light/20';
      case 'THRESHOLD_1':
        return 'bg-watch-bgLight text-watch-light border-watch-light/20';
      case 'THRESHOLD_2':
        return 'bg-breach-bgLight text-breach-light border-breach-light/20 animate-pulse';
      case 'THRESHOLD_3':
        return 'bg-breach-bgLight text-breach-light border-red-600/30 font-bold';
      case 'PENDING':
      default:
        return 'bg-slate-100 text-slate-650 border-slate-200';
    }
  };

  const getStatusLabel = (status: RiskGrade) => {
    switch (status) {
      case 'CLEAR': return 'Clear';
      case 'THRESHOLD_1': return 'Threshold 1';
      case 'THRESHOLD_2': return 'Threshold 2';
      case 'THRESHOLD_3': return 'Threshold 3';
      case 'PENDING': return 'Data Pending';
    }
  };

  // SVG Chart Height and Width Calculations
  const chartHeight = 200; // Optimal height for 2-column grid
  const chartWidth = 500;
  const paddingBottom = 32;
  const paddingTop = 25;
  const paddingLeft = 50;
  const paddingRight = 20;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const plotWidth = chartWidth - paddingLeft - paddingRight;

  return (
    <div className="min-h-screen bg-refBg text-slate-800 font-sans pb-16">
      
      {/* Top Banner Disclaimer */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-800 text-xs py-1.5 px-4 text-center font-mono font-medium">
        <span className="font-bold">DISCLAIMER:</span> Independent regulatory-analytics exercise. Applying public PCA methodology to public figures. Not RBI's official supervisory classification.
      </div>

      <header className="border-b border-refBorder bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Regulatory Landmark Icon replacing the box */}
            <div className="w-12 h-12 rounded-lg bg-accent-light text-white flex items-center justify-center shadow-md">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-space font-bold text-xl leading-tight tracking-tight flex items-center gap-2 text-accent-light">
                <span>Bank Soundness early-warning monitor</span>
              </h1>
              <p className="text-xs text-slate-500 font-mono font-semibold">RBI PCA FRAMEWORK • {bankData.quarter}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 mt-6 space-y-6">
        
        {/* Why This Exists Block */}
        <section className="bg-gradient-to-r from-accent-light/5 to-accent-light/0 border border-refBorder rounded-xl p-4 md:p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent-light/10 rounded-lg text-accent-light">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-space font-bold text-lg text-slate-900 mb-1">Automated Supervisory Screening</h2>
              <p className="text-sm text-slate-650 leading-relaxed">
                Every quarter, scheduled commercial banks publish key capital adequacy and asset quality ratios. 
                This platform automates the first-pass screening that a supervisory analyst compiles manually. 
                It applies the basis-points grading rules of the RBI PCA framework (
                <a 
                  href="https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12186&Mode=0" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-accent-light underline font-medium hover:text-accent-light/80"
                >
                  Circular RBI/2021-22/118
                </a>) 
                to highlight structural banking weaknesses in real-time.
              </p>
            </div>
          </div>
        </section>

        {/* Row 1: Scorecard (left) & Focus Card (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Column 1: Regulatory Scorecard (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col">
            <section className="bg-refSurface border border-refBorder rounded-xl overflow-hidden shadow-md flex flex-col h-full">
              <div className="p-4 border-b border-refBorder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-space font-bold text-lg text-slate-900">Regulatory Scorecard</h2>
                  <p className="text-xs text-slate-500">Select a bank to view metrics breakdown.</p>
                </div>
                <div className="hidden sm:block flex-shrink-0">
                  <span className="text-[11px] font-sans font-semibold bg-clear-bgLight text-clear-light px-2.5 py-1 rounded-full border border-clear-light/10 whitespace-nowrap">
                    All 5 banks clear of PCA triggers
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase font-sans tracking-wider border-b border-refBorder">
                      <th className="py-3 px-4">Bank Entity</th>
                      <th className="py-3 px-3 text-right">CRAR</th>
                      <th className="py-3 px-3 text-right">Net NPA</th>
                      <th className="py-3 px-2 text-center">Capital</th>
                      <th className="py-3 px-2 text-center">Asset Quality</th>
                      <th className="py-3 px-2 text-center">Leverage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-refBorder text-sm">
                    {banks.map((bank) => {
                      const isSelected = selectedBankTicker === bank.ticker;
                      return (
                        <tr 
                          key={bank.ticker}
                          onClick={() => setSelectedBankTicker(bank.ticker)}
                          className={`cursor-pointer transition-all duration-150 select-none border-l-4 ${
                            isSelected 
                              ? 'bg-accent-light/10 border-accent-light font-medium' 
                              : 'hover:bg-slate-50 border-transparent'
                          }`}
                        >
                          {/* Name / Ticker */}
                          <td className="py-3 px-4 relative">
                            <div className="font-space font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{bank.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-0.5">
                                ({bank.ticker})
                                <a 
                                  href={BANK_IR_LINKS[bank.ticker]} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center text-slate-400 hover:text-accent-light transition-colors ml-0.5"
                                  title={`View ${bank.name} Q3 FY26 Investor Disclosures`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{bank.type} Sector</div>
                          </td>

                          {/* CRAR */}
                          <td className="py-3 px-3 text-right font-bold text-slate-900">
                            {bank.crar.value !== undefined ? `${bank.crar.value.toFixed(2)}%` : '—'}
                          </td>

                          {/* Net NPA */}
                          <td className="py-3 px-3 text-right font-bold text-slate-900">
                            {bank.netNpa.value !== undefined ? `${bank.netNpa.value.toFixed(2)}%` : '—'}
                          </td>

                          {/* Capital Status */}
                          <td className="py-3 px-2 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-sans border ${getBadgeStyle(bank.crar.status)}`}>
                              {getStatusLabel(bank.crar.status)}
                            </span>
                          </td>

                          {/* AQ Status */}
                          <td className="py-3 px-2 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-sans border ${getBadgeStyle(bank.netNpa.status)}`}>
                              {getStatusLabel(bank.netNpa.status)}
                            </span>
                          </td>

                          {/* Leverage Status */}
                          <td className="py-3 px-2 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-sans border ${getBadgeStyle(bank.leverage.status)}`}>
                              {getStatusLabel(bank.leverage.status)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Scorecard interaction tip */}
              <div className="p-3 bg-slate-50/50 border-t border-refBorder text-center text-xs text-slate-500 font-sans flex items-center justify-center gap-1.5 font-medium">
                <Info className="w-3.5 h-3.5 text-accent-light" />
                <span>Click any row to load its detailed distance-to-threshold metrics in the right sidebar.</span>
              </div>
            </section>
          </div>

          {/* Column 2: Supervisory Focus Card (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col">
            <section className="bg-refSurface border border-refBorder rounded-xl p-4 md:p-5 shadow-md relative overflow-hidden flex flex-col h-full justify-between">
              {/* Selection indicator border */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-accent-light" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-accent-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-light animate-ping" />
                    <span className="text-[10px] uppercase font-bold font-mono tracking-wider">Supervisory Focus Card</span>
                  </div>
                  <h2 className="font-space font-bold text-xl text-slate-900 mt-1">{selectedBank.name}</h2>
                  <a 
                    href={BANK_IR_LINKS[selectedBank.ticker]} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-[10px] text-accent-light hover:underline font-mono mt-0.5"
                    title={`Open ${selectedBank.name} Investor Relations Portal`}
                  >
                    <span>Official Investor Relations ↗</span>
                  </a>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-sans border ${getBadgeStyle(selectedBank.overallStatus)}`}>
                  {getStatusLabel(selectedBank.overallStatus)}
                </span>
              </div>

              <div className="space-y-4 flex-1 flex flex-col justify-around">
                {/* CRAR Details */}
                <div className="border-t border-refBorder pt-2">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-sm font-semibold text-slate-800">CRAR (Buffer Margin)</span>
                    <span className="font-bold text-sm text-slate-950">
                      {selectedBank.crar.value !== undefined ? `${selectedBank.crar.value.toFixed(2)}%` : '—'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {selectedBank.crar.thresholdInfo}
                  </div>
                  {selectedBank.crar.headroomBps !== undefined && (
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div 
                        className="bg-clear-light/60 h-1.5 rounded-full"
                        style={{ width: `${Math.min((selectedBank.crar.value || 0) / 20 * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* CET1 Details */}
                <div className="border-t border-refBorder pt-2">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-sm font-semibold text-slate-800">CET1 Capital Buffer</span>
                    <span className="font-bold text-sm text-slate-955">
                      {selectedBank.cet1.value !== undefined ? `${selectedBank.cet1.value.toFixed(2)}%` : '—'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {selectedBank.cet1.thresholdInfo}
                  </div>
                  {selectedBank.cet1.headroomBps !== undefined && (
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div 
                        className="bg-clear-light/60 h-1.5 rounded-full"
                        style={{ width: `${Math.min((selectedBank.cet1.value || 0) / 18 * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Net NPA Details */}
                <div className="border-t border-refBorder pt-2">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-sm font-semibold text-slate-800">Net NPA Ratio</span>
                    <span className="font-bold text-sm text-slate-955">
                      {selectedBank.netNpa.value !== undefined ? `${selectedBank.netNpa.value.toFixed(2)}%` : '—'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {selectedBank.netNpa.thresholdInfo}
                  </div>
                  {selectedBank.netNpa.headroomBps !== undefined && (
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div 
                        className="bg-clear-light/60 h-1.5 rounded-full"
                        style={{ width: `${Math.max(100 - ((selectedBank.netNpa.value || 0) / 6 * 100), 0)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Leverage Details */}
                <div className="border-t border-refBorder pt-2">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                      Leverage Ratio 
                      <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase font-mono">
                        {isDSib(selectedBank.ticker) ? 'D-SIB (4.0%)' : 'SCB (3.5%)'}
                      </span>
                    </span>
                    <span className="font-bold text-sm text-slate-400">
                      {selectedBank.leverage.value !== undefined ? `${selectedBank.leverage.value.toFixed(2)}%` : 'Pending'}
                    </span>
                  </div>
                  
                  {selectedBank.leverage.status === 'PENDING' ? (
                    <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-dashed border-refBorder mt-1.5">
                      <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-650 font-mono leading-relaxed">
                        Leverage ratio data is not published in current Q3 FY26 datasets. Metric marked as <span className="font-semibold text-slate-700">data pending</span>.
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {selectedBank.leverage.thresholdInfo}
                    </div>
                  )}
                </div>

              </div>
            </section>
          </div>
        </div>

        {/* Row 2: Cross-Bank Comparison (CRAR and Net NPA side by side) */}
        <section className="bg-refSurface border border-refBorder rounded-xl p-4 md:p-5 shadow-md">
          <h2 className="font-space font-bold text-lg text-slate-900 mb-1">Cross-Bank Comparison</h2>
          <p className="text-xs text-slate-500 mb-4">CRAR and Net NPA ratios relative to regulatory thresholds.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
            
            {/* CRAR Chart */}
            <div className="border border-refBorder rounded-lg p-4 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Capital Adequacy (CRAR %)</h3>
              <div className="relative">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                  {/* Y-axis gridlines */}
                  {[8, 10, 11.5, 14, 17, 20, 22].map((val) => {
                    const y = chartHeight - paddingBottom - ((val - 8) / 14) * plotHeight;
                    const isThreshold = val === 11.5;
                    return (
                      <g key={val}>
                        <line 
                          x1={paddingLeft} 
                          y1={y} 
                          x2={chartWidth - paddingRight} 
                          y2={y} 
                          className={isThreshold ? "stroke-red-300" : "stroke-refBorder"}
                          strokeWidth={1}
                          strokeDasharray={isThreshold ? "4 4" : "none"}
                        />
                        <text 
                          x={paddingLeft - 8} 
                          y={y + 4} 
                          className={`text-right fill-slate-500 ${isThreshold ? "fill-red-500 font-bold" : ""}`}
                          textAnchor="end"
                          fontSize="13"
                        >
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Bars */}
                  {banks.map((bank, index) => {
                    const value = bank.crar.value || 0;
                    const barWidth = Math.round(plotWidth / 5) - 20;
                    const x = paddingLeft + index * (plotWidth / 5) + 10;
                    const barHeight = ((value - 8) / 14) * plotHeight;
                    const y = chartHeight - paddingBottom - barHeight;
                    const isSelected = bank.ticker === selectedBankTicker;

                    return (
                      <g key={bank.ticker} className="cursor-pointer" onClick={() => setSelectedBankTicker(bank.ticker)}>
                        <rect 
                          x={x} 
                          y={y} 
                          width={barWidth} 
                          height={Math.max(barHeight, 2)} 
                          className={`transition-colors duration-150 ${
                            isSelected 
                              ? 'fill-accent-light' 
                              : 'fill-slate-300 hover:fill-slate-400'
                          }`}
                          rx="2"
                        />
                        {/* Value above bar */}
                        <text 
                          x={x + barWidth / 2} 
                          y={y - 5} 
                          className={`font-bold text-center fill-slate-800`}
                          textAnchor="middle"
                          fontSize="14"
                        >
                          {value.toFixed(1)}%
                        </text>
                        {/* Label below bar */}
                        <text 
                          x={x + barWidth / 2} 
                          y={chartHeight - 6} 
                          className={`fill-slate-550 ${isSelected ? 'fill-slate-900 font-bold' : ''}`}
                          textAnchor="middle"
                          fontSize="13"
                        >
                          {bank.ticker}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <div className="absolute top-2 right-2 text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-semibold shadow-sm">
                  Min Limit: 11.5%
                </div>
              </div>
            </div>

            {/* Net NPA Chart */}
            <div className="border border-refBorder rounded-lg p-4 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Asset Quality (Net NPA %)</h3>
              <div className="relative">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                  {/* Y-axis gridlines */}
                  {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => {
                    const y = chartHeight - paddingBottom - (val / 1.0) * plotHeight;
                    return (
                      <g key={val}>
                        <line 
                          x1={paddingLeft} 
                          y1={y} 
                          x2={chartWidth - paddingRight} 
                          y2={y} 
                          className="stroke-refBorder"
                          strokeWidth={1}
                        />
                        <text 
                          x={paddingLeft - 8} 
                          y={y + 4} 
                          className="text-right fill-slate-500"
                          textAnchor="end"
                          fontSize="13"
                        >
                          {val.toFixed(1)}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Bars */}
                  {banks.map((bank, index) => {
                    const value = bank.netNpa.value || 0;
                    const barWidth = Math.round(plotWidth / 5) - 20;
                    const x = paddingLeft + index * (plotWidth / 5) + 10;
                    const barHeight = (value / 1.0) * plotHeight;
                    const y = chartHeight - paddingBottom - barHeight;
                    const isSelected = bank.ticker === selectedBankTicker;

                    return (
                      <g key={bank.ticker} className="cursor-pointer" onClick={() => setSelectedBankTicker(bank.ticker)}>
                        <rect 
                          x={x} 
                          y={y} 
                          width={barWidth} 
                          height={Math.max(barHeight, 2)} 
                          className={`transition-colors duration-150 ${
                            isSelected 
                              ? 'fill-accent-light' 
                              : 'fill-slate-300 hover:fill-slate-400'
                          }`}
                          rx="2"
                        />
                        {/* Value above bar */}
                        <text 
                          x={x + barWidth / 2} 
                          y={y - 5} 
                          className={`font-bold text-center fill-slate-800`}
                          textAnchor="middle"
                          fontSize="14"
                        >
                          {value.toFixed(2)}%
                        </text>
                        {/* Label below bar */}
                        <text 
                          x={x + barWidth / 2} 
                          y={chartHeight - 6} 
                          className={`fill-slate-555 ${isSelected ? 'fill-slate-900 font-bold' : ''}`}
                          textAnchor="middle"
                          fontSize="13"
                        >
                          {bank.ticker}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <div className="absolute top-2 right-2 text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-semibold shadow-sm">
                  PCA Trigger: 6.00% (Off-Chart)
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Row 3: Supervisory Report Builder (bottom section) */}
        <section className="bg-refSurface border border-refBorder rounded-xl p-4 md:p-5 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="font-space font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-accent-light" />
                <span>Supervisory Report Builder</span>
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compile these exact metrics into a formatted Excel sheet with conditional formatting.
              </p>
            </div>
            <div className="bg-slate-100 p-3 rounded font-mono text-[10px] border border-refBorder overflow-x-auto whitespace-nowrap scrollbar-thin md:w-80 flex-shrink-0">
              <span className="text-slate-500"># Run generator script</span>
              <div className="text-accent-light font-semibold mt-0.5">pip install openpyxl</div>
              <div className="text-slate-850 mt-0.5">python scripts/build_report.py</div>
            </div>
          </div>
        </section>

      </main>

      {/* Methodology Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 mt-12 border-t border-refBorder pt-12">
        <h2 className="font-space font-bold text-xl text-slate-900 mb-6">PCA Framework Risk Rules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-refSurface border border-refBorder rounded-lg p-5">
            <div className="w-9 h-9 rounded-full bg-accent-light/10 text-accent-light flex items-center justify-center font-bold font-mono text-base mb-4">
              01
            </div>
            <h4 className="font-space font-bold text-base text-slate-900 mb-2">Capital Breaches (CRAR/CET1)</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Assessed relative to requirements containing the 2.50% Capital Conservation Buffer. 
              Trigger thresholds apply if capital falls up to 250 bps below (Risk 1), 250-400 bps below (Risk 2), or &gt;400 bps below (Risk 3).
            </p>
          </div>

          <div className="bg-refSurface border border-refBorder rounded-lg p-5">
            <div className="w-9 h-9 rounded-full bg-accent-light/10 text-accent-light flex items-center justify-center font-bold font-mono text-base mb-4">
              02
            </div>
            <h4 className="font-space font-bold text-base text-slate-900 mb-2">Asset Quality Breaches (Net NPA)</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Unlike capital, higher asset stress triggers PCA. 
              Risk thresholds invoke at 6.00% Net NPA ratio (Risk 1), 9.00% Net NPA (Risk 2), and 12.00% Net NPA (Risk 3).
            </p>
          </div>

          <div className="bg-refSurface border border-refBorder rounded-lg p-5">
            <div className="w-9 h-9 rounded-full bg-accent-light/10 text-accent-light flex items-center justify-center font-bold font-mono text-base mb-4">
              03
            </div>
            <h4 className="font-space font-bold text-base text-slate-900 mb-2">Aggregated Action Level</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              A breach of Risk 3 on any metric, or Risk 2 on two or more metrics, triggers severe supervisory mandates, 
              including restrictions on board-level compensation, dividend payouts, and branch network expansions.
            </p>
          </div>

        </div>
      </section>

      {/* Disclaimers & Data Notes Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 mt-12">
        <div className="bg-slate-50 border border-refBorder rounded-xl p-5 md:p-6 space-y-4">
          <h3 className="font-space font-bold text-base text-slate-900 flex items-center gap-2">
            <Info className="w-4.5 h-4.5 text-accent-light" />
            <span>Regulatory & Data Quality Disclaimers</span>
          </h3>
          <div className="space-y-4 text-[10px] md:text-xs text-slate-600 leading-relaxed font-mono">
            <p>
              <span className="font-bold text-slate-800">1. Independent Portfolio Project:</span> This early-warning monitor is an independent analytical exercise applying the public, published methodology of the RBI PCA framework to publicly available bank metrics. It does not represent, replicate, or substitute the official supervisory grading or prompt corrective action decisions of the Reserve Bank of India (RBI). Official classifications incorporate non-public inspector audits, compliance tracking, and discretionary oversight.
            </p>
            <p>
              <span className="font-bold text-slate-800">2. No Investment Advice:</span> The assessments, metrics, and risk gradings provided herein are for educational, demonstrative, and portfolio presentation purposes only. They do not constitute financial, investment, or regulatory advice.
            </p>
            <p>
              <span className="font-bold text-slate-800">3. Data Source & Veracity:</span> All figures (CRAR, CET1, Net NPA, Gross NPA) are extracted directly from official, public investor presentations, press releases, or stock exchange filings published by the respective banks for the quarter ended December 31, 2025 (Q3 FY26). No metrics have been estimated, forecasted, or adjusted. To view original documents, follow the investor relations links provided in the scorecard.
            </p>
            <p>
              <span className="font-bold text-slate-800">4. Data Completeness (Leverage Ratio):</span> Scheduled Commercial Banks do not always disclose the Tier-1 Leverage Ratio in standard quarterly press releases. In alignment with our strict data-integrity standards, we display <span className="font-semibold text-slate-700">"Data Pending"</span> for these missing values rather than using obsolete data or fabricating estimates.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="max-w-6xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-refBorder flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span className="font-semibold text-slate-600">Bank Soundness Monitor</span> — Developed using <a href="https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12186&Mode=0" target="_blank" rel="noopener noreferrer" className="hover:text-accent-light underline transition-colors font-medium">RBI Circular RBI/2021-22/118</a>.
        </div>
        <div className="flex gap-6">
          <a href="https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12186&Mode=0" target="_blank" rel="noopener noreferrer" className="hover:text-accent-light underline transition-colors font-medium">RBI Circular</a>
          <span>Data: Public Investor Disclosures ({bankData.quarter})</span>
        </div>
      </footer>

    </div>
  );
}
