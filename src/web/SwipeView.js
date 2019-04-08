/** @jsx createElement */
import {createElement} from 'rax';
import View from 'rax-view';
import SwipeEvent from './SwipeEvent';

export default (props) => {
  const {
    styles,
    total,
    swipeViewRef,
    style,
    children,
    dispatch,
    initialVelocityThreshold = 0.7,
    verticalThreshold = 10,
    horizontalThreshold = 10,
    vertical = false,
  } = props;

  return total > 1 ?
    <SwipeEvent
      style={{
        ...styles.swipeWrapper,
        ...style,
      }}
      onSwipeBegin={(event) => {
        dispatch({type: 'SWIPE_BEGIN', event});
      }}
      onSwipeEnd={(event) => {
        dispatch({type: 'SWIPE_END', event});
      }}
      onSwipe={(event) => {
        dispatch({type: 'SWIPE', event});
      }}
      initialVelocityThreshold={initialVelocityThreshold}
      verticalThreshold={verticalThreshold}
      vertical={vertical}
      horizontalThreshold={horizontalThreshold}>
      <div ref={swipeViewRef} style={{
        ...styles.swipeStyle,
        ...style,
        ...{
          width: style.width * total
        }
      }}>
        {children}
      </div>
    </SwipeEvent>
    :
    <View ref={swipeViewRef} style={{
      ...styles.swipeStyle,
      ...style
    }}>
      {children}
    </View>
  ;
};