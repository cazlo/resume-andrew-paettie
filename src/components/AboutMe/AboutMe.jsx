import React from 'react';
import { Container, ImageList, ImageListItem, ImageListItemBar, Paper, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid/Grid';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import ScreenBlock from '../ScreenBlock/ScreenBlock';
import introContent from './introContent';
import ContactInfo from './ContactInfo';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ImgItem = ({ item }) => {
  const theme = useTheme();
  return (
    <Tooltip title={item.description || ''}>
      <ImageListItem>
        <img
          src={`${item.img}?w=248&fit=crop&auto=format`}
          srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt={item.title || item.description}
          loading="lazy"
        />
        {useMediaQuery(theme.breakpoints.up('md')) && item.title && <ImageListItemBar subtitle={item.title} />}
      </ImageListItem>
    </Tooltip>
  );
};

ImgItem.propTypes = {
  item: PropTypes.shape({
    img: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

const Intro = () => {
  const theme = useTheme();
  const imageColumns = useMediaQuery(theme.breakpoints.up('sm')) ? 3 : 2;

  return (
    <ScreenBlock id="Resume-aboutMe" className="ResumeAboutMeBlock">
      <Container>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Item>
              <Typography variant="h2">About Me</Typography>
              <Typography variant="body1">
                The person behind the platforms: computers, wild places, gardens, and things made from scratch.
              </Typography>
              <ContactInfo />
            </Item>
          </Grid>
          <Grid item xs={12} md={8}>
            <Item>
              <Typography variant="subtitle1">I like exploring and having fun in the natural world.</Typography>
              <ImageList variant="masonry" cols={imageColumns} gap={8}>
                {introContent.self.pics.map(item => (
                  <ImgItem item={item} key={`${item.img}-${item.title}-${item.description}`} />
                ))}
              </ImageList>
            </Item>
          </Grid>
          <Grid item xs={12} md={8}>
            <Item>
              <Typography variant="subtitle1">
                I have been building and experimenting with computers and distributed systems for as long as I can
                remember. Eventually, I earned a bachelor&apos;s degree in computer science.
              </Typography>
              <ImageList variant="masonry" cols={imageColumns} gap={8}>
                {introContent.computers.map(item => (
                  <ImgItem item={item} key={`${item.img}-${item.title}-${item.description}`} />
                ))}
              </ImageList>
            </Item>
          </Grid>
          <Grid item xs={12} md={8}>
            <Item>
              <Typography variant="subtitle1">
                I like to create things and watch them grow over time. Growing high-quality, fresh food is one of my
                favorite ways to do that.
              </Typography>
              <ImageList variant="masonry" cols={imageColumns} gap={8}>
                {introContent.creating.map(item => (
                  <ImgItem item={item} key={`${item.img}-${item.title}-${item.description}`} />
                ))}
              </ImageList>
            </Item>
          </Grid>
        </Grid>
      </Container>
    </ScreenBlock>
  );
};

Intro.propTypes = {
  style: PropTypes.shape({}),
};

Intro.defaultProps = {
  style: {},
};

export default Intro;
