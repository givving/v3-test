/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
// import { WheelSelector } from "~/components/WheelSelector";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@remix-run/react";
import { Header } from "~/components/ui/header";
import { ArrowRight, X } from "lucide-react";
import { useSocket } from "~/useSocket";
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
    "$100",
    "$200",
    "$300",
    "$400",
    "$500",
    "$600",
    "$700",
    "$800",
    "$900",
  ],
};

export default function Index() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showLocationOverlay, setShowLocationOverlay] = useState(false);
  const [showLikesOverlay, setShowLikesOverlay] = useState(false);
  const [showAgeOverlay, setShowAgeOverlay] = useState(false);
  const [showBudgetOverlay, setBudgetShowOverlay] = useState(false);

  const navigate = useNavigate();

  const [ageOptions, setAgeOptions] = useState<string[] | undefined>(undefined);
  const [genderOptions, setGenderOptions] = useState<string[] | undefined>(
    undefined,
  );
  const [locationsOptions, setLocationsOptions] = useState<
    string[] | undefined
  >(undefined);
  const [budgetsOptions, setBudgetsOptions] = useState<string[] | undefined>(
    undefined,
  );
  const [likesOptions, setKLikesOptions] = useState<string[] | undefined>(
    undefined,
  );

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
  const [isLoading, setIsLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState<string | undefined>(undefined);

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
    console.log("ss.message");
    console.log(ss.message);
    // check if message contains results
    if (ss.message && ss.message.includes("results")) {
      console.log("products found");
      const jsonObject = JSON.parse(ss.message);
      // Turn off loading
      setIsLoading(false);
      // navigate to results
      navigate("/ideas", {
        state: {
          data: jsonObject,
          query: {
            gender: gender,
            age: age,
            likes: likes,
            location: location,
            budget: budget,
          },
        },
      });
    } else if (ss.message && ss.message.includes("progress")) {
      console.log("set progress");

      const jsonObject = JSON.parse(ss.message);

      setLoadMsg(jsonObject.message);
    } else if (ss.message && ss.message.includes("location")) {
      // TODO, need to change this to a better way of checking
      console.log("set options");
      const jsonObject = JSON.parse(ss.message);
      setAgeOptions(jsonObject.age);
      setLocationsOptions(jsonObject.location);
      setBudgetsOptions(jsonObject.budget);
      setGenderOptions(jsonObject.gender);
      // setLoadMsg(jsonObject.message);
      // } else if (ss.message && ss.message.includes("standard")) {
    } else {
      if (!ss.message) return;
      const jsonObject = JSON.parse(ss.message);
      // console.log("likes");
      // console.log("likes", jsonObject.standard);
      const keys = Object.keys(
        jsonObject.likes.length < 1 ? jsonObject.standard : jsonObject.likes,
      ); // Type: string[]
      // console.log("keys", keys);
      setKLikesOptions(keys);
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
          {/* Close button */}
          <button
            onClick={() => setShowOverlay(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-givving-primary" />
          </button>

          <h2 className="text-2xl font-givving text-givving-primary mb-6 text-center">
            Gender
          </h2>
          {genderOptions?.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                //
                if (!age) {
                  setShowAgeOverlay(true);
                } else {
                  // setShowAgeOverlay(false);
                  toggleOverlay();
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
          {/* Close button */}
          <button
            onClick={() => setShowAgeOverlay(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-givving-primary" />
          </button>

          <div className="w-full max-w-2xl px-4 py-6 flex flex-col max-h-[90vh]">
            <h2 className="text-2xl font-givving text-givving-primary mb-6 text-center">
              Age
            </h2>

            {/* Scrollable container */}
            <div className="overflow-y-auto max-h-[60vh] flex flex-col items-center">
              {ageOptions?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setAge(item);
                    setShowAgeOverlay(false);
                    if (!age) {
                      setShowOverlay(true);
                    }
                  }}
                  className="p-3 cursor-pointer w-full text-center"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div>
                      <p className="text-3xl font-givving text-givving-primary font-semibold">
                        {item}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showLocationOverlay && (
        <div
          className="fixed inset-0 bg-[#F2F4FC] z-50 flex flex-col items-center justify-center 
            animate-in fade-in slide-in-from-bottom-4 duration-300 ease-in-out"
        >
          {/* Close button */}
          <button
            onClick={() => setShowLocationOverlay(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-givving-primary" />
          </button>

          <h2 className="text-2xl font-givving text-givving-primary mb-6 text-center">
            Location
          </h2>
          {locationsOptions?.map((item, index) => (
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
          {/* Close button */}
          <button
            onClick={() => setShowLikesOverlay(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-givving-primary" />
          </button>

          <div className="w-full max-w-2xl px-4 py-6 flex flex-col max-h-[90vh]">
            <h2 className="text-2xl font-givving text-givving-primary mb-6 text-center">
              Interests (max 5)
            </h2>
            <div className="mt-4 mb-2">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add custom interest(s)"
                  className="bg-white rounded-l-full py-2 px-4 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-givving-primary"
                  id="custom-interest-input"
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
                <button
                  className="bg-givving-primary text-white px-4 rounded-r-full font-medium hover:bg-givving-primary/90 transition-colors"
                  onClick={() => {
                    const input = document.getElementById(
                      "custom-interest-input",
                    ) as HTMLInputElement;
                    if (input && input.value.trim()) {
                      if (
                        likes?.length === 5 &&
                        !likes.includes(input.value.trim())
                      ) {
                        return;
                      }
                      const newValue = input.value.trim();
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

                      input.value = "";
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Make this div scrollable */}
            <div className="items-center justify-center flex flex-wrap overflow-y-auto max-h-[50vh] p-2">
              {likesOptions?.map((item, index) => {
                // Remove duplicates from the array
                if (likesOptions?.indexOf(item) !== index) return null;

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
          {/* Close button */}
          <button
            onClick={() => setBudgetShowOverlay(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-givving-primary" />
          </button>

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

      <div
        className={`flex flex-col items-center md:items-start gap-8 md:gap-16 w-full max-w-4xl px-4 md:px-8 mt-24 ${age ? "md:mt-24" : "md:mt-48"}`}
      >
        <h1 className="md:leading-relaxed text-3xl md:text-5xl font-givving text-givving-primary text-center md:text-left w-full">
          <span className="typewriter-text pr-1 inline-flex items-center ">
            {displayText}
            {!age && !gender && (
              <>
                &nbsp;
                <Button
                  variant="outline"
                  className={`transition-opacity duration-500 ease-in ${showButton ? "opacity-100" : "opacity-0"} rounded-full border-givving-primary px-3 py-2 text-sm font-bold font-['Helvetica_Neue'] hover:bg-givving-primary hover:text-white`}
                  onClick={() => setShowAgeOverlay(true)}
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
                    onClick={() => {
                      const queryData = {
                        data: {
                          age,
                          gender,
                          location,
                        },
                      };
                      ss.sendMessage(JSON.stringify(queryData));
                      setShowLikesOverlay(true);
                    }}
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
                {likes?.length
                  ? likes.length === 1
                    ? likes[0]
                    : likes.slice(0, -1).join(", ") +
                      " and " +
                      likes[likes.length - 1]
                  : undefined}
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
                    onClick={() => {
                      setBudgetShowOverlay(true);
                    }}
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
              {budget && (
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start mt-6 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="rounded-full px-4 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-semibold font-['Helvetica_Neue'] hover:bg-givving-primary hover:text-white transition-colors border-givving-primary max-w-[80%] mx-auto sm:mx-0 sm:w-auto"
                    onClick={() => {
                      // Set loading state to true
                      setIsLoading(true);
                      // conscruct the message to be sent
                      // ss.sendMessage(
                      //   JSON.stringify({
                      //     canned: "teen",
                      //   }),
                      // );
                      const query = {
                        budget: parseInt(budget.replace(/[^0-9]/g, "")),
                        who: gender,
                        location: location,
                        age: age,
                        likes: likes,
                      };
                      console.log("query", query);
                      ss.sendMessage(
                        JSON.stringify({
                          query,
                        }),
                      );
                    }}
                  >
                    Create gift ideas
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-700 px-4 py-4 sm:py-5 text-base sm:text-lg font-medium transition-colors max-w-[80%] mx-auto sm:mx-0 sm:w-auto"
                    onClick={() => {
                      setGender(undefined);
                      setLocation(undefined);
                      setLikes(undefined);
                      setCusLikes(undefined);
                      setBudget(undefined);
                      setAge(undefined);
                      setDisplayText("Find a gift for a");
                    }}
                  >
                    Start again
                  </Button>
                </div>
              )}
            </>
          )}
        </h1>
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
