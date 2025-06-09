'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CarouselProps {
  images: { src: string; alt?: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  return (
    <div className="w-50% mx-50 mt-6 custom-swiper">
        <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        // navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        >
        {images.map((image, index) => (
            <SwiperSlide key={index}>
            <img
                src={image.src}
                alt={image.alt || `Slide ${index + 1}`}
                className="w-full h-90 object-cover rounded-lg"
            />
            </SwiperSlide>
        ))}
        </Swiper>
    </div>
  );
};

export default Carousel;
