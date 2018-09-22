import techTheme from './techTheme';

export default {
  projects: [
    {
      title: 'AndrewPaettie.com',
      subtitle: 'My résumé',
      date: '2015 - 2018',
      techTheme: techTheme.reactColor,
      links: [
        {
          url: 'https://andrewpaettie.com',
          text: 'Site',
        },
        {
          url: 'https://github.com/cazlo/apaettie_backup',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'React',
          icon: techTheme.reactColor.icon,
        },
        {
          name: 'AWS',
          icon: techTheme.awsColor.icon,
        },
        {
          name: 'CircleCI',
        },
      ],
      content: 'A simple portfolio site to show some projects I have done',
      image: '/img/this-site.png',
    },
    // todo: JS map performance
    {
      title: 'CTF AI: Agent007',
      subtitle: 'University project',
      date: 'April 2015',
      techTheme: techTheme.javaColor,
      links: [
        {
          url: 'https://github.com/cazlo/ctf/tree/master/ctf',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'Java',
          icon: techTheme.javaColor.icon,
        },
      ],
      content: `An AI agent implemented in Java used to compete against other agents in a simple capture 
         the flag game written in Java. The Agent007 bot ended up placing 6th in a competition
         against 44 others.`,
      image: '/img/ctf.png', // todo gif
    },
    {
      title: 'Artificial Intelligence',
      subtitle: 'University Course',
      date: 'March 2015',
      techTheme: techTheme.pythonColor,
      links: [
        {
          url: 'https://github.com/cazlo/exploring-AI',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'Python',
          icon: techTheme.pythonColor.icon,
        },
        {
          name: 'AI',
        },
      ],
      content: `Some homework for an AI class I took, implementing search and constraint solving
          algorithms in python.`,
      image: '/img/ai-brain.jpg',
    },
    {
      title: 'Machine Learning',
      subtitle: 'University Course',
      date: 'October 2014',
      techTheme: techTheme.pythonColor,
      links: [
        {
          url: 'https://github.com/cazlo/exploring-machine-learning',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'Python',
          icon: techTheme.pythonColor.icon,
        },
        {
          name: 'ML',
        },
      ],
      content: `Some homework for a machine learning class I took, aimed towards implementing and using
          various prediction engines to classify data.`,
      image: '/img/ml-stats.png',
    },
    {
      title: 'Various School Projects',
      subtitle: 'University Courses',
      date: '2012 - 2014',
      techTheme: techTheme.othersColor,
      links: [
        {
          url: 'https://github.com/cazlo/academic-stuff',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'Java',
          icon: techTheme.javaColor.icon,
        },
        {
          name: 'C++',
        },
      ],
      content: `Just some random things I've made for school. Pictured is a loan amortization calculator featuring
       from scratch graphs and tables built using the swing UI framework for Java.`,
      image: '/img/loan-amortization.png',
    },
    /**
     * TODO
     *  <ProjectCard
     *   githubUrl='https://github.com/cazlo/WhizCalc'
     *   title='WhizCalc'
     *   subtitle='January 2014'
     *   text='A simple calculator app for android used to experiment with creating android apps.'
     *   imageUrl={placeholderImgUrl}
     *   />
     * */
    {
      title: 'MOOPS',
      subtitle: 'MIPS assembler project',
      date: 'December 2013',
      techTheme: techTheme.othersColor,
      links: [
        {
          url: 'https://github.com/cazlo/MOOPS-Moo-on-MIPS',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'MIPS',
        },
      ],
      content: `An implementation of the game moo in the MIPS assembly lanuage.  
      Also includes an algorithm for solving the puzzle within 16 moves.`,
      image: '/img/Mars-moo.png',
    },
    {
      title: 'Helicopter Side-scroller',
      subtitle: 'School project',
      date: 'May 2013',
      techTheme: techTheme.javaColor,
      links: [
        {
          url: 'https://github.com/cazlo/heli-madness',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'Java',
          icon: techTheme.javaColor.icon,
        },
      ],
      content: `A simple side scroller implemented with Java Swing. Game engine built from scratch.`,
      image: '/img/heli-game.png', // todo gif
    },
  ],
};
