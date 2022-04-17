// https://mui.com/material-ui/react-table/#collapsible-table
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Rating } from '@mui/material';
import Chip from '@mui/material/Chip';
import ChipList from '../common/ChipList';

const yearsTxt = year => `${year < 1 ? '<1' : year} year${year > 1 ? 's' : ''}`;

function SkillRating({ experience }) {
  return (
    <Typography variant="caption">
      <Rating name="read-only" value={experience} precision={0.5} readOnly />
      <br />
      {yearsTxt(experience)}
    </Typography>
  );
}

SkillRating.propTypes = {
  experience: PropTypes.number.isRequired,
};

function FrameworkChiplist({ frameworks }) {
  return <ChipList chips={frameworks} getIcon={f => f.icon} getLabel={f => f.name} getKey={f => `${f.name}`} />;
}

FrameworkChiplist.propTypes = {
  frameworks: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.element.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

function Row(props) {
  const { row, hasFrameworks, hasLastUsed, frameworkAlias } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => setOpen(!open)}>
        {hasFrameworks && (
          <TableCell>
            <IconButton aria-label="expand row" size="small">
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        <TableCell component="th" scope="row">
          <Chip label={row.name} avatar={row.icon} />
        </TableCell>
        {hasFrameworks && (
          <TableCell align="right">
            <FrameworkChiplist frameworks={row.frameworks.sort((a, d) => d.lastUsed - a.lastUsed)} />
          </TableCell>
        )}
        <TableCell align="right">
          <SkillRating experience={row.experience} />
        </TableCell>
        {hasLastUsed && <TableCell align="right">{row.lastUsed}</TableCell>}
      </TableRow>
      {hasFrameworks && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {frameworkAlias}
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Experience</TableCell>
                      <TableCell align="right">Description</TableCell>
                      <TableCell align="right">Last Used</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.frameworks?.map(f => (
                      <TableRow key={`${row.name}-${f.date}`}>
                        <TableCell component="th" scope="row">
                          <Chip label={f.name} avatar={f.icon} />
                        </TableCell>
                        <TableCell>
                          <SkillRating experience={f.experience} />
                        </TableCell>
                        <TableCell align="right">{f.description}</TableCell>
                        <TableCell align="right">{f.lastUsed}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

const RowPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  experience: PropTypes.number.isRequired,
  lastUsed: PropTypes.number,
  frameworks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      icon: PropTypes.element.isRequired,
      experience: PropTypes.number.isRequired,
      lastUsed: PropTypes.number,
    }),
  ),
});

Row.propTypes = {
  row: RowPropType.isRequired,
  hasLastUsed: PropTypes.bool.isRequired,
  hasFrameworks: PropTypes.bool.isRequired,
  frameworkAlias: PropTypes.string.isRequired,
};

export default function SkillTable({ rows, languageAlias, frameworkAlias }) {
  const hasFrameworks = rows.reduce((a, c) => (c.frameworks?.length || 0) + a, 0) > 0;
  const hasLastUsed = rows.reduce((a, c) => (c.lastUsed ? 1 : 0) + a, 0) > 0;
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {hasFrameworks && <TableCell />}
            <TableCell>{languageAlias}</TableCell>
            {hasFrameworks && <TableCell>{frameworkAlias}</TableCell>}
            <TableCell align="right">Day-to-Day Experience</TableCell>
            {hasLastUsed && <TableCell align="right">Last used</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <Row
              key={row.name}
              row={row}
              hasFrameworks={hasFrameworks}
              hasLastUsed={hasLastUsed}
              frameworkAlias={frameworkAlias}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

SkillTable.propTypes = {
  rows: PropTypes.arrayOf(RowPropType),
  languageAlias: PropTypes.string,
  frameworkAlias: PropTypes.string,
};

SkillTable.defaultProps = {
  rows: [],
  languageAlias: 'Language',
  frameworkAlias: 'Frameworks',
};
