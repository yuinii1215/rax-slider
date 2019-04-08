/** @jsx createElement */

import {createElement, useRef, Fragment, useState} from 'rax';
import Pagination from './web/Pagination';
import Pages from './web/Pages';
import styles from './style';
import SwipeView from './web/SwipeView';

/**
 * 样式只能用对象
 * width、height 只能用数值
 * useState 懒加载
 * useEffect
 * 动画数值转换
 * transform 设置的宽度值
 * useRef 只能在 dom 节点上（替代 findDOMNode），组件上使用 forwardRef
 * useReducer
 * cloneElement
 * Fragment
 */

export default (props) => {
  const {
    style,
    children,
    showsPagination = true,
    index = 0,
    paginationStyle = null
  } = props;
  // 换算真实比例的值
  let width = style.width;
  const height = style.height;
  const total = children.length;

  let [currentIndex, setCurrentIndex] = useState(index);

  let childrenRefs = [];
  for (let i = 0; i < total; i++) {
    childrenRefs.push(useRef(null));
  }

  let onChange = (event) => {
    props.onChange && props.onChange(event);
    setCurrentIndex(event.index);
  };

  return (
    <Fragment>
      {<SwipeView
        {...props}
        styles={styles}
        total={total}
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