import React, { FC } from 'react';
import { IconComponentProps } from './types';

export const StarIcon: FC<IconComponentProps> = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    height='40'
    width='40'
    viewBox='0 0 24 24'
    x='0'
    y='0'
    opacity='100%'
    {...props}
  >
    <path d='M0 0h24v24H0z' fill='none'></path>
    <path d='M0 0h24v24H0z' fill='none'></path>
    <path d='M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'></path>
  </svg>
);
