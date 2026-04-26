/**
 * Stadium State - Manages the live pulse of the stadium and match.
 */

export const INITIAL_STADIUM_STATE = {
  match: {
    score: "DC 213/1 (16.2)",
    intensity: "Medium", // Low, Medium, High
    status: "Live - Batting Masterclass",
    keyMoments: [
      { id: 1, type: "Wicket", time: "14.2", desc: "Pant caught at long-on" },
      { id: 2, type: "Six", time: "15.5", desc: "McGurk smashes it over mid-wicket" },
    ]
  },
  facilities: {
    gates: [
      { id: 1, name: "Gate 1 (Sehwag)", waitTime: 4, load: 15 },
      { id: 2, name: "Gate 3 (Metro)", waitTime: 22, load: 92 },
    ],
    concessions: [
      { id: 1, name: "Old Delhi Chaat", waitTime: 15, deal: "20% off during break" },
      { id: 2, name: "Capital Grills", waitTime: 3, deal: "Fast-pass available" },
    ],
    network: {
      status: "Stable",
      signalStrength: 85,
      zones: [
        { name: "Stand A", signal: 90 },
        { name: "Stand B", signal: 40 }, // Congested
      ]
    },
    hygiene: [
      { id: 1, name: "Block A Restrooms", status: "Clean" },
      { id: 2, name: "Block C Restrooms", status: "Needs Attention" },
    ]
  },
  traffic: {
    status: "Flowing",
    egressTime: "12m",
    bestMode: "Metro"
  }
};

const stadiumStore = {
  state: JSON.parse(JSON.stringify(INITIAL_STADIUM_STATE)),

  updateMatch(score, intensity) {
    this.state.match.score = score;
    this.state.match.intensity = intensity;
  },

  getBreakRecommendation() {
    const { intensity } = this.state.match;
    const minWaitTime = Math.min(...this.state.facilities.concessions.map(c => c.waitTime));
    
    if (intensity === "Low" && minWaitTime < 10) {
      return { recommendation: "High", reason: "Match is quiet and queues are short!" };
    } else if (intensity === "High") {
      return { recommendation: "Low", reason: "Stay in your seat! High intensity play active." };
    }
    return { recommendation: "Moderate", reason: "Consider a quick run between overs." };
  }
};

export default stadiumStore;
