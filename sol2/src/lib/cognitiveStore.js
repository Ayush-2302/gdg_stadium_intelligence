/**
 * Cognitive Store - Manages the user's live cognitive model.
 */

export const INITIAL_CONCEPT_GRAPH = {
  nodes: [
    { id: "quantum_physics", name: "Quantum Physics", level: 0.1, x: 400, y: 225, size: 50 },
    { id: "wave_particle", name: "Wave-Particle Duality", level: 0.0, x: 250, y: 150, size: 40 },
    { id: "superposition", name: "Superposition", level: 0.0, x: 550, y: 150, size: 40 },
    { id: "entanglement", name: "Entanglement", level: 0.0, x: 250, y: 300, size: 40 },
    { id: "uncertainty", name: "Uncertainty Principle", level: 0.0, x: 550, y: 300, size: 40 },
  ],
  edges: [
    { id: "e1", source: "quantum_physics", target: "wave_particle" },
    { id: "e2", source: "quantum_physics", target: "superposition" },
    { id: "e3", source: "quantum_physics", target: "entanglement" },
    { id: "e4", source: "quantum_physics", target: "uncertainty" },
  ],
};

export const INITIAL_COGNITIVE_VITALS = {
  memoryRetention: 85,
  learningVelocity: 1.2,
  focusLevel: 92,
  conceptualDepth: 15,
};

const cognitiveStore = {
  state: {
    graph: JSON.parse(JSON.stringify(INITIAL_CONCEPT_GRAPH)),
    vitals: JSON.parse(JSON.stringify(INITIAL_COGNITIVE_VITALS)),
  },

  updateConcept(conceptId, delta) {
    this.state.graph.nodes = this.state.graph.nodes.map(node => {
      if (node.id === conceptId) {
        return { ...node, level: Math.min(1, Math.max(0, node.level + delta)) };
      }
      return node;
    });
    this.calculateOverallDepth();
  },

  calculateOverallDepth() {
    const total = this.state.graph.nodes.length;
    const sum = this.state.graph.nodes.reduce((acc, node) => acc + node.level, 0);
    this.state.vitals.conceptualDepth = Math.round((sum / total) * 100);
  },

  getSummary() {
    return `User focus is ${this.state.vitals.focusLevel}%. Conceptual depth is ${this.state.vitals.conceptualDepth}%.`;
  }
};

export default cognitiveStore;
