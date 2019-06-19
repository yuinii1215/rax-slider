/** @jsx createElement */

import {createElement, useEffect, useRef, Fragment, useState, useReducer} from 'rax';
import Pagination from './web/Pagination';
import Pages from './web/Pages';
import styles from './style';
import SwipeView from './web/SwipeView';
import swipeReducer from './web/swipeReducer';

export default (props) => {
  const {
    style,
    children,
    showsPagination = true,
    index = 0,
    paginationStyle = null,
    autoplayInterval = 3000,
    autoPlay = false,
    loop = false,
  } = props;
  let width = style.width;
  const height = style.height;
  const total = children.length;

  let childrenRefs = [];
  for (let i = 0; i < total; i++) {
    childrenRefs.push(useRef(null));
  }

  let [currentIndex, setCurrentIndex] = useState(index);
  let onChange = (event) => {
    props.onChange && props.onChange(event);
    setCurrentIndex(event.index);
  };

  let swipeViewRef = useRef(null);
  const [state, dispatch] = useReducer(swipeReducer,
    {loop, total, style, swipeViewRef, childrenRefs, onChange, currentIndex: index, offsetX: 0});

  useEffect(() => {
    let autoPlayTimer = null;
    if (autoPlay && total > 1) {
      autoPlayTimer = setInterval(() => {
        dispatch({type: 'LOOP_PLAY', event: {
          direction: 'SWIPE_LEFT'
        }});
      }, parseFloat(autoplayInterval));
    };
    return () => {
      autoPlayTimer && clearInterval(autoPlayTimer);
    };
  }, [currentIndex]);

  return (
    <Fragment>
      {<SwipeView {...props}
        styles={styles}
        total={total}
        dispatch={dispatch}
        swipeViewRef={swipeViewRef}
        onChange={onChange}
        childrenRefs={childrenRefs}>
        <Pages
          childrenStyle={styles.childrenStyle}
          width={width}
          height={height}
          childrenRefs={childrenRefs}>
          {children}
        </Pages>
      </SwipeView>}
      {showsPagination ?
        <Pagination
          total={total}
          styles={styles}
          currentIndex={currentIndex}
          paginationStyle={paginationStyle} /> : null
      }
    </Fragment>
  );
};