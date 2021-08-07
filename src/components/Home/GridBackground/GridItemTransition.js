import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

// eslint-disable-next-line max-len
// todo this broke in most recent major version updates, seems this styled needs to be applied directly to GridItem now???
const StyledGridItemTransition = styled(CSSTransition).attrs({
  classNames: 'GridItemTransition',
  in: true,
  appear: true,
  timeout: 1000,
})`
  transition: opacity ${props => props.duration}ms ease-in ${props => props.delay}ms;

  &.GridItemTransition-appear {
    opacity: 0;
  }
  &.GridItemTransition-appear.GridItemTransition-appear-active {
    opacity: 1;
  }

  &.GridItemTransition-exit {
    opacity: 1;
  }
  &.GridItemTransition-exit.GridItemTransition-exit-active {
    opacity: 0;
  }
`;

export default StyledGridItemTransition;
