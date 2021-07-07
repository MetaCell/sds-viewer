import { createStyles, LinearProgress, withStyles } from '@material-ui/core';
import vars from '../../../styles/constant';

const ErrorLinearProgress = withStyles(() =>
  createStyles({
    colorPrimary: {
      backgroundColor: vars.progressErrorColor,
    },
    barColorPrimary: {
      backgroundColor: vars.errorColor
    },
  }),
)(LinearProgress);

const ProgressBar = (props) => props.error ? (
  <ErrorLinearProgress variant='determinate' {...props} />
) : (
  <LinearProgress variant='determinate' {...props} />
);

export default ProgressBar;


