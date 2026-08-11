import React from 'react';
import content from '../../common/content';
import techTheme from '../../common/techTheme';

/*
 * The technologies shown on the landing page, weighted by how much of them is
 * actually on the resume.
 *
 * The weight is read out of content.jsx rather than typed here, so the hero
 * grid cannot drift away from the skills table: extending an Experience
 * interval moves that technology up the hero automatically, and letting one
 * lapse moves it down. `GridBackground` turns these weights into how often each
 * tile appears on screen.
 */

// Every skill row and nested framework, flattened to name -> years of day-to-day
// experience. Names are matched case-insensitively because content.jsx is not
// consistent about capitalisation ('postgres', 'Redis', 'CircleCI').
const yearsByName = (() => {
  const years = new Map();
  const visit = rows =>
    rows.forEach(row => {
      if (row.name && row.experience) {
        years.set(row.name.toLowerCase(), row.experience.toNumber());
      }
      if (row.frameworks) visit(row.frameworks);
    });

  Object.values(content.skills.technical).forEach(visit);
  Object.values(content.skills.professional).forEach(visit);
  return years;
})();

// A floor on the weight, so something picked up recently still earns a tile
// instead of disappearing behind twenty years of shell scripting.
export const MIN_WEIGHT = 2;

// `skill` must name a row or framework in content.jsx; heroTech.test.js fails
// the build if one stops resolving. `heroIcon` is preferred where a technology
// has one, because the hero flattens all artwork to white (see Home.css).
const tech = (skill, theme) => {
  const years = yearsByName.get(skill.toLowerCase());
  return {
    key: skill,
    years,
    weight: Math.max(MIN_WEIGHT, years || 0),
    node: <div style={{ ...theme.style }}>{theme.heroIcon || theme.icon}</div>,
  };
};

export default [
  tech('AWS', techTheme.aws),
  tech('OS Admin', techTheme.linux),
  tech('Docker', techTheme.docker),
  tech('Python', techTheme.python),
  tech('Java', techTheme.java),
  tech('Node', techTheme.nodeJs),
  tech('React', techTheme.react),
  tech('Redux', techTheme.redux),
  tech('TypeScript', techTheme.typescript),
  tech('Terraform', techTheme.terraform),
  tech('Kubernetes', techTheme.kubernetes),
  tech('Helm', techTheme.helm),
  tech('postgres', techTheme.postgres),
  tech('Redis', techTheme.redis),
  tech('CircleCI', techTheme.circleci),
  tech('GitHub Actions', techTheme.githubActions),
  tech('Github Flow', techTheme.github),
  tech('Ansible', techTheme.ansible),
  tech('Podman', techTheme.podman),
  // Deliberately no 'Ubuntu' tile: it is a framework under 'OS Admin', so
  // giving both a tile would count the same twenty years of Linux twice and let
  // it take a fifth of the grid. Rocky is listed because the RHEL family is
  // separate day-to-day experience from the Ubuntu one.
  tech('RHEL/Centos/Rocky', techTheme.rockylinux),
  tech('Rust', techTheme.rust),
  tech('Go', techTheme.go),
  tech('FastAPI', techTheme.fastAPI),
  tech('Flux', techTheme.flux),
  tech('ArgoCD', techTheme.argocd),
  tech('Renovate', techTheme.renovate),
  tech('Harbor', techTheme.harbor),
  tech('Gitea', techTheme.gitea),
  tech('Grafana', techTheme.grafana),
  tech('Prometheus', techTheme.prometheus),
  tech('OpenTelemetry', techTheme.opentelemetry),
  tech('InfluxDB', techTheme.influxdb),
];
