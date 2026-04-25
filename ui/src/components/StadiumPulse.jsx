"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Chip from "./ui_c/Chip";
import { askStadiumAI } from "../lib/aiService";
import geminiService from "../lib/geminiService";

// Real data from live match: DC vs PBKS at Arun Jaitley Stadium
const INITIAL_DATA = {
  venue: "Arun Jaitley Stadium, Delhi",
  match: "DC vs PBKS - IPL 2026",
  score: "DC 213/1 (16)",
  crowdDensity: 88,
  gates: [
    {
      id: 1,
      name: "Gate 1 (V. Sehwag Gate)",
      waitTime: 4,
      status: "Clear",
      load: 15,
    },
    {
      id: 2,
      name: "Gate 3 (Delhi Metro)",
      waitTime: 22,
      status: "Busy",
      load: 92,
    },
    {
      id: 3,
      name: "Gate 5 (Main Entrance)",
      waitTime: 12,
      status: "Moderate",
      load: 60,
    },
  ],
  concessions: [
    { id: 1, name: "Old Delhi Chaat", waitTime: 15, popular: "Aloo Tikki" },
    {
      id: 2,
      name: "Capital Grills",
      waitTime: 8,
      popular: "Paneer Tikka Roll",
    },
    { id: 3, name: "Metro Brews", waitTime: 3, popular: "Cold Coffee" },
  ],
  facilities: [
    { id: 1, name: "Stand A Restrooms", load: 85, status: "Busy" },
    { id: 2, name: "Club Lounge Toilets", load: 20, status: "Available" },
  ],
};

