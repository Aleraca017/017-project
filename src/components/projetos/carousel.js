"use client"

import { useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function CarouselProjeto({ imagens = [] }) {
  const swiperRef = useRef(null)

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start()
    }
  }, [])

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{
          clickable: true,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
          swiper.autoplay.start() // garante que inicia autoplay
        }}
        allowTouchMove={true}
        className="w-full h-[500px] rounded-xl overflow-hidden"
      >
        {imagens.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Imagem ${index + 1}`}
              className="w-full h-full object-cover rounded-xl -mt-10"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Arrows */}
      <div className="swiper-button-prev-custom absolute -left-4 top-1/2 transform h-16 flex items-center -translate-y-1/2 text-white bg-purple-700 hover:bg-purple-800 p-3 rounded shadow-md z-10 cursor-pointer">
        ‹
      </div>
      <div className="swiper-button-next-custom absolute -right-4 top-1/2 transform h-16 flex items-center -translate-y-1/2 text-white bg-purple-700 hover:bg-purple-800 p-3 rounded shadow-md z-10 cursor-pointer">
        ›
      </div>
    </div>
  )
}
