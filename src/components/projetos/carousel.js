"use client"

import { useEffect, useRef, useId } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function CarouselProjeto({ imagens = [] }) {
  const swiperRef = useRef(null)
  const id = useId() // gera um id único para essa instância

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start()
    }
  }, [])

  return (
    <div className="relative w-full max-w-full">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop
        navigation={{
          nextEl: `#next-${id}`,
          prevEl: `#prev-${id}`,
        }}
        pagination={{
          clickable: true,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
          swiper.autoplay.start()
        }}
        allowTouchMove={true}
        className="w-full aspect-video sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer active:cursor-grabbing"
      >
        {imagens.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Imagem ${index + 1}`}
              className="w-full sm:h-115 h-47 object-cover rounded-xl aspect-video"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Arrows com IDs únicos */}
      <div
        id={`prev-${id}`}
        className="absolute -left-2 sm:-left-4 top-1/2 transform -translate-y-1/2 h-10 sm:h-16 w-10 sm:w-auto flex items-center justify-center text-white bg-purple-700 hover:bg-purple-800 p-2 sm:p-3 rounded shadow-md z-10 cursor-pointer"
      >
        ‹
      </div>
      <div
        id={`next-${id}`}
        className="absolute -right-2 sm:-right-4 top-1/2 transform -translate-y-1/2 h-10 sm:h-16 w-10 sm:w-auto flex items-center justify-center text-white bg-purple-700 hover:bg-purple-800 p-2 sm:p-3 rounded shadow-md z-10 cursor-pointer"
      >
        ›
      </div>
    </div>
  )
}