export default function StadiumPulse() {
  const [data, setData] = useState(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState("overview");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "ai",
      content:
        "Welcome to Quantum Arena! I'm your digital concierge. How can I assist you today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const [mounted, setMounted] = useState(false);

  const [sectorLoads, setSectorLoads] = useState([]);

  // Initialize sectors on mount to avoid hydration error
  useEffect(() => {
    setMounted(true);
    setSectorLoads(
      [0, 45, 90, 135, 180, 225, 270, 315].map(() => Math.random() > 0.7),
    );
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        crowdDensity: Math.min(
          100,
          Math.max(0, prev.crowdDensity + (Math.random() > 0.5 ? 1 : -1)),
        ),
        gates: prev.gates.map((g) => ({
          ...g,
          waitTime: Math.max(2, g.waitTime + (Math.random() > 0.6 ? 1 : -1)),
        })),
      }));
      // Also update random sector intensities
      setSectorLoads((prev) => prev.map(() => Math.random() > 0.7));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Polling for live score
  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await fetch('/api/match-score');
        const data = await res.json();
        if (data.score && data.score !== 'Score Unavailable') {
          setData(prev => ({ ...prev, score: data.score }));
        }
      } catch (err) {
        console.error('Failed to fetch live score:', err);
      }
    };
    
    fetchScore(); // Initial fetch
    const scoreInterval = setInterval(fetchScore, 30000); // Every 30s
    return () => clearInterval(scoreInterval);
  }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    let aiResponse;
    // Check if Gemini is configured, otherwise use Ollama
    if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      const matchState = {
        live: { score: data.score, status: "Live Match" },
        stadium: {
          gates: data.gates,
          concessions: data.concessions,
          facilities: data.facilities
        }
      };
      aiResponse = await geminiService.answerQuestion(chatInput, matchState);
    } else {
      aiResponse = await askStadiumAI(
        chatInput,
        `Current stadium stats: Crowd density ${data.crowdDensity}%, Gate 3 is busiest with 25m wait.`
      );
    }

    setChatMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-[#010B14] text-white font-sans selection:bg-primary-500/30">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-900/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500 rounded-xl shadow-[0_0_20px_rgba(10,105,201,0.5)]">
            <Icon
              icon="solar:bolt-bold-duotone"
              className="text-2xl text-white"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              STADIUM<span className="text-primary-400">PULSE</span>
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Live Intelligence Core
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end gap-0.5 px-4 py-2 bg-primary-500/10 rounded-2xl border border-primary-500/20">
            <p className="text-[10px] text-primary-400 font-bold uppercase tracking-widest">
              Live Score
            </p>
            <p className="text-sm font-black text-white">
              {data.match}: {data.score}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 h-10">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-300">Live</span>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors h-10 w-10 flex items-center justify-center">
            <Icon
              icon="solar:bell-bold-duotone"
              className="text-xl text-gray-400"
            />
          </button>
        </div>
      </header>

      <main className="relative z-10 p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Map & Overview */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Map Card */}
          <section className="bg-white/[0.03] border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl group">
            <div className="p-8 flex items-center justify-between border-b border-white/5">
              <div>
                <h2 className="text-2xl font-bold">Interactive Density Map</h2>
                <p className="text-gray-400 text-sm">
                  Real-time crowd flow and bottleneck detection
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "overview" ? "bg-primary-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("heat")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "heat" ? "bg-primary-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                >
                  Heatmap
                </button>
              </div>
            </div>

            <div className="aspect-[16/9] bg-[#020D18] relative flex items-center justify-center p-8">
              {!mounted ? (
                <div className="flex flex-col items-center gap-4 animate-pulse">
                  <div className="w-32 h-32 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
                  <p className="text-primary-400 font-bold tracking-widest text-xs uppercase">
                    Initializing Map...
                  </p>
                </div>
              ) : (
                <svg
                  viewBox="0 0 800 450"
                  className="w-full h-full max-w-2xl drop-shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                  {/* Stadium Outer Ring */}
                  <path
                    d="M400,25 C150,25 50,125 50,225 C50,325 150,425 400,425 C650,425 750,325 750,225 C750,125 650,25 400,25"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="40"
                  />

                  {/* Field */}
                  <rect
                    x="250"
                    y="150"
                    width="300"
                    height="150"
                    rx="20"
                    fill="#0A2A1A"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                  />
                  <line
                    x1="400"
                    y1="150"
                    x2="400"
                    y2="300"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <circle
                    cx="400"
                    cy="225"
                    r="30"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                  />

                  {/* Seating Sectors */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const x = 400 + Math.cos(rad) * 180;
                    const y = 225 + Math.sin(rad) * 120;
                    const isBusy = sectorLoads[i] || false;
                    const intensity = isBusy
                      ? "rgba(219, 20, 57, 0.4)"
                      : "rgba(10, 105, 201, 0.2)";
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r="40"
                          fill={intensity}
                          className="animate-pulse"
                          style={{ animationDuration: `${2 + i}s` }}
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill="white"
                          fillOpacity="0.5"
                        />
                      </g>
                    );
                  })}

                  {/* Hotspots */}
                  <circle
                    cx="680"
                    cy="150"
                    r="15"
                    fill="#DB1439"
                    className="animate-ping"
                    style={{ animationDuration: "3s" }}
                  />
                  <circle cx="680" cy="150" r="8" fill="#DB1439" />
                  <text
                    x="690"
                    y="140"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    CONGESTION
                  </text>
                </svg>
              )}

              {/* Map Overlays */}
              <div className="absolute top-6 left-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">
                  Current Capacity
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">42,503</span>
                  <span className="text-success-400 text-xs font-bold">
                    85% Full
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[24px] hover:bg-white/[0.05] transition-colors">
              <Icon
                icon="solar:users-group-two-rounded-bold-duotone"
                className="text-3xl text-primary-400 mb-4"
              />
              <p className="text-sm text-gray-400 font-medium">Crowd Density</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">{data.crowdDensity}%</span>
                <span className="text-xs text-warning-400">Stable</span>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[24px] hover:bg-white/[0.05] transition-colors">
              <Icon
                icon="solar:clock-circle-bold-duotone"
                className="text-3xl text-secondary-400 mb-4"
              />
              <p className="text-sm text-gray-400 font-medium">
                Avg. Wait Time
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">12m</span>
                <span className="text-xs text-success-400">-2m lower</span>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[24px] hover:bg-white/[0.05] transition-colors">
              <Icon
                icon="solar:map-point-bold-duotone"
                className="text-3xl text-success-400 mb-4"
              />
              <p className="text-sm text-gray-400 font-medium">Best Gate</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold">North Gate</span>
                <span className="text-xs text-success-400">2m wait</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Queues & Facilities */}
        <div className="lg:col-span-4 space-y-8">
          {/* Gate Status Card */}
          <section className="bg-white/[0.03] border border-white/10 p-6 rounded-[32px] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Access Points</h3>
              <Chip size="sm" color="info" variant="flat">
                All Open
              </Chip>
            </div>
            <div className="space-y-4">
              {data.gates.map((gate) => (
                <div
                  key={gate.id}
                  className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${gate.status === "Busy" ? "bg-danger-500/20 text-danger-400" : "bg-success-500/20 text-success-400"}`}
                    >
                      <Icon
                        icon="solar:entry-bold-duotone"
                        className="text-xl"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{gate.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                        Security Level: Standard
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${gate.waitTime > 20 ? "text-danger-400" : gate.waitTime > 10 ? "text-warning-400" : "text-success-400"}`}
                    >
                      {gate.waitTime}m
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">
                      {gate.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Concessions Card */}
          <section className="bg-white/[0.03] border border-white/10 p-6 rounded-[32px] backdrop-blur-xl">
            <h3 className="text-lg font-bold mb-6">Fastest Concessions</h3>
            <div className="space-y-4">
              {data.concessions.map((stall) => (
                <div
                  key={stall.id}
                  className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/[0.08] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold">{stall.name}</p>
                    <span className="text-xs font-bold text-warning-400">
                      {stall.waitTime}m wait
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    Popular: {stall.popular}
                  </p>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-warning-500 h-full transition-all duration-1000"
                      style={{
                        width: `${Math.max(20, 100 - stall.waitTime * 4)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Smart Alerts */}
          <div className="bg-primary-500/10 border border-primary-500/20 p-6 rounded-[24px] relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Icon
                icon="solar:magic-stick-3-bold-duotone"
                className="text-6xl text-primary-500"
              />
            </div>
            <p className="text-[10px] text-primary-400 uppercase font-bold mb-1">
              Proactive Insight
            </p>
            <p className="text-sm font-medium text-white/90">
              Move to{" "}
              <span className="font-bold text-primary-400">North Gate</span> now
              to avoid the post-match rush. Current wait time: 2m.
            </p>
          </div>
        </div>
      </main>

      {/* AI Concierge Chat Widget */}
      <div
        className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${chatOpen ? "w-[350px]" : "w-16 h-16"}`}
      >
        {chatOpen ? (
          <div className="bg-[#021528] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[500px] animate-fade-in">
            <div className="p-6 bg-primary-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                  <Icon
                    icon="solar:ghost-bold-duotone"
                    className="text-xl text-white"
                  />
                </div>
                <div>
                  <p className="font-bold text-white">Stadium Concierge</p>
                  <p className="text-[10px] text-white/70">
                    Powered by Ollama AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <Icon icon="solar:close-circle-bold" className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-[20px] text-sm ${msg.role === "user" ? "bg-primary-500 text-white rounded-tr-none" : "bg-white/5 text-gray-200 rounded-tl-none border border-white/5"}`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-[20px] rounded-tl-none border border-white/5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5">
              <div className="flex items-center gap-2 bg-white/5 rounded-2xl p-2 border border-white/10 focus-within:border-primary-500/50 transition-colors">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-white placeholder:text-gray-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-primary-500 rounded-xl hover:bg-primary-400 transition-colors shadow-lg"
                >
                  <Icon icon="solar:plain-bold" className="text-white" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="w-16 h-16 bg-primary-500 rounded-full shadow-[0_0_30px_rgba(10,105,201,0.5)] flex items-center justify-center hover:scale-110 transition-all group"
          >
            <Icon
              icon="solar:ghost-bold-duotone"
              className="text-3xl text-white group-hover:rotate-12 transition-transform"
            />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 border-2 border-[#010B14] rounded-full flex items-center justify-center text-[10px] font-bold">
              1
            </div>
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
