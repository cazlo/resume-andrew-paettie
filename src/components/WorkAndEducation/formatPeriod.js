/**
 * A timeline entry's date range. Positions and educations share the shape, and
 * the string is used as a React key as well as a label, so it gets exactly one
 * definition rather than one per component that needs it.
 */
const formatPeriod = ({ startDate, endDate }) => `${startDate} – ${endDate}`;

export default formatPeriod;
