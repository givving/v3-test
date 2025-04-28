/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
// import { WheelSelector } from "~/components/WheelSelector";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@remix-run/react";
import { WheelSelector } from "~/components/wheel";
import { Header } from "~/components/ui/header";
import { ArrowRight } from "lucide-react";
import Picker from "react-mobile-picker";
import { useSocket } from "~/useSocket";
import { send } from "vite";
// import useWebSocket from "react-use-websocket";

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

const selections = {
  gender: ["Male", "Female", "Diverse", "No gender"],
  age: [
    "0 - 10",
    "11 - 20",
    "21 - 30",
    "31 - 40",
    "41 - 50",
    "51 - 60",
    "61 - 70",
    "71 - 80",
  ],
  locations: ["Australia", "New Zealand"],
  likes: [
    "Horse riding",
    "Gaming",
    "AI",
    "Reading",
    "Hyrox",
    "Sci-Fi",
    "Health & Wellbeing",
    "Yoga",
    "Rugby League",
    "Climbing",
    "Design",
    "Cooking",
    "Swimming",
    "Fashion",
    "Poetry",
    "Cryptocurrency",
    "Investing",
    "Basketball",
    "Motorsport",
    "Nutrition",
    "Gaming",
    "AI",
    "Reading",
    "Hyrox",
    "Sci-Fi",
    "Health & Wellbeing",
  ],
  budgets: [
    "$0 - $100",
    "$101 - $200",
    "$201 - $300",
    "$301 - $400",
    "$401 - $500",
    "$501 - $600",
    "$601 - $700",
    "$701 - $800",
    "$801 - $900",
  ],
};

