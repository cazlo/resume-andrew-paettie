import React from 'react';

/**
 * Positions and educations have different shapes; DetailDialog does not want to
 * know about either. These map them onto the one view model it renders.
 *
 * A `detail` block on the content entry is optional. Without one the dialog
 * still opens with the tile's own summary and chips, so adding detail to a role
 * is incremental rather than all-or-nothing.
 */

const period = ({ startDate, endDate }) => `${startDate} – ${endDate}`;

export const positionDetail = position => {
  const detail = position.detail || {};

  return {
    title: position.title,
    subtitle: position.company,
    period: period(position),
    icon: position.icon,
    overview: detail.overview || position.summary,
    highlights: detail.highlights,
    chipGroups: [
      { label: 'Domains', chips: position.domains },
      { label: 'Technology', chips: position.tech },
    ],
    links: detail.links,
    image: detail.image,
  };
};

export const educationDetail = education => {
  const detail = education.detail || {};

  return {
    title: education.schoolName,
    subtitle: education.degree,
    period: period(education),
    icon: education.icon,
    overview: detail.overview,
    highlights: detail.highlights,
    chipGroups: [
      { label: 'Areas of study', chips: education.areasOfStudy },
      { label: 'Languages', chips: education.languages },
      {
        label: 'GPA',
        chips: (education.gpa || []).map(gpa => ({ name: `${gpa.name} GPA ${gpa.value}` })),
      },
    ],
    links: detail.links,
    image: detail.image,
  };
};

/* Rendered into a highlight list where a plain string is not enough. */
export const link = (href, text) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
);
