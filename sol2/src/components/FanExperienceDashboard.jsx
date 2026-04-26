"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Chip from "./ui_c/Chip";
import geminiService from "../lib/geminiService";
import stadiumStore, { INITIAL_STADIUM_STATE } from "../lib/stadiumState";

export default function FanExperienceDashboard() {
  const [state, setState] = useState(stadiumStore.state);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "ai",
      content:
        "Welcome to the Fan Experience Hub! I'm your Quantum Concierge. DC is currently on a roll—need a quick snack break before the next over?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("match"); // match, facilities, transport

  // Simulate dynamic updates
  useEffect(() => {
    const interval = setInterval(() => {
      const intensities = ["Low", "Medium", "High"];
      const randomIntensity = intensities[Math.floor(Math.random() * intensities.length)];
      
      setState(prev => ({
        ...prev,
        match: {
          ...prev.match,
          intensity: randomIntensity
        },
        facilities: {
          ...prev.facilities,
          network: {
            ...prev.facilities.network,
            signalStrength: Math.min(100, Math.max(20, prev.facilities.network.signalStrength + (Math.random() > 0.5 ? 2 : -2)))
          }
        }
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    const aiResponse = await geminiService.getConciergeResponse(chatInput, state);

    setChatMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
    setIsTyping(false);
  };

  const breakRec = stadiumStore.getBreakRecommendation();

  return (
    <div className="min-h-screen bg-[#010810] text-white font-sans selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-blue-900/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[45%] h-[45%] bg-green-900/10 rounded-full blur-[140px] animate-pulse" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-20 px-8 py-5 flex items-center justify-between backdrop-blur-xl border-b border-white/5 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/20">
            <Icon icon="solar:crown-minimalistic-bold-duotone" className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase">
              FAN<span className="text-blue-400">PULSE</span>
            </h1>
            <p className="text-[10px] text-blue-400/70 font-bold uppercase tracking-widest">Experience Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-white/5 rounded-2xl border border-white/10">
            {["match", "facilities", "transport"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === t ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              >
                {t}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Live at</p>
                <p className="text-xs font-bold text-white/90">Arun Jaitley Stadium</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <Icon icon="solar:user-bold-duotone" className="text-xl text-gray-400" />
             </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Live Match & Replays */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Experience Card */}
          <section className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-2xl">
            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex flex-col items-center justify-center border border-blue-500/20 group hover:bg-blue-600/30 transition-all cursor-pointer">
                    <Icon icon="solar:play-circle-bold-duotone" className="text-4xl text-blue-400 group-hover:scale-110 transition-transform" />
                    <p className="text-[8px] font-bold mt-1 uppercase text-blue-400">Replays</p>
                 </div>
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                       <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Action</span>
                    </div>
                    <h2 className="text-4xl font-black italic tracking-tighter">{state.match.score}</h2>
                    <p className="text-gray-400 font-medium">{state.match.status}</p>
                 </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <Chip color={state.match.intensity === "High" ? "danger" : "primary"} variant="flat">
                    {state.match.intensity} Intensity Play
                 </Chip>
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-[#010810] bg-gray-800 flex items-center justify-center text-[10px] font-bold">
                          {i}
                       </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-[#010810] bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                       +42k
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Proactive Break Widget */}
               <div className={`p-6 rounded-[32px] border transition-all duration-500 ${breakRec.recommendation === "High" ? "bg-green-500/10 border-green-500/20" : "bg-white/5 border-white/10"}`}>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <Icon icon="solar:tea-cup-bold-duotone" className={`text-2xl ${breakRec.recommendation === "High" ? "text-green-400" : "text-gray-400"}`} />
                        <h3 className="font-bold">Smart Break Suggestion</h3>
                     </div>
                     <Icon icon="solar:info-circle-bold-duotone" className="text-gray-500" />
                  </div>
                  <p className="text-2xl font-black mb-2">{breakRec.recommendation === "High" ? "Go Now!" : "Wait..."}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{breakRec.reason}</p>
                  {breakRec.recommendation === "High" && (
                     <button className="mt-4 w-full py-3 bg-green-500 text-black font-black rounded-2xl hover:bg-green-400 transition-colors uppercase text-xs tracking-widest">
                        View Shortest Queues
                     </button>
                  )}
               </div>

               {/* Key Moments / Replays */}
               <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest">Instant Highlights</h3>
                  {state.match.keyMoments.map(moment => (
                     <div key={moment.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xs font-black text-white group-hover:bg-blue-600 transition-colors">
                           {moment.time}
                        </div>
                        <div className="flex-1">
                           <p className="text-xs font-bold text-blue-400 uppercase tracking-tighter">{moment.type}</p>
                           <p className="text-sm font-medium line-clamp-1">{moment.desc}</p>
                        </div>
                        <Icon icon="solar:arrow-right-up-bold" className="text-gray-600 group-hover:text-white transition-colors" />
                     </div>
                  ))}
               </div>
            </div>
          </section>

          {/* Solution Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Network Health */}
             <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[32px] relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold flex items-center gap-2">
                      <Icon icon="solar:transmission-bold-duotone" className="text-cyan-400 text-xl" />
                      Network Health
                   </h3>
                   <span className="text-xs font-black text-cyan-400 uppercase">{state.facilities.network.status}</span>
                </div>
                <div className="flex items-center gap-6">
                   <div className="relative w-20 h-20">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                         <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                         <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray={`${state.facilities.network.signalStrength}, 100`} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-lg font-black">{state.facilities.network.signalStrength}%</span>
                      </div>
                   </div>
                   <div className="space-y-2 flex-1">
                      {state.facilities.network.zones.map((zone, i) => (
                         <div key={i} className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-gray-500 uppercase">{zone.name}</span>
                            <span className={zone.signal < 50 ? "text-red-400" : "text-green-400"}>{zone.signal < 50 ? "CONGESTED" : "CLEAR"}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Value Finder (Food/Deals) */}
             <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[32px] group cursor-pointer hover:bg-white/[0.05] transition-all">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold flex items-center gap-2">
                      <Icon icon="solar:tag-price-bold-duotone" className="text-yellow-400 text-xl" />
                      Value Finder
                   </h3>
                   <Icon icon="solar:fire-bold" className="text-orange-500 animate-bounce" />
                </div>
                <div className="space-y-4">
                   {state.facilities.concessions.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:border-yellow-500/30 transition-all">
                         <div>
                            <p className="text-sm font-bold">{c.name}</p>
                            <p className="text-[10px] text-yellow-500 font-black uppercase tracking-tighter">{c.deal}</p>
                         </div>
                         <Icon icon="solar:cart-large-bold" className="text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Right Section: Logistics & Navigation */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Entry & Wayfinding */}
           <section className="bg-white/[0.03] border border-white/10 p-6 rounded-[32px] backdrop-blur-xl">
              <h3 className="text-sm font-black uppercase text-gray-500 tracking-widest mb-6">Access Intelligence</h3>
              <div className="space-y-4">
                 {state.facilities.gates.map(gate => (
                    <div key={gate.id} className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-blue-500/50 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${gate.load > 80 ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"}`}>
                             <Icon icon="solar:walking-bold-duotone" className="text-2xl" />
                          </div>
                          <div>
                             <p className="font-bold">{gate.name}</p>
                             <div className="flex items-center gap-1 mt-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${gate.load > 80 ? "bg-red-500" : "bg-green-500"}`} />
                                <span className="text-[10px] font-bold text-gray-500 uppercase">{gate.load > 80 ? "Heavy Traffic" : "Fast Entry"}</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={`text-xl font-black ${gate.waitTime > 15 ? "text-red-400" : "text-white"}`}>{gate.waitTime}m</p>
                          <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Security</p>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="mt-6 w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                 <Icon icon="solar:map-point-wave-bold-duotone" className="text-lg text-blue-400" />
                 Launch 3D Wayfinding
              </button>
           </section>

           {/* Hygiene & Maintenance */}
           <section className="bg-white/[0.03] border border-white/10 p-6 rounded-[32px]">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-sm font-black uppercase text-gray-500 tracking-widest">Maintenance</h3>
                 <span className="p-1.5 bg-green-500/10 rounded-lg"><Icon icon="solar:check-read-bold" className="text-green-500" /></span>
              </div>
              <div className="space-y-3">
                 {state.facilities.hygiene.map(h => (
                    <div key={h.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                       <span className="text-xs font-bold">{h.name}</span>
                       <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase ${h.status === "Clean" ? "text-green-500" : "text-orange-500"}`}>{h.status}</span>
                          {h.status !== "Clean" && <button className="px-2 py-1 bg-white/10 rounded-lg text-[8px] font-bold uppercase">Reported</button>}
                       </div>
                    </div>
                 ))}
              </div>
              <button className="mt-4 w-full p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                 Report Maintenance Issue
              </button>
           </section>

           {/* Exit Strategy */}
           <div className="p-8 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-[32px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Icon icon="solar:bus-bold-duotone" className="text-8xl text-white" />
              </div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Egress Strategy</p>
              <p className="text-lg font-black mb-1">Recommended: {state.traffic.bestMode}</p>
              <p className="text-sm text-white/70 mb-6">Traffic is currently {state.traffic.status}. Est. exit time: {state.traffic.egressTime}.</p>
              <div className="flex gap-2">
                 <button className="flex-1 py-3 bg-blue-600 text-white text-[10px] font-black rounded-xl uppercase tracking-tighter">Live Traffic Map</button>
                 <button className="px-4 py-3 bg-white/10 text-white rounded-xl"><Icon icon="solar:share-bold" /></button>
              </div>
           </div>
        </div>
      </main>

      {/* Quantum Concierge Chat */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${chatOpen ? "w-[420px]" : "w-16 h-16"}`}>
        {chatOpen ? (
          <div className="bg-[#040D16] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[600px] animate-fade-in backdrop-blur-3xl">
            <div className="p-8 bg-gradient-to-r from-blue-700 to-cyan-600 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Icon icon="solar:magic-stick-3-bold-duotone" className="text-2xl text-white" />
                </div>
                <div>
                  <p className="font-black text-white uppercase tracking-tighter">Quantum Concierge</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Active Analysis</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <Icon icon="solar:close-circle-bold" className="text-3xl" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-5 rounded-[24px] text-sm leading-relaxed shadow-lg ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/5 text-gray-200 rounded-tl-none border border-white/10"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-5 rounded-[24px] rounded-tl-none border border-white/10 flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white/5 border-t border-white/5">
              <div className="flex items-center gap-3 bg-white/5 rounded-[24px] p-2.5 border border-white/10 focus-within:border-blue-500/50 transition-all">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask for a break or a deal..."
                  className="flex-1 bg-transparent border-none outline-none text-sm px-3 text-white placeholder:text-gray-500"
                />
                <button onClick={handleSendMessage} className="p-3 bg-blue-600 rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/40">
                  <Icon icon="solar:plain-bold" className="text-white text-xl" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-[28px] shadow-2xl shadow-blue-500/40 flex items-center justify-center hover:scale-110 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon icon="solar:magic-stick-3-bold-duotone" className="text-4xl text-white group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