export default function Index() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showLocationOverlay, setShowLocationOverlay] = useState(false);
  const [showLikesOverlay, setShowLikesOverlay] = useState(false);
  const [showAgeOverlay, setShowAgeOverlay] = useState(false);
  const [showBudgetOverlay, setBudgetShowOverlay] = useState(false);

  const navigate = useNavigate();

  // Text to be animated
  const fullText = "Find a gift for a";
  const [displayText, setDisplayText] = useState<string | undefined>(undefined);
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [likes, setLikes] = useState<string[] | undefined>(undefined);
  const [cusLikes, setCusLikes] = useState<string[] | undefined>(undefined);
  const [budget, setBudget] = useState<string | undefined>(undefined);
  const [age, setAge] = useState<string | undefined>(undefined);
  const ss = useSocket();
  // const websocketAddressV2 = "wss://gbgb.rd37.com:1880/gbgb/test";

  //   const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
  //     websocketAddressV2,
  //     {
  //       share: false,
  //       shouldReconnect: () => true,
  //     }
  //   );

  //test states
  useEffect(() => {
    // setGender("Woman");
    // setLocation("Australia");
    // setLikes("horse riding, hyrox, yoga, investing and sci-fi");
    // setBudget("$500 - $600");
    // setAge("31 - 40");
    console.log("WebSocket connected:", ss.isConnected);
    if (ss.isConnected) {
      console.log("WebSocket connecssted!!");
      ss.sendMessage(JSON.stringify({ config: true }));
    }
    //   // Send a message to the server
    //   ss.sendMessage(JSON.stringify({
    //     config: true,
    //   }));
    // }
  }, [ss.isConnected]);

  useEffect(() => {
    console.log(ss.message);
    // check if message contains results
    if (ss.message && ss.message.includes("results")) {
      console.log("WebSocket message result received:");
      const jsonObject = JSON.parse(ss.message);
      // navigate("/ideas", )
      navigate("/ideas", { state: { data: jsonObject } });
    }
  }, [ss.message]);

  const [showButton, setShowButton] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // State for WheelSelector
  const [selectedOption, setSelectedOption] = useState("Option 1");

  // Typewriter effect
  useEffect(() => {
    let i = 0;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start typewriter effect after a small delay
    const startDelay = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (i <= fullText.length) {
          setDisplayText(fullText.slice(0, i));
          i++;
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            // Show button after text completes
            setShowButton(true);
          }
        }
      }, 50); // Speed of typing
    }, 500); // Initial delay

    return () => {
      clearTimeout(startDelay);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fullText]);

  const toggleOverlay = () => {
    setShowOverlay((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col items-center justify-start">
      <Header />
      {/* gender */}
      {showOverlay && (
        <div
          className="fixed inset-0 bg-[#F2F4FC] z-50 flex flex-col items-center justify-center 
            animate-in fade-in slide-in-from-bottom-4 duration-300 ease-in-out"
        >
          <h2 className="text-2xl font-givving text-givving-primary mb-6 text-center">
            Gender
          </h2>
          {selections.gender.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                // setAge("10 - 15");
                toggleOverlay();
                if (!age) {
                  setShowAgeOverlay(true);
                }
                setGender(item);
              }}
              className={`p-3  cursor-pointer }`}
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-3xl font-givving text-givving-primary font-semibold">
                    {item}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAgeOverlay && (
        <div
          className="fixed inset-0 bg-[#F2F4FC] z-50 flex flex-col items-center justify-center 
            animate-in fade-in slide-in-from-bottom-4 duration-300 ease-in-out"
        >
          <h2 className="text-2xl font-givving text-givving-primary mb-6 text-center">
            Age
          </h2>
          {selections.age.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setAge(item);
                setShowAgeOverlay(false);
              }}
              className={`p-3  cursor-pointer }`}
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-3xl font-givving text-givving-primary font-semibold">
                    {item}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showLocationOverlay && (
        <div
          className="fixed inset-0 bg-[#F2F4FC] z-50 flex flex-col items-center justify-center 
            animate-in fade-in slide-in-from-bottom-4 duration-300 ease-in-out"
        >
          <h2 className="text-2xl font-givving text-givving-primary mb-6 text-center">
            Location
          </h2>
          {selections.locations.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setLocation(item);
                setShowLocationOverlay(false);
                // setAge("10 - 15");
                // toggleOverlay();
              }}
              className={`p-3  cursor-pointer }`}
            >
              <div className="flex items-center gap-3">
                <div>
                  {/* <p className="font-medium font-givving text-givving-primary">Idea {index+1} </p> */}
                  <p className="text-3xl font-givving text-givving-primary font-semibold">
                    {" "}
                    {item}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {/* <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-xl mb-4 text-center text-gray-800">Select location Option</h2>
            
   
            <div className="flex justify-between">
             
              <Button onClick={() => {
                // Use the selected option

                setLocation("Australia");
                setShowLocationOverlay(false);
              }}>
                Confirm
              </Button>
            </div>
          </div> */}
        </div>
      )}
      {showLikesOverlay && (
        <div
          className="fixed inset-0 bg-[#F2F4FC] z-50 flex flex-col items-center justify-center 
          animate-in fade-in slide-in-from-bottom-4 duration-300 ease-in-out"
        >
          <div className="w-full max-w-2xl px-4 py-6">
            <h2 className="text-2xl font-givving text-givving-primary mb-6 text-center">
              Interests (max 5)
            </h2>
            <div className="mt-4 mb-2">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add custom interest(s)"
                  className="bg-white rounded-full py-2 px-4 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-givving-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      // Prevent adding if already at max
                      console.log("enter clicked");
                      console.log(e.currentTarget.value.trim());
                      if (
                        likes?.length === 5 &&
                        !likes.includes(e.currentTarget.value.trim())
                      ) {
                        return;
                      }
                      const newValue = e.currentTarget.value.trim();
                      setLikes((prev) => {
                        if (!prev) return [newValue];
                        if (prev.includes(newValue)) return prev;
                        return [...prev, newValue];
                      });
                      setCusLikes((prev) => {
                        if (!prev) return [newValue];
                        if (prev.includes(newValue)) return prev;
                        return [...prev, newValue];
                      });

                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </div>

            <div className="items-center justify-center flex flex-wrap">
              {selections.likes.map((item, index) => {
                // Remove duplicates from the array
                if (selections.likes.indexOf(item) !== index) return null;

                // Check if this item is already selected
                const isSelected = likes?.includes(item) || false;
                // Disable selection if already at 5 items (unless this item is already selected)
                const maxReached = likes?.length === 5 && !isSelected;
                return (
                  <Button
                    key={index}
                    onClick={() => {
                      if (maxReached) return; // Prevent selecting more than 5

                      setLikes((prev) => {
                        // If no previous likes, create new array with this item
                        if (!prev) return [item];

                        // If already selected, remove it
                        if (prev.includes(item)) {
                          return prev.filter((like) => like !== item);
                        }

                        // Otherwise add it
                        return [...prev, item];
                      });
                    }}
                    // className="rounded-full py-2 px-4 border cursor-pointer transition-colors text-center"
                    className={`rounded-full py-2 px-4 m-1 border cursor-pointer transition-colors text-center
                      ${
                        isSelected
                          ? "bg-givving-primary text-white border-givving-primary"
                          : "bg-white text-givving-primary border-givving-primary hover:bg-givving-primary/10"
                      }
                      ${maxReached ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {item}
                  </Button>
                );
              })}
              {cusLikes?.map((item, index) => {
                // Remove duplicates from the array
                if (cusLikes?.indexOf(item) !== index) return null;

                // Check if this item is already selected
                const isSelected = likes?.includes(item) || false;
                // Disable selection if already at 5 items (unless this item is already selected)
                const maxReached = likes?.length === 5 && !isSelected;
                return (
                  <Button
                    key={index}
                    onClick={() => {
                      if (maxReached) return; // Prevent selecting more than 5

                      setLikes((prev) => {
                        // If no previous likes, create new array with this item
                        if (!prev) return [item];

                        // If already selected, remove it
                        if (prev.includes(item)) {
                          return prev.filter((like) => like !== item);
                        }

                        // Otherwise add it
                        return [...prev, item];
                      });
                    }}
                    // className="rounded-full py-2 px-4 border cursor-pointer transition-colors text-center"
                    className={`rounded-full py-2 px-4 m-1 border cursor-pointer transition-colors text-center
                      ${
                        isSelected
                          ? "bg-givving-primary text-white border-givving-primary"
                          : "bg-white text-givving-primary border-givving-primary hover:bg-givving-primary/10"
                      }
                      ${maxReached ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {item}
                  </Button>
                );
              })}
            </div>

            <div className="flex justify-between mt-8">
              <div className="text-givving-primary">
                {likes?.length
                  ? `${likes.length}/5 selected`
                  : "No interests selected"}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="rounded-full px-6 py-2 border-givving-primary text-givving-primary hover:bg-givving-primary hover:text-white"
                  onClick={() => {
                    if (likes && likes.length > 0) {
                      setShowLikesOverlay(false);
                    }
                  }}
                  disabled={!likes || likes.length === 0}
                >
                  Finish
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showBudgetOverlay && (
        <div
          className="fixed inset-0 bg-[#F2F4FC] z-50 flex flex-col items-center justify-center 
            animate-in fade-in slide-in-from-bottom-4 duration-300 ease-in-out"
        >
          <h2 className="text-2xl font-givving text-givving-primary mb-6 text-center">
            Budget
          </h2>
          {selections.budgets.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setBudget(item);
                setBudgetShowOverlay(false);
              }}
              className={`p-3  cursor-pointer }`}
            >
              <div className="flex items-center gap-3">
                <div>
                  {/* <p className="font-medium font-givving text-givving-primary">Idea {index+1} </p> */}
                  <p className="text-3xl font-givving text-givving-primary font-semibold">
                    {" "}
                    {item}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center gap-8 md:gap-16 w-full max-w-4xl px-4 mt-24 md:mt-48">
        <h1 className="md:leading-relaxed text-3xl md:text-5xl font-givving text-givving-primary">
          <span className="typewriter-text pr-1 inline-flex items-center ">
            {displayText}
            {!age && !gender && (
              <>
                &nbsp;
                <Button
                  variant="outline"
                  className={`transition-opacity duration-500 ease-in ${showButton ? "opacity-100" : "opacity-0"} rounded-full border-givving-primary px-3 py-2 text-sm font-bold font-['Helvetica_Neue'] hover:bg-givving-primary hover:text-white`}
                  onClick={() => toggleOverlay()}
                >
                  CHOOSE
                  <ArrowRight className="ml-2 inline w-5 h-5" />
                </Button>
              </>
            )}
          </span>

          {age && gender && (
            <>
              <span
                className="typewriter-text pr-1 font-bold cursor-pointer"
                onClick={() => setShowAgeOverlay(true)}
              >
                &nbsp;{age}
                <br />
              </span>
              <span className="typewriter-text pr-1">year old</span>
              <span
                onClick={() => toggleOverlay()}
                className={`ml-2 transition-opacity cursor-pointer font-bold duration-500 ease-in ${showButton ? "opacity-100" : "opacity-0"}`}
              >
                {gender}
                <br />
              </span>

              <span className="typewriter-text pr-1 inline-flex items-center ">
                who lives in&nbsp;
                {!location && (
                  <>
                    &nbsp;
                    <Button
                      variant="outline"
                      className={` rounded-full border-givving-primary px-3 py-2 text-sm font-bold font-['Helvetica_Neue'] hover:bg-givving-primary hover:text-white`}
                      onClick={() => setShowLocationOverlay(true)}
                    >
                      CHOOSE
                      <ArrowRight className="ml-2 inline w-5 h-5" />
                    </Button>
                  </>
                )}
              </span>
              <span
                className="typewriter-text pr-1 font-bold cursor-pointer"
                onClick={() => setShowLocationOverlay(true)}
              >
                {location ? location : <></>} <br />
              </span>
            </>
          )}

          {location && (
            <>
              <span className="typewriter-text pr-1 inline-flex items-center">
                and likes&nbsp;
                {!likes && (
                  <Button
                    variant="outline"
                    className="rounded-full border-givving-primary px-3 py-2 text-sm font-bold font-['Helvetica_Neue'] hover:bg-givving-primary hover:text-white"
                    onClick={() => setShowLikesOverlay(true)}
                  >
                    CHOOSE
                    <ArrowRight className="ml-2 inline w-5 h-5" />
                  </Button>
                )}
              </span>
              <span
                className="typewriter-text pr-1 font-bold cursor-pointer"
                onClick={() => setShowLikesOverlay(true)}
              >
                {likes?.length ? likes.join(", ") : undefined}
                <br />
              </span>
            </>
          )}

          {likes && (
            <>
              <span className="typewriter-text pr-1  inline-flex items-center">
                with a budget of&nbsp;
                {!budget && (
                  <Button
                    variant="outline"
                    className="rounded-full border-givving-primary px-3 py-2 text-sm font-bold font-['Helvetica_Neue'] hover:bg-givving-primary hover:text-white"
                    onClick={() => setBudgetShowOverlay(true)}
                  >
                    CHOOSE
                    <ArrowRight className="ml-2 inline w-5 h-5" />
                  </Button>
                )}
              </span>
              <span
                className="typewriter-text pr-1 font-bold cursor-pointer"
                onClick={() => setBudgetShowOverlay(true)}
              >
                {budget ? budget : undefined}
                <br />
              </span>
              {/* <Button variant="outline" onClick={() => navigate("/ideas")}>Lets Get Givving</Button> */}

              {budget && (
                <Button
                  variant="outline"
                  className="rounded-full px-8 py-3 text-lg mt-6 hover:bg-givving-primary hover:text-white transition-colors"
                  onClick={() => {
                    ss.sendMessage(
                      JSON.stringify({
                        canned: "teen",
                      }),
                    );
                  }}
                >
                  Lets Get Givving
                </Button>
              )}
            </>
          )}
        </h1>
      </div>
    </div>
  );
}
