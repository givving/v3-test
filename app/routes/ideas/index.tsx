/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { testData as DummyData } from "~/util/testData";
import { Header } from "~/components/ui/header";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Givving" },
    { name: "description", content: "Welcome to Givving!" },
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
    },
  ];
};

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { data?: any; query?: any };
  // location
  // State to track how many items to display
  const [displayCount, setDisplayCount] = useState(5);

  // Get data based on current display count
  // const displayedItems = testData.results.slice(0, displayCount);
  const testData = state?.data || DummyData;
  const displayedItems = testData.results.slice(0, displayCount);

  // Add state to track which items should be visible
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    Array(displayedItems.length).fill(false),
  );

  // Create sequential animation effect
  useEffect(() => {
    // Animate items sequentially with a delay
    displayedItems.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, 150 * index); // 150ms delay between each item
    });
  }, [displayedItems.length]);

  // Handle showing more ideas
  const showMoreIdeas = () => {
    // Set to the full array length
    setDisplayCount(testData.results.length);
  };
  const makeText = () => {
    if (!state?.query) {
      return "";
    }
    const likes = state.query.likes;
    return (
      " Gift ideas for a " +
      state.query.gender +
      " who's " +
      state.query.age +
      ", lives in " +
      state.query.location +
      " and likes " +
      (likes?.length
        ? likes.length === 1
          ? likes[0]
          : likes.slice(0, -1).join(", ") + " and " + likes[likes.length - 1]
        : "") +
      "with a budget of " +
      state.query.budget
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pt-16">
        <div className="flex flex-col items-center gap-16">
          <div className="w-full max-w-3xl px-4">
            <div className="flex flex-col items-center text-center">
              <div className="pt-12 pb-3 font-givving text-givving-primary max-w-lg">
                {makeText()}
              </div>
              <span
                className="mb-6 text-gray-400 underline cursor-pointer font-normal"
                onClick={() => navigate("/")}
              >
                Edit search
              </span>
            </div>

            {displayedItems.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  // navigate("/results")
                  navigate("/results", {
                    state: { data: testData, index: index },
                  });
                }}
                className={`p-3 border-b cursor-pointer border-blue-500 transition-all duration-500 ease-in-out transform ${
                  visibleItems[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.results[0].thumbnail[0]}
                    alt={`Idea ${index + 1}`}
                    className="w-24 h-24 object-cover border border-gray-100 rounded-sm"
                  />
                  <div>
                    <p className="font-medium font-givving text-givving-primary">
                      Idea {index + 1}{" "}
                    </p>
                    <p className="text-xl md:text-3xl font-givving text-givving-primary font-semibold">
                      {item.group}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-start mt-6 mb-12 w-full">
              {displayCount < testData.results.length ? (
                <Button
                  variant="outline"
                  onClick={showMoreIdeas}
                  className="rounded-full border-blue-500 text-givving-primary font-bold hover:bg-blue-500 hover:text-white transition-colors px-6"
                >
                  SHOW MORE IDEAS
                </Button>
              ) : (
                <p className="text-givving-primary text-sm font-bold">
                  All ideas shown
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
