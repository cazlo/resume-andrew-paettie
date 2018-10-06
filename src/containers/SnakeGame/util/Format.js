import moment from 'moment';

const formatDuration = durationMillis => {
  const momentDuration = moment.duration({ millisecond: durationMillis });
  return `${
    momentDuration.minutes() ? `${momentDuration.minutes()}m ` : ''
  }${momentDuration.seconds()}.${momentDuration.milliseconds()}s`;
};

const formatTime = aMoment => aMoment.format('MMM Do YY, h:mm:ss a');

export default {
  formatDuration,
  formatTime,
};
