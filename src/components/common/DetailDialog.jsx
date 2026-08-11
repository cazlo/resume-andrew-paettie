import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ChipList from './ChipList';

/**
 * The drill-down behind a timeline tile.
 *
 * Tiles carry a single line of summary so the timeline stays scannable; the
 * detail that would otherwise bloat them — accomplishments, links, imagery —
 * lives here and is only paid for when someone asks for it.
 *
 * Zoom is the transition because the dialog is meant to read as the tile itself
 * growing, rather than as a separate window appearing over the page.
 */
export default function DetailDialog({ open, onClose, detail }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!detail) return null;

  const { title, subtitle, period, icon, overview, highlights, chipGroups, links, image } = detail;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      scroll="paper"
      aria-labelledby="DetailDialog-title"
    >
      <DialogTitle id="DetailDialog-title" component="div" sx={{ pr: 7 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {icon && <Avatar sx={{ backgroundColor: '#fff' }}>{icon}</Avatar>}
          <Box>
            <Typography variant="h6">{title}</Typography>
            {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
            {period && (
              <Typography variant="subtitle2" color="text.secondary">
                {period}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {image && (
          <Box
            component="img"
            src={image.src}
            alt={image.alt}
            sx={{ display: 'block', width: '100%', maxHeight: '40vh', objectFit: 'contain', mb: 2 }}
          />
        )}

        {overview && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {overview}
          </Typography>
        )}

        {highlights && highlights.length > 0 && (
          <Box component="ul" sx={{ pl: 3, m: 0, mb: 2 }}>
            {highlights.map(highlight => (
              <Typography
                component="li"
                variant="body2"
                key={typeof highlight === 'string' ? highlight : highlight.key}
              >
                {highlight}
              </Typography>
            ))}
          </Box>
        )}

        {(chipGroups || [])
          .filter(group => group.chips && group.chips.length > 0)
          .map(group => (
            <Box key={group.label} sx={{ mb: 1 }}>
              <Typography variant="overline" color="text.secondary">
                {group.label}
              </Typography>
              <ChipList
                chips={group.chips}
                getIcon={chip => chip.icon}
                getLabel={chip => chip.name}
                getKey={chip => `${group.label}-${chip.name}`}
              />
            </Box>
          ))}

        {links && links.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {links.map(link => (
              <Button key={link.url} variant="outlined" href={link.url} target="_blank" rel="noopener noreferrer">
                {link.text}
              </Button>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export const DetailShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  period: PropTypes.string,
  icon: PropTypes.node,
  overview: PropTypes.node,
  highlights: PropTypes.arrayOf(PropTypes.node),
  chipGroups: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      chips: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, icon: PropTypes.element })),
    }),
  ),
  links: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string, text: PropTypes.string })),
  image: PropTypes.shape({ src: PropTypes.string, alt: PropTypes.string }),
});

DetailDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  detail: DetailShape,
};

DetailDialog.defaultProps = {
  detail: null,
};
