/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { testData as DummyData } from "~/util/testData";
import { Header } from "~/components/ui/header";
import { Button } from "~/components/ui/button";
import { Search, X } from "lucide-react";
import { useSocket } from "~/useSocket";

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
  const [isLoading, setIsLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState<string | undefined>(undefined);
  const state = location.state as { data?: any; query?: any };
  // location
  // State to track how many items to display
  const [displayCount, setDisplayCount] = useState(5);
  // Add state for mobile search overlay
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  // Get data based on current display count
  // const displayedItems = testData.results.slice(0, displayCount);
  const testData = state?.data || DummyData;
  const displayedItems = testData.results.slice(0, displayCount);
  const ss = useSocket();

  // Add state to track which items should be visible
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    Array(displayedItems.length).fill(false),
  );

  useEffect(() => {
    console.log("ss.message");
    console.log(ss.message);
    // check if message contains results
    if (ss.message && ss.message.includes("results")) {
      console.log("products found");
      const jsonObject = JSON.parse(ss.message);
      navigate("/ideas", { state: { data: jsonObject } });

      // Turn off loading
      setIsLoading(false);
      // navigate to results
    } else if (ss.message && ss.message.includes("progress")) {
      console.log("set progress");

      const jsonObject = JSON.parse(ss.message);

      setLoadMsg(jsonObject.message);
    }
  }, [ss.message]);

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
        : " ") +
      "with a budget of " +
      state.query.budget
    );
  };

  const handleSearch = (searchText: string) => {
    if (searchText.trim()) {
      const query = {
        budget: 500,
        about: searchText,
      };
      console.log("query", query);
      ss.sendMessage(
        JSON.stringify({
          query,
        }),
      );
      setIsLoading(true);
      setShowSearchOverlay(false); // Hide overlay after search
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* <Header /> */}
      <header className="fixed top-0 left-0 w-full bg-white z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo - left-aligned */}
            <div className="w-32">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            </div>

            {/* Desktop Search Box - Right aligned */}
            <div className="hidden sm:flex justify-end flex-1">
              <div className="relative w-[400px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-givving-primary" />
                </div>
                <input
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                  placeholder="Actually, I have an idea..."
                  className="pl-12 pr-5 py-4 w-full text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-givving-primary"
                />
              </div>
            </div>

            {/* Mobile search icon */}
            <div className="sm:hidden">
              <Search
                size={22}
                className="text-givving-primary cursor-pointer"
                onClick={() => setShowSearchOverlay(true)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {showSearchOverlay && (
        <div className="fixed inset-0 bg-white z-50 p-4 sm:hidden animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-givving text-givving-primary"> </h2>
            <X
              size={24}
              className="text-givving-primary cursor-pointer"
              onClick={() => setShowSearchOverlay(false)}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-givving-primary" />
            </div>
            <input
              type="text"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
              placeholder="Actually, I have an idea..."
              className="pl-12 pr-5 py-4 w-full text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-givving-primary"
            />
          </div>
        </div>
      )}

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
                Start Again
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
                <Button
                  variant="outline"
                  onClick={() => {
                    // Trigger a new recommendation search with the same criteria
                    console.log("");
                    console.log(state?.query);
                    if (state?.query) {
                      setIsLoading(true);
                      ss.sendMessage(
                        JSON.stringify({
                          query: state.query,
                        }),
                      );
                    }
                  }}
                  className="rounded-full border-blue-500 text-givving-primary font-bold hover:bg-blue-500 hover:text-white transition-colors px-6"
                >
                  FIND MORE GIFTS
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-givving-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-2xl font-givving text-givving-primary px-4">
              {loadMsg || "Finding gift ideas..."}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
