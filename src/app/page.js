"use client";
import List from "@/components/List";
import { myTodos } from "@/data/todo";
import { useEffect, useRef, useState } from "react";
import uuid from "react-uuid";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useThemeContext } from "@/context/themeContext";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import { gsap } from "gsap";

const grid = <GridViewIcon />;
const list = <ViewListIcon />;

export default function Home() {
  const [todos, setTodos] = useState(myTodos);
  const [value, setValue] = useState("");
  const [toggleGrid, setToggleGrid] = useState(false);

  //refs
  const todosRef = useRef();
  const todosCon = useRef();
  const formRef = useRef();

  //local storage
  const saveToLocalStorage = (todos) => {
    if (todos) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  };

  //delete from local storage
  const removeItemFromLocalStorage = (id) => {
    const filtered = todos.filter((todo) => {
      return todo.id !== id;
    });
    localStorage.setItem("todos", JSON.stringify(filtered));
  };

  //retrieve from local storage
  useEffect(() => {
    const localTodos = localStorage.getItem("todos");
    if (localTodos) {
      setTodos(JSON.parse(localTodos));
    }

    //grid from local storage
    const localGrid = localStorage.getItem("toggleGrid");
    if (localGrid) {
      setToggleGrid(JSON.parse(localGrid));
    }
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
    console.log(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!value || value.length < 3) {
      return alert("Todo must be at least 3 characters!");
    }

    const newTodos = [
      ...todos,
      {
        id: uuid(),
        name: value,
        completed: false,
      },
    ];

    setTodos(newTodos);
    //send to local storage
    saveToLocalStorage(newTodos);
    // clear input
    setValue("");
  };

  //remove
  const removeTodo = (id) => {
    removeItemFromLocalStorage(id);
    const filtered = todos.filter((todo) => {
      return todo.id !== id;
    });

    setTodos(filtered);
  };

  // handel Grid
  const gridHandler = () => {
    setToggleGrid(!toggleGrid);
    localStorage.setItem("toggleGrid", JSON.stringify(!toggleGrid));
  };

  //handle completion
  const handleCompleted = (id) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }

      return todo;
    });

    setTodos(newTodos);
    saveToLocalStorage(newTodos);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        //create new array with new order
        const newItems = [...items];
        //temove the item from old index
        newItems.splice(oldIndex, 1);
        //insert the item at a new index
        newItems.splice(newIndex, 0, items[oldIndex]);

        return newItems;
      });
    }
  };

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

  //animate
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power1.out", duration: 1 } });
    tl.fromTo(
      todosRef.current,
      { opacity: 0, x: 800 },
      { opacity: 1, x: 0, duration: 0.5 }
    )

      //todos Container animation
      .fromTo(
        todosCon.current,
        { opacity: 0, y: 800, scale: 0.5 },
        { opacity: 1, y: 0, duration: 0.5, scale: 1 },
        "-=0.5"
      )

      //form container animation
      .fromTo(
        formRef.current,
        { opacity: 0, y: -800, scaleX: 0 },
        { opacity: 1, y: 0, duration: 0.5, scaleX: 1 },
        "-=0.1"
      );
  }, []);

  return (
    <div
      className={`min-h-screen py-20 px-2 md:px-20 2xl:px-64 lg:px-36 overflow-hidden ${
        toggleGrid ? "grid" : ""
      }`}
    >
      <form
        ref={formRef}
        action=""
        className="flex flex-col items-center bg-[#F5F5F5] rounded-[1rem] h-fit
      mb-[2rem] py-[2rem] px-[1rem] shadow-md shadow-white border-[1px] border-solid"
        onSubmit={handleSubmit}
      >
        <h1 className="heading leading-5 tracking-wide text-2xl">
          Today&apos;s Tasks
        </h1>
        <div
          className="my-[1rem] mx-0 relative text-base 2xl:w-[50%] w-[80%] lg:-[85%] md:w-[79%] sm:w-[99%] flex
        items-center justify-center font-chirp"
        >
          <input
            className="bg-transparent border-transparent rounded-[7px] px-[1rem]
          py-[0.8rem] outline-[#301934] border-[#301934] 2xl:w-[50%] lg:-[85%] w-[80%] md:w-[79%] sm:w-[99%] shadow-xl
          placeholder-opacity-40 font-medium"
            value={value}
            onChange={handleChange}
            type="text"
            placeholder="Add a Task"
          />
          <div className="submit-btn">
            <button
              className="absolute top-0 lg:right-10 right-0 cursor-pointer border-none
            bg-[#301934] h-full py-0 px-[1rem] rounded-tr-[7px] rounded-br-[7px]
            text-white shadow-xl font-medium leading-5 tracking-wide transition-all
            duration-500 ease-in-out hover:bg-black"
            >
              + Add Todo
            </button>
          </div>
        </div>
      </form>

      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={todos.map((todo) => todo.id)}>
          <ul
            ref={todosCon}
            className="overflow-hidden bg-[#F5F5F5] 2xl:p-[5rem] xl:p-[2.3rem] lg:p-[2rem] p-[1rem] rounded-[1rem]
          shadow-md shadow-white border-[1px] border-solid h-fit"
          >
            <div className="flex justify-between items-center mb-[2rem]">
              <p className="font-chirp font-semibold text-[#301934] text-base">
                Priority
              </p>
              <div colors={randomizeColor} className="">
                <button
                  onClick={gridHandler}
                  className="py-[0.3rem] px-[0.4rem] rounded-[7px] bg-[#301934] shadow-md
                  border-[1px] border-black border-solid cursor-pointer text-base
                  transition-all duration-200 ease-in-out font-chirp font-semibold"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${randomizeColor()}, ${randomizeColor()})`,
                  }}
                >
                  {toggleGrid ? grid : list}
                </button>
              </div>
              <p className="font-chirp font-semibold text-red-500 text-base">
                High
              </p>
            </div>
            <div
              style={{
                display: toggleGrid ? "grid" : "flex",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gridColumnGap: "1rem",
                transition: "all .3s ease",
                gridRowGap: toggleGrid ? "0" : "1rem",
              }}
              className="flex flex-col"
              ref={todosRef}
            >
              {todos.map((todo) => {
                const { id, name, completed } = todo;
                return (
                  <List
                    removeTodo={removeTodo}
                    key={id}
                    id={id}
                    grid={toggleGrid}
                    name={name}
                    completed={completed}
                    handleCompleted={handleCompleted}
                  />
                );
              })}
            </div>
            <div className="mt-[2rem] flex justify-end">
              <p className="font-chirp font-semibold text-green-500 text-base">
                Low
              </p>
            </div>
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
