import LunarScene from './scenes/LunarScene';
import RadarScene from './scenes/RadarScene';
import RoadScene from './scenes/RoadScene';
import RunnersScene from './scenes/RunnersScene';
import ConstructionScene from './scenes/ConstructionScene';

/*
 * Scene id -> component.
 *
 * The ids are produced by sceneForPosition.js. An id with no entry here renders
 * nothing, which is a safe intermediate state while a scene is being built:
 * the timeline still says "lunar", the backdrop just stays default until the
 * scene exists.
 */
const sceneRegistry = {
  radar: RadarScene,
  lunar: LunarScene,
  runners: RunnersScene,
  road: RoadScene,
  construction: ConstructionScene,
};

export default sceneRegistry;
