import { projects } from "@/data";
import { div } from "motion/react-client";
import React from "react";
import { PinContainer } from "./ui/3d-pin";
import { FaLocationArrow } from "react-icons/fa6";

function RecentProjects() {
  return (
    <div className="py-20" id="projects">
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>

      <div className="flex flex-wrap items-center justify-center p-4 gap-x-24 gap-y-8 mt-10">
        {projects.map((pj) => (
          <div
            key={pj.id}
            className="lg:min-h-130 h-100 flex items-center justify-center sm:w-142.5 w-[80vw]"
          >
            <PinContainer title={pj.link} href={pj.link}>
              <div className="flex items-center justify-center sm:w-142.5 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                <div className="relative w-full h-full overflow-hidden lg:rounded-3xl bg-[#13162d]">
                  <img src="/bg.png" alt="" />
                  <img
                    src={pj.img}
                    alt={pj.title}
                    className="z-10 absolute bottom-0"
                  />
                </div>
              </div>
              <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                {pj.title}
              </h1>
              <p className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2">
                {pj.des}
              </p>

              <div className="flex items-center justify-between mt-7 mb-3">
                <div className="flex items-center">
                  {pj.iconLists.map((ic, idx) => (
                    <div
                      key={ic}
                      className="border border-white/20 rounded-full bg-black lg-w-10 lg:h10 w-8 h-8 flex justify-center items-center"
                      style={{ transform: `translateX(-${5 * idx * 2}px)` }}
                    >
                      <img src={ic} alt="" className="p-2" />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center items-center">
                  <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                    Check Live Site
                  </p>
                  <FaLocationArrow className="ms-3" color="#cbacf9" />
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentProjects;
