/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { testData as DummyData } from "~/util/testData";
import { ProductCard } from "~/components/ui/product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
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

// Define filter types for type safety
interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterSection {
  title: string;
  id: string;
  options: FilterOption[];
}

export default function Index() {
  // Add new state for sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [selectedProductFilters, setSelectedProductFilters] = useState<any[]>(
    [],
  );
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    price: true,
    brand: true,
    rating: true,
  });
  // Products data
  // const navigate = useNavigate();
  const location = useLocation();
  const [loadMsg, setLoadMsg] = useState<string | undefined>(undefined);

  const [searchQuery, setSearchQuery] = useState("");
  const [ideaResult, setIdeaResult] = useState<any>(undefined);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedGroup, setSelectedGroup] = useState<any>(undefined);
  const ss = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedProductFilters, setSelectedProductFilters] = useState<any[]>(
  //   [],
  // );

  useEffect(() => {
    const state = location.state as { data: any; index: number };
    if (!state || !state.data) {
      // Handle the case where state is not available
      console.error("No state data found");
      return;
    }
    console.log("logged");
    setSelectedIndex(state.index);
    setIdeaResult(state.data.results);
    setSelectedGroup(state.data.results[state.index]);
    // console.log(selectedGroup);
    // const ideaResult = state.data.results[state.index];
  }, []);

  useEffect(() => {
    console.log("ss.message");
    console.log(ss.message);
    console.log(isFilter);
    // check if message contains results
    if (ss.message && ss.message.includes("results") && !isFilter) {
      console.log("WebSocket message result received:");
      const jsonObject = JSON.parse(ss.message);
      // Turn off loading
      // navigate to results
      navigate("/ideas", { state: { data: jsonObject } });
      setIsLoading(false);
    } else if (ss.message && ss.message.includes("results") && isFilter) {
      console.log("filter set");
      const jsonObject = JSON.parse(ss.message);

      setSelectedGroup(jsonObject.results[0]);

      setIsFilter(false);
      setIsLoading(false);

      //set new filter and products->
      // render all the fitlers selected->>>
    } else if (ss.message && ss.message.includes("progress")) {
      console.log("set progress");

      const jsonObject = JSON.parse(ss.message);

      setLoadMsg(jsonObject.message);
    }
  }, [ss.message]);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Toggle filter sections
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Handle filter changes
  const handleFilterChange = (sectionId: string, optionId: string) => {
    console.log("handleFilterChange");
    setIsFilter(true);
    setIsLoading(true);
    setShowOverlay(false);
    const link =
      selectedGroup?.filters[sectionId].options[optionId].serpapi_link;
    console.log("link", link);
    const text = selectedGroup?.filters[sectionId].options[optionId].text;
    setSelectedProductFilters([...selectedProductFilters, text]);
    ss.sendMessage(
      JSON.stringify({
        more: link,
      }),
    );
    // sendJsonMessage({
    //   more: giftSuggestions?.filters[i].options[j].serpapi_link,
    // });

    // setSelectedFilters((prev) => {
    //   const currentFilters = prev[sectionId] || [];
    //   if (currentFilters.includes(optionId)) {
    //     return {
    //       ...prev,
    //       [sectionId]: currentFilters.filter((id) => id !== optionId),
    //     };
    //   } else {
    //     return {
    //       ...prev,
    //       [sectionId]: [...currentFilters, optionId],
    //     };
    //   }
    // });
  };

  const mapFilter = (filters: any) => {
    if (!filters) {
      return [];
    }
    // console.log(testData.results[0].filters[0].options[0])
    return filters
      .map((filter: any, index) => {
        // console.log("filter");
        // console.log(JSON.stringify(filter.options[0]));
        if (!filter.type) {
          return null;
        }
        return {
          title: filter.type,
          id: index,
          options: filter.options.map((option: any, index) => ({
            id: index,
            label: option.text,
          })),
        };
      })
      .filter((filter: any) => filter !== null);
  };

  const MainHeader = () => {
    const location = useLocation();

    return (
      <>
        {/* Main Header with blue background and back button */}
        <header className="w-full bg-[#F2F4FC] text-white z-20">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center md:h-[84px]">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                // navigate("/ideas");
                navigate("/ideas", { state: { data: location.state.data } });
              }}
            >
              <ChevronLeft size={18} className="text-givving-primary" />
              <h1 className="font-medium text-givving-primary">
                Go back to search and gift ideas list
              </h1>
            </div>
          </div>
        </header>
      </>
    );
  };
  const SecondaryHeader = (testData: any) => {
    if (!ideaResult) {
      return <></>;
    }
    // console.log(ideaResult);

    return (
      <>
        {/* Secondary Header with Filters and Search */}
        <div className="w-full flex border-b border-gray-200 z-10 bg-white">
          {isLoading && (
            <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-givving-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-2xl font-givving text-givving-primary">
                  {loadMsg || "Finding gift ideas..."}
                </h2>
              </div>
            </div>
          )}
          <div className="w-full md:h-[84px] px-4 py-2 flex items-center">
            <div className="w-[300px] items-center gap-4 hidden sm:block">
              {/* Filter Button - toggles sidebar on mobile */}
              <button
                className="items-center gap-2 px-4 py-2 bg-white rounded border border-givving-primary text-givving-primary text-base font-medium hover:bg-gray-50 hidden sm:flex mr-6"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Filter size={20} />
                <span className="hidden sm:inline">Filters</span>
                <span className="inline sm:hidden">
                  {sidebarOpen ? (
                    <ChevronLeft size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
              </button>
            </div>

            {/* Dropdown container - centered on mobile */}
            <div className="flex-1 flex justify-center sm:justify-start items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex font-givving text-givving-primary text-sm md:text-xl text-center sm:text-left">
                    <span className="text-gray-400 sm:inline">
                      Shop Idea {selectedIndex + 1}:&nbsp;
                    </span>
                    <span>{ideaResult[selectedIndex].group}</span>
                    <div className="pointer-events-none flex items-center px-2 text-gray-700">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="md:w-auto w-80">
                  <DropdownMenuGroup>
                    {ideaResult.map((result, index) => (
                      <DropdownMenuItem
                        key={index}
                        onSelect={(e) => {
                          // console.log("Selected item index:", index);
                          setSelectedIndex(index);
                          setSelectedGroup(ideaResult[index]);
                          // setSelectedGroup(ideaResult[index]);
                        }}
                      >
                        <div className="flex font-givving text-givving-primary text-sm md:text-xl">
                          <span className="text-gray-400 hidden sm:inline">
                            Shop Idea {index + 1}: &nbsp;
                          </span>
                          {result.group}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search Box - Right aligned */}
            <div className="hidden sm:block w-[400px]">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-givving-primary" />
                </div>
                <input
                  type="text"
                  // value={searchQuery}
                  // onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      // Prevent adding if already at max
                      console.log("enter clicked");
                      console.log(e.currentTarget.value);
                      const query = {
                        budget: 500,
                        about: e.currentTarget.value,
                      };
                      console.log("query", query);
                      ss.sendMessage(
                        JSON.stringify({
                          query,
                        }),
                      );
                      setIsLoading(true);
                      e.currentTarget.value = "";
                    }
                  }}
                  placeholder="Actually, I have an idea..."
                  className="pl-12 pr-5 py-4 w-full text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-givving-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Function to render filter section
  const renderFilterSection = (section: FilterSection) => {
    const isExpanded = expandedSections[section.id];

    return (
      <div key={section.id} className="border-b border-gray-200 py-4">
        <button
          className="flex items-center justify-between w-full text-left font-medium"
          onClick={() => toggleSection(section.id)}
        >
          {section.title}
          <span className="ml-2">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {isExpanded && (
          <div className="mt-2 space-y-1">
            {section.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4"
                  checked={(selectedFilters[section.id] || []).includes(
                    option.id,
                  )}
                  onChange={() => handleFilterChange(section.id, option.id)}
                />
                <span className="text-gray-500">{option.label}</span>
                {option.count !== undefined && (
                  <span className="ml-auto text-gray-500 text-sm">
                    {option.count}
                  </span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 overflow-hidden  flex flex-col">
      <MainHeader />
      <SecondaryHeader testData={ideaResult} />

      {/* Main content area - now below both headers */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filters - only shown on desktop */}
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } bg-white border-r border-gray-200 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out hidden md:block`}
        >
          <div className="p-4">
            {selectedProductFilters?.map((selectedFilter, i) => (
              <div key={i}>
                <span className="text-gray-500">{selectedFilter}</span>
              </div>
            ))}
            {selectedProductFilters.length > 0 && (
              <button
                className="mt-4 text-blue-500 hover:text-blue-700 text-sm"
                onClick={() => {
                  setSelectedFilters({});
                  setSelectedProductFilters([]);
                  setSelectedGroup(ideaResult[selectedIndex]);
                }}
              >
                Clear all filters
              </button>
            )}
            {mapFilter(selectedGroup?.filters).map(renderFilterSection)}
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden fixed bottom-4 left-4 z-10 flex gap-3">
          <button
            className="bg-white text-givving-primary border border-givving-primary px-5 py-3 rounded-full shadow-lg flex items-center gap-2 text-base"
            onClick={() => setShowOverlay(true)}
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>

          <button
            className="bg-white text-givving-primary border border-givving-primary px-5 py-3 rounded-full shadow-lg flex items-center gap-2 text-base"
            onClick={() => setShowSearchOverlay(true)}
          >
            <Search size={20} />
          </button>
        </div>

        {/* Mobile Filter Overlay - FIXED VERSION */}
        {showOverlay && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden flex"
            onClick={() => setShowOverlay(false)}
          >
            <div
              className="ml-auto h-full w-80 bg-white overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg">Filters</h2>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setShowOverlay(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {selectedProductFilters.length > 0 && (
                      <button
                        className=" text-blue-500 hover:text-blue-700 text-sm"
                        onClick={() => {
                          setSelectedFilters({});
                          setShowOverlay(false);
                          setSelectedProductFilters([]);
                          setSelectedGroup(ideaResult[selectedIndex]);
                        }}
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                  {selectedProductFilters?.map((selectedFilter, i) => (
                    <div key={i}>
                      <span className="text-gray-500">{selectedFilter}</span>
                    </div>
                  ))}
                </div>
                {/* {filterSections.map(renderFilterSection)} */}
                {mapFilter(selectedGroup?.filters).map(renderFilterSection)}

                {Object.keys(selectedFilters).length > 0 && (
                  <button
                    className="mt-4 text-blue-500 hover:text-blue-700 text-sm"
                    onClick={() => setSelectedFilters({})}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Search Overlay */}
        {showSearchOverlay && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden flex flex-col justify-center items-center p-4"
            onClick={() => setShowSearchOverlay(false)}
          >
            <div
              className="w-full max-w-md bg-white rounded-lg p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* <div className="flex justify-between items-center mb-4">
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setShowSearchOverlay(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div> */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-givving-primary" />
                </div>
                <input
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      console.log("Search entered:", e.currentTarget.value);
                      const query = {
                        budget: 500,
                        about: e.currentTarget.value,
                      };
                      ss.sendMessage(
                        JSON.stringify({
                          query,
                        }),
                      );
                      setIsLoading(true);
                      setShowSearchOverlay(false);
                      e.currentTarget.value = "";
                    }
                  }}
                  placeholder="Actually, I have an idea..."
                  className="pl-12 pr-5 py-4 w-full text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-givving-primary"
                />
              </div>
              {/* <button
                className="mt-4 w-full bg-givving-primary text-white py-3 rounded-full font-medium"
                onClick={(e) => {
                  const input =
                    e.currentTarget.previousSibling?.querySelector("input");
                  if (input && input.value.trim()) {
                    const query = {
                      budget: 500,
                      about: input.value,
                    };
                    ss.sendMessage(
                      JSON.stringify({
                        query,
                      }),
                    );
                    setIsLoading(true);
                    setShowSearchOverlay(false);
                    input.value = "";
                  }
                }}
              >
                Search
              </button> */}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedGroup?.results.map((product, index) => (
              // {products.map((product, index) => (
              <ProductCard
                key={index}
                image={
                  product.thumbnail ? product.thumbnail[0] : "/noimage.png"
                }
                name={product.title}
                rating={product.rating || 0}
                price={product.price}
                seller={product.seller}
                reviewCount={product?.reviews || 0}
                link={product.link}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
