'use client';

import { PropsWithChildren } from 'react';

import ReactSlider from 'react-slick';

import styles from './carousel.module.scss';
import { Card } from '@UI/card';
import { cn } from '@lib/utils';

const SliderSettings = {
  slidesToShow: 4,
  slidesToScroll: 4,
  speed: 500,
  dots: true,
  infinite: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 620,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
  customPaging: () => <div className={styles.dot} />,
};

interface Props {
  slidesToShow?: number;
  className?: string;
}

export const Carousel = ({ className, slidesToShow, children }: PropsWithChildren<Props>) => {
  if (slidesToShow) {
    SliderSettings.slidesToShow = slidesToShow;
  }

  return (
    <Card className={cn(styles.root, className, 'z-20 overflow-hidden')}>
      <ReactSlider {...SliderSettings}>{children}</ReactSlider>
    </Card>
  );
};
