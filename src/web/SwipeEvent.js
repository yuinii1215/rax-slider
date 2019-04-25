/** @jsx createElement */

import {createElement, useState, useRef, forwardRef, useReducer} from 'rax';
import View from 'rax-view';
import PanResponder from 'universal-panresponder';
import isValidSwipe from './isValidSwipe';

const directions = {
  SWIPE_UP: 'SWIPE_UP',
  SWIPE_DOWN: 'SWIPE_DOWN',
  SWIPE_LEFT: 'SWIPE_LEFT',
  SWIPE_RIGHT: 'SWIPE_RIGHT'
};

export default (props, ref) => {
  const {
    horizontal = true,
    vertical = true,
    left = false,
    right = false,
    up = false,
    down = false,
    continuous = true,
    initialVelocityThreshold = 0.2,
    verticalThreshold = 1,
    horizontalThreshold = 5,
    setGestureState = true,
    handlerStyle = {},
    onSwipeBegin = () => {},
    onSwipe = () => {},
    onSwipeEnd = () => {}
  } = props;

  const [swipeState, setSwipeState] = useState({
    direction: null,
    distance: 0,
    velocity: 0
  });

  const instanceRef = useRef({
    // swipe is happen
    swipeDetected: false,
    // swipe speed
    velocityProp: null,
    // swipe distance
    distanceProp: null,
    // swipe direction
    swipeDirection: null
  });

  // const reducer = (state, action) => {

  // };
  // const [state, dispatch] = useReducer(reducer, {});

  const handleTerminationAndRelease = () => {
    if (instanceRef.current.swipeDetected) {
      onSwipeEnd({
        direction: instanceRef.current.swipeDirection,
        distance: swipeState.distance,
        velocity: swipeState.velocity
      });
    }
    instanceRef.current = {
      // swipe is happen
      swipeDetected: false,
      // swipe speed
      velocityProp: null,
      // swipe distance
      distanceProp: null,
      // swipe direction
      swipeDirection: null
    };
  };

  const [panResponder] = useState(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        return true;
      },
      onMoveShouldSetPanResponder: (evt) => {
        return true;
      },
      onPanResponderMove: (evt, gestureState) => {
        const {dx, dy, vx, vy} = gestureState;
        // const { onSwipeBegin, onSwipe, onSwipeEnd} = props;
        // when no swipe
        // console.log(`dx:${dx} dy:${dy} dx:${vx} dx:${vy}`)
        if (!continuous && instanceRef.current.swipeDetected) {
          return;
        }
        let initialDetection = false;
        let validHorizontal = false;
        let validVertical = false;

        if (!instanceRef.current.swipeDetected) {
          initialDetection = true;
          // horizontal
          validHorizontal = horizontal ? isValidSwipe(
            vx, dy, initialVelocityThreshold, verticalThreshold
          ) : '';

          // vertical
          validVertical = vertical ? isValidSwipe(
            vy, dx, initialVelocityThreshold, horizontalThreshold
          ) : '';

          if (validHorizontal) {
            evt.preventDefault && evt.preventDefault();
            instanceRef.current.velocityProp = 'vx';
            instanceRef.current.distanceProp = 'dx';
            // left
            if ((horizontal || left) && dx < 0) {
              instanceRef.current.swipeDirection = directions.SWIPE_LEFT;
            // right
            } else if ((horizontal || right) && dx > 0) {
              instanceRef.current.swipeDirection = directions.SWIPE_RIGHT;
            }
          } else if (validVertical) {
            instanceRef.current.velocityProp = 'vy';
            instanceRef.current.distanceProp = 'dy';
            // up
            if ((vertical || up) && dy < 0) {
              instanceRef.current.swipeDirection = directions.SWIPE_UP;
            // down
            } else if ((vertical || down) && dy > 0) {
              instanceRef.current.swipeDirection = directions.SWIPE_DOWN;
            }
          }

          if (instanceRef.current.swipeDirection) {
            instanceRef.current.swipeDetected = true;
          }
        }

        if (instanceRef.current.swipeDetected) {
          // gestureState.dx || gestureState.dy
          const distance = gestureState[instanceRef.current.distanceProp];
          // gestureState.vx || gestureState.vx
          const velocity = gestureState[instanceRef.current.velocityProp];

          const swipeState = {
            direction: instanceRef.current.swipeDirection,
            distance,
            velocity
          };

          if (initialDetection) {
            // console.log('onSwipeBegin');
            onSwipeBegin && onSwipeBegin(swipeState);
          } else {
            onSwipe && onSwipe(swipeState);
          }

          if (setGestureState) {
            setSwipeState({
              ...swipeState
            });
          }
        }
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderTerminate: handleTerminationAndRelease,
      onPanResponderRelease: handleTerminationAndRelease
    });
  });


  return (
    <View {...panResponder.panHandlers} style={{
      alignSelf: 'flex-start',
      ...handlerStyle,
      ...props.style
    }} {...(setGestureState ? swipeState : null)}>
      {props.children}
    </View>
  );
};
