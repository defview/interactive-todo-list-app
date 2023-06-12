import React, { useEffect, useMemo, useRef } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { gsap } from "gsap";

function List({ name, completed, id, grid, removeTodo, handleCompleted }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  //refs
  const todoRef = useRef();
  const nameRef = useRef();

  const check = (
    <CheckCircleIcon
      className={` ${
        completed ? "text-green-500 underline" : "text-[#301934]"
      }`}
    />
  );

  const randomColors = [
    "#F2D7D5",
    "#FADBD8",
    "#EBDEF0",
    "#E8DAEF",
    "#D4E6F1",
    "#D6EAF8",
    "#D1F2EB",
    "#D0ECE7",
    "#D4EFDF",
    "#D5F5E3",
    "#D6DBDF",
    "#D5D8DC",
    "#F6DDCC",
    "#FCF3CF",
  ];

  //randomize
  const randomizeColor = () => {
    const randomColor =
      randomColors[Math.floor(Math.random() * randomColors.length)];

    return randomColor;
  };

  // use memo
  const randomizeColorMemo = useMemo(() => {
    return randomizeColor();
  }, []);

  //animations
  const animateAndRemoveFromDom = () => {
    gsap.to(todoRef.current, {
      duration: 0.5,
      opacity: 0,
      y: -20,
      rotationX: 180,
      onComplete: () => {
        removeTodo(id);
      },
    });
  };

  //list item anim
  useEffect(() => {
    gsap.from(nameRef.current, {
      duration: 0.5,
      opacity: 0,
      y: 20,
      rotationX: 180,
      delay: -0.1,
      onComplete: () => {
        gsap.to(nameRef.current, {
          duration: 0.5,
          opacity: 1,
          y: 0,
          rotationX: 0,
        });
      },
    });
  }, [completed]);

  return (
    <div
      className="bg-[#F5F5F5] relative"
      colors={randomizeColorMemo}
      completed={completed}
      style={style}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
    >
      <li
        ref={todoRef}
        className={`bg-[#301934] py-[1rem] px-[2rem] rounded-[9px] list-none
        border-[1px] border-solid border-black shadow-md cursor-pointer text-black
        font-semibold font-chirp text-base active:scale-[0.98] ${
          grid ? "mb-3" : "mb-0"
        }`}
        style={{
          backgroundImage: `linear-gradient(to right, ${randomizeColor()}, ${randomizeColor()})`,
        }}
        onDoubleClick={animateAndRemoveFromDom}
      >
        <p
          ref={nameRef}
          className={`font-semibold text-[#301934] ${
            completed ? "text-green-500 line-through" : "text-[#301934]"
          }`}
        >
          {name}
        </p>
      </li>
      <div
        onDoubleClick={() => handleCompleted(id)}
        className={`absolute right-0 top-[50%] translate-y-[-50%] text-[#301934]
      py-[0.4rem] px-[0.9rem] font-semibold flex items-center justify-center border-none`}
      >
        {check}
      </div>
    </div>
  );
}

export default List;
