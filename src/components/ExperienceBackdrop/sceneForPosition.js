/*
 * Which backdrop scene belongs to which job.
 *
 * Kept out of common/content.jsx on purpose: the scene is a presentation
 * concern, and matching on the company name here means the resume content can
 * be reworded without a second file having to change with it.
 *
 * Rules are matched in order, so put the more specific pattern first if two
 * could ever overlap. A company with no rule gets no scene, which leaves the
 * plain vaporwave backdrop up — that is the intended treatment for education.
 */
const RULES = [
  { match: /defense|department of defense/i, scene: 'radar' },
  { match: /blue origin/i, scene: 'lunar' },
  { match: /nike/i, scene: 'runners' },
  { match: /cox automotive/i, scene: 'road' },
  { match: /capitalsoft/i, scene: 'construction' },
];

const sceneForPosition = position => {
  const company = position && position.company;
  if (!company) return null;
  const rule = RULES.find(r => r.match.test(company));
  return rule ? rule.scene : null;
};

export default sceneForPosition;
