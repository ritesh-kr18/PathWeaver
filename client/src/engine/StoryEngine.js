import storyData from '../data/story.json';
import { generateScenario } from '../services/aiService';

class StoryEngine {
  constructor() {
    this.data = storyData;
  }

  /**
   * Load the next scenario — tries AI first, falls back to JSON
   */
  async loadNextScenario(context) {
    try {
      const { data } = await generateScenario(context);
      if (data.success && data.scenario) {
        return { ...data.scenario, source: 'ai' };
      }
    } catch (error) {
      console.warn('AI scenario unavailable, using fallback:', error.message);
    }

    // Fallback to story.json
    const stage = context.currentStage;
    const count = context.scenarioCount || 0;
    const nodeId = `${stage}_${count + 1}`;
    const node = this.loadNodeFromJSON(nodeId);

    if (node) {
      return { ...node, source: 'json' };
    }

    // If no more nodes for this stage, try the first one again
    return { ...this.getStartingNode(stage), source: 'json' };
  }

  /**
   * Load a specific node from story.json
   */
  loadNodeFromJSON(nodeId) {
    return this.data.nodes[nodeId] || null;
  }

  /**
   * Get the first node for a given stage
   */
  getStartingNode(stage) {
    return this.data.nodes[`${stage}_1`] || null;
  }

  /**
   * Get the next stage in sequence
   */
  getNextStage(current) {
    const stages = this.data.meta.stages;
    const index = stages.indexOf(current);
    return index < stages.length - 1 ? stages[index + 1] : null;
  }

  /**
   * Check if this is the last stage
   */
  isLastStage(stage) {
    const stages = this.data.meta.stages;
    return stages.indexOf(stage) === stages.length - 1;
  }

  /**
   * Get number of predefined scenarios for a stage
   */
  getScenariosPerStage() {
    return this.data.meta.scenariosPerStage || 3;
  }
}

export default new StoryEngine();