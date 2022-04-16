import selfImg from '../../data/intro/me.jpg';
import okra from '../../data/intro/okra.jpg';
import river from '../../data/intro/oregon-fun.jpg';
import expensivePaperImg from '../../data/intro/expensive-paper.jpg';
import computer2019 from '../../data/intro/2019-computer.jpg';
import liquidCooling from '../../data/intro/first-liquid-cooling-setup.JPG';
import butternut from '../../data/intro/butternut.jpg';
import cheesecake from '../../data/intro/cheesecake.jpg';
import discGolf from '../../data/intro/drew-disc-golf.jpg';
import redComputer from '../../data/intro/red-computer.jpg';
import frameworkComputer from '../../data/intro/framework.jpg';
import canyonOfAncients from '../../data/intro/solo-treking-canyon-of-the-ancients.jpg';
import bigHill from '../../data/intro/me-at-big-hill.jpg';
import pizza from '../../data/intro/pizza-2.jpg';
import okraFlower from '../../data/intro/okra-flower.jpg';
import communityGarden from '../../data/intro/volunteering-at-the-community-garden.jpg';
import sageFlower from '../../data/intro/sage-flowers.jpg';
import harvesting from '../../data/intro/harvesting.jpg';
import bbq from '../../data/intro/smoked-goodness.jpg';
import chanterelle from '../../data/intro/hunting-chanterelle.jpg';

export default {
  self: {
    pics: [
      {
        title: 'Me',
        description: 'On some hill',
        img: selfImg,
      },
      {
        title: '',
        description: 'By a river',
        img: river,
      },
      {
        title: '',
        description: 'Canyon of the Ancients',
        img: canyonOfAncients,
      },
      {
        title: '',
        description: 'On some bigger hill',
        img: bigHill,
      },
      {
        title: '',
        description: 'Growing okra',
        img: okra,
      },
      {
        title: '',
        description: 'Playing disc golf',
        img: discGolf,
      },
    ],
  },
  computers: [
    {
      title: '2022',
      description: 'TODO specs',
      img: frameworkComputer,
    },
    {
      title: '2019',
      description: 'TODO specs',
      img: computer2019,
    },
    {
      title: '2015',
      description: 'TODO specs',
      img: redComputer,
    },
    {
      title: 'Degree',
      description: 'BS Computer Science @ UTD',
      img: expensivePaperImg,
    },
    {
      title: '2009',
      description: 'TODO specs',
      img: liquidCooling,
    },
  ],
  creating: [
    {
      title: 'Baking',
      description: 'Cheesecake',
      img: cheesecake,
    },
    {
      title: '',
      description: 'BBQ',
      img: bbq,
    },
    {
      title: '',
      description: 'Butternut Squash',
      img: butternut,
    },
    {
      title: 'Mycology',
      description: 'Chanterelle Hunting',
      img: chanterelle,
    },
    {
      title: '',
      description: 'Okra Flowering',
      img: okraFlower,
    },
    {
      title: '',
      description: 'Pizza',
      img: pizza,
    },
    {
      title: '',
      description: 'Sage flowers',
      img: sageFlower,
    },
    {
      title: '',
      description: 'Harvesting',
      img: harvesting,
    },
    {
      title: '',
      description: 'Community gardening',
      img: communityGarden,
    },
  ],
};
