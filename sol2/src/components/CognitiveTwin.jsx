"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Chip from "./ui_c/Chip";
import geminiService from "../lib/geminiService";
import cognitiveStore from "../lib/cognitiveStore";

export default function CognitiveTwin() {
  const [graph, setGraph] = useState(cognitiveStore.state.graph);
  const [vitals, setVitals] = useState(cognitiveStore.state.vitals);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "ai",
      content:
        "Neural synchronization complete. I am your Cognitive Twin. What concept shall we map out today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state from cognitiveStore
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slight focus fluctuations or memory decay
      setVitals(prev => ({
        ...prev,
        focusLevel: Math.min(100, Math.max(70, prev.focusLevel + (Math.random() > 0.5 ? 1 : -1))),
        memoryRetention: Math.max(50, prev.memoryRetention - 0.01)
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    const cognitiveSummary = cognitiveStore.getSummary();
    const responseText = await geminiService.getAdaptiveResponse(chatInput, {
      vitals,
      graph,
      summary: cognitiveSummary
    });

    // Parse cognitive update if present
    let cleanResponse = responseText;
    if (responseText.includes("---")) {
      const parts = responseText.split("---");
      cleanResponse = parts[0].trim();
      try {
        const updatePart = parts[1].replace("COGNITIVE_UPDATE:", "").trim();
        const updateData = JSON.parse(updatePart);
        
        if (updateData.conceptUpdates) {
          Object.entries(updateData.conceptUpdates).forEach(([id, delta]) => {
            cognitiveStore.updateConcept(id, delta);
          });
          setGraph({...cognitiveStore.state.graph});
          setVitals({...cognitiveStore.state.vitals});
        }
      } catch (e) {
        console.error("Failed to parse cognitive update", e);
      }
    }

    setChatMessages((prev) => [...prev, { role: "ai", content: cleanResponse }]);
    setIsTyping(false);
  };

  const signalConfusion = () => {
    setChatInput("I'm feeling a bit lost on this concept. Can you explain it differently?");
    setVitals(prev => ({ ...prev, focusLevel: Math.max(50, prev.focusLevel - 10) }));
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans selection:bg-purple-500/30">
      {/* Background Neural Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Icon
              icon="solar:mask-h-bold-duotone"
              className="text-2xl text-white"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              COGNITIVE<span className="text-purple-400">TWIN</span>
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Self-Evolving Learning Core
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end gap-0.5 px-4 py-2 bg-purple-500/10 rounded-2xl border border-purple-500/20">
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">
              Learning Velocity
            </p>
            <p className="text-sm font-black text-white">
              {vitals.learningVelocity} concepts/hr
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 h-10">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />
            <span className="text-sm font-medium text-gray-300">Sync Active</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Knowledge Graph */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white/[0.03] border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl group">
            <div className="p-8 flex items-center justify-between border-b border-white/5">
              <div>
                <h2 className="text-2xl font-bold italic">Knowledge Synapse Map</h2>
                <p className="text-gray-400 text-sm">
                  Real-time visualization of your conceptual framework
                </p>
              </div>
              <div className="flex gap-2">
                <Chip color="secondary" variant="flat">2.5-Flash Active</Chip>
              </div>
            </div>

            <div className="aspect-[16/9] bg-[#020D18] relative flex items-center justify-center p-8 overflow-hidden">
              {!mounted ? (
                <div className="flex flex-col items-center gap-4 animate-pulse">
                  <div className="w-32 h-32 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <p className="text-purple-400 font-bold tracking-widest text-xs uppercase">
                    Mapping Neural Path...
                  </p>
                </div>
              ) : (
                <svg
                  viewBox="0 0 800 450"
                  className="w-full h-full max-w-3xl drop-shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                  {/* Connections (Edges) */}
                  {graph.edges.map((edge) => {
                    const source = graph.nodes.find(n => n.id === edge.source);
                    const target = graph.nodes.find(n => n.id === edge.target);
                    if (!source || !target) return null;
                    return (
                      <line
                        key={edge.id}
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke="rgba(168, 85, 247, 0.2)"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    );
                  })}

                  {/* Nodes */}
                  {graph.nodes.map((node) => {
                    const isMastered = node.level > 0.8;
                    const isStruggling = node.level < 0.2 && node.level > 0;
                    const color = isMastered ? "#10B981" : isStruggling ? "#EF4444" : "#A855F7";
                    
                    return (
                      <g key={node.id} className="cursor-pointer group">
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size}
                          fill={`${color}20`}
                          stroke={color}
                          strokeWidth="2"
                          className={node.level > 0 ? "animate-pulse" : ""}
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size * node.level}
                          fill={color}
                          fillOpacity="0.4"
                        />
                        <text
                          x={node.x}
                          y={node.y + node.size + 20}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                          className="opacity-60 group-hover:opacity-100 transition-opacity"
                        >
                          {node.name}
                        </text>
                        <text
                          x={node.x}
                          y={node.y + 4}
                          textAnchor="middle"
                          fill="white"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {Math.round(node.level * 100)}%
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}

              {/* Legend */}
              <div className="absolute bottom-6 left-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success-500" />
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Mastered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger-500" />
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Friction</span>
                </div>
              </div>
            </div>
          </section>

          {/* Cognitive Vitals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[24px] hover:bg-white/[0.05] transition-colors">
              <Icon
                icon="solar:brain-bold-duotone"
                className="text-3xl text-purple-400 mb-4"
              />
              <p className="text-sm text-gray-400 font-medium">Memory Retention</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">{Math.round(vitals.memoryRetention)}%</span>
                <span className="text-xs text-danger-400">-0.2% decay</span>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[24px] hover:bg-white/[0.05] transition-colors">
              <Icon
                icon="solar:graph-up-bold-duotone"
                className="text-3xl text-blue-400 mb-4"
              />
              <p className="text-sm text-gray-400 font-medium">Conceptual Depth</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">{vitals.conceptualDepth}%</span>
                <span className="text-xs text-success-400">Expanding</span>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[24px] hover:bg-white/[0.05] transition-colors">
              <Icon
                icon="solar:eye-bold-duotone"
                className="text-3xl text-yellow-400 mb-4"
              />
              <p className="text-sm text-gray-400 font-medium">Focus Intensity</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">{vitals.focusLevel}%</span>
                <span className={`text-xs ${vitals.focusLevel > 80 ? "text-success-400" : "text-warning-400"}`}>
                  {vitals.focusLevel > 80 ? "Flow State" : "Wandering"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pathways & Interventions */}
        <div className="lg:col-span-4 space-y-8">
          {/* Learning Pathway */}
          <section className="bg-white/[0.03] border border-white/10 p-6 rounded-[32px] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold italic">Neural Pathways</h3>
              <Chip size="sm" color="secondary" variant="flat">
                Adaptive
              </Chip>
            </div>
            <div className="space-y-4">
              {graph.nodes.slice(1).map((node) => (
                <div
                  key={node.id}
                  className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${node.level > 0.5 ? "bg-success-500/20 text-success-400" : "bg-purple-500/20 text-purple-400"}`}
                    >
                      <Icon
                        icon={node.level > 0.8 ? "solar:check-circle-bold-duotone" : "solar:re-order-bold-duotone"}
                        className="text-xl"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{node.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                        Difficulty: Level {node.size / 10}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${node.level > 0.8 ? "text-success-400" : "text-purple-400"}`}>
                      {Math.round(node.level * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Neural Interventions */}
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 p-6 rounded-[24px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Icon
                icon="solar:magic-stick-3-bold-duotone"
                className="text-6xl text-purple-500"
              />
            </div>
            <p className="text-[10px] text-purple-400 uppercase font-bold mb-1">
              Neural Intervention
            </p>
            <p className="text-sm font-medium text-white/90">
              {vitals.focusLevel < 85 
                ? "Focus drop detected. Suggesting a 2-minute 'Space Retrieval' quiz to re-engage."
                : "You're in a Flow State. I've bypassed the basics of Superposition to accelerate your mastery."}
            </p>
            <button className="mt-4 px-4 py-2 bg-purple-500 rounded-xl text-xs font-bold hover:bg-purple-400 transition-colors">
              Accept Protocol
            </button>
          </div>

          <div className="flex flex-col gap-3">
             <button 
                onClick={signalConfusion}
                className="w-full p-4 bg-danger-500/10 border border-danger-500/20 rounded-2xl flex items-center justify-between hover:bg-danger-500/20 transition-all text-danger-400 font-bold text-sm"
             >
                <span>Signal Confusion</span>
                <Icon icon="solar:shield-warning-bold-duotone" className="text-xl" />
             </button>
             <button className="w-full p-4 bg-success-500/10 border border-success-500/20 rounded-2xl flex items-center justify-between hover:bg-success-500/20 transition-all text-success-400 font-bold text-sm">
                <span>Request Deep-Dive</span>
                <Icon icon="solar:star-fall-bold-duotone" className="text-xl" />
             </button>
          </div>
        </div>
      </main>

      {/* Adaptive Teacher Chat Widget */}
      <div
        className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${chatOpen ? "w-[400px]" : "w-16 h-16"}`}
      >
        {chatOpen ? (
          <div className="bg-[#021528] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[550px] animate-fade-in backdrop-blur-2xl">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                  <Icon
                    icon="solar:ghost-bold-duotone"
                    className="text-xl text-white"
                  />
                </div>
                <div>
                  <p className="font-bold text-white">Adaptive Teacher</p>
                  <p className="text-[10px] text-white/70">
                    Live Neural Sync: {vitals.focusLevel}%
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
                    className={`max-w-[85%] p-4 rounded-[20px] text-sm leading-relaxed ${msg.role === "user" ? "bg-purple-600 text-white rounded-tr-none" : "bg-white/5 text-gray-200 rounded-tl-none border border-white/5"}`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-[20px] rounded-tl-none border border-white/5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5">
              <div className="flex items-center gap-2 bg-white/5 rounded-2xl p-2 border border-white/10 focus-within:border-purple-500/50 transition-colors">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask your twin anything..."
                  className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-white placeholder:text-gray-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors shadow-lg"
                >
                  <Icon icon="solar:plain-bold" className="text-white" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center hover:scale-110 transition-all group"
          >
            <Icon
              icon="solar:ghost-bold-duotone"
              className="text-3xl text-white group-hover:rotate-12 transition-transform"
            />
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
