import React from 'react';
import { Container, IconButton, ImageList, ImageListItem, ImageListItemBar, Paper, Typography } from '@mui/material';
import { styled } from '@mui/styles';

import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid/Grid';
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

const ImgItem = ({ item }) => (
  <ImageListItem>
    <img
      src={`${item.img}?w=248&fit=crop&auto=format`}
      srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
      alt={item.title}
      loading="lazy"
    />
    <ImageListItemBar
      title={item.title}
      subtitle={item.description}
      actionIcon={<IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }} aria-label={`info about ${item.title}`} />}
    />
  </ImageListItem>
);

ImgItem.propTypes = {
  item: PropTypes.shape({
    img: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

const Intro = () => (
  <ScreenBlock id="Resume-aboutMe" className="ResumeAboutMeBlock">
    <Container>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Item>
            <Typography variant="h2">About Me</Typography>
            <Typography variant="p">A small introduction about myself </Typography>
            <ContactInfo />
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item>
            <Typography variant="subtitle1">I like exploring the natural world</Typography>
            <ImageList variant="masonry" cols={3} gap={8}>
              {introContent.self.pics.map(item => (
                <ImgItem item={item} key={`${item.img}-${item.title}-${item.description}`} />
              ))}
            </ImageList>
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item>
            <Typography variant="subtitle1">
              I have been messing around with computers as long as I can remember. Eventually I got a Bachelor Degree in
              Computer Science.
            </Typography>
            <ImageList variant="masonry" cols={3} gap={8}>
              {introContent.computers.map(item => (
                <ImgItem item={item} key={`${item.img}-${item.title}-${item.description}`} />
              ))}
            </ImageList>
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item>
            <Typography variant="subtitle1">I like to create things and watch them grow over time.</Typography>
            <ImageList variant="masonry" cols={3} gap={8}>
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

Intro.propTypes = {
  style: PropTypes.shape({}),
};

Intro.defaultProps = {
  style: {},
};

export default Intro;
