export const FEATURED_PROJECT_TITLES = [
  'Artifact Keeper',
  'Go and sigstore Upstream Contributions',
  'framework-fan',
  'Fractal Zoomer',
  'Rocket Avionics Observability',
  'Homelab GitOps Cluster',
  'Outside-In Testing Strategy',
  'React Snake',
];

// Select entries by their source index rather than altering their order or the
// project objects themselves. That keeps duplicate-titled entries available,
// while still giving the first matching expected project its featured spot.
export const partitionProjects = projects => {
  const featuredIndexes = new Set();
  const featuredProjects = FEATURED_PROJECT_TITLES.reduce((selected, title) => {
    const projectIndex = projects.findIndex((project, index) => project.title === title && !featuredIndexes.has(index));

    if (projectIndex !== -1) {
      featuredIndexes.add(projectIndex);
      selected.push(projects[projectIndex]);
    }

    return selected;
  }, []);

  return {
    featuredProjects,
    archiveProjects: projects.filter((project, index) => !featuredIndexes.has(index)),
  };
};
