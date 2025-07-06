"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"

export default function CarouselProjeto({ imagens = [] }) {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop
      className="w-full h-[400px] rounded-xl overflow-hidden"
    >
      {imagens.map((src, index) => (
        <SwiperSlide key={index}>
          <img
            src={src}
            alt={`Imagem ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
