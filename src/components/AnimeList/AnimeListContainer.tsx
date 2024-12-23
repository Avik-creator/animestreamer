import { animeStore } from "../../store/animeStore"
import { useEffect, useMemo, useState } from "react"
import { useQuery } from "react-query"
import { AnimeItem } from "../Anime/AnimeItem"
import { getAnimeList } from "../../services/apiFetchAnimeList"
import { SkeletonLoading } from "../Skeleton/Loading"
import { useNavigate } from "react-router-dom"
import { ItemType } from "../../types/itemTypes"
import { toast } from "react-toastify"

type AnimeListContainerProps = {
  fetchCategory : string
  type : string
  title : string
  description : string
  spacing? : string
  hasSeeAll? : boolean
}

export const AnimeListContainer = ({ fetchCategory, type, title, description, spacing, hasSeeAll } : AnimeListContainerProps) => {
    // Theme Toggle
    const {isCheckedTheme} = animeStore()

    // Page Navigator
    const navigate = useNavigate()

    // Pagination Controller
    const [pageParams, setPageParams] = useState<{ firstParams: number, secondParams: number }>({
      firstParams: 1, 
      secondParams: 2
    })
    // Trigger Next Page
    const nextPage = () => {
      setIsLoading(true)
      setPageParams((prevParams) => ({
        ...prevParams,
        firstParams: prevParams.firstParams + 1,
        secondParams: prevParams.secondParams + 1,
      }))
    }
    // Trigger Prev Page
    const prevPage = () => {
      setIsLoading(true)
      setPageParams((prevParams) => ({
        ...prevParams,
        firstParams: prevParams.firstParams - 1,
        secondParams: prevParams.secondParams - 1,
      }))
    }

    // Getting Anime Data List -> First Data - 1st Page
    const { data: dataPage1, isFetched: isFetchedPage1, isError: isPage1Error } = useQuery(
      [
        type === "Trending" ? "animeDataTrending1" 
        : 
        type === "Latest" ? "animeDataRecent1" 
        : 
        type === "Popular" ? "animeDataPopular1" 
        : 
        type === "Search" ? "animeDataSearch1" 
        : 
        "noKey1", 
        pageParams, fetchCategory, type
      ],
      () => getAnimeList(fetchCategory, pageParams?.firstParams)
    )
    // Getting Anime Data List -> Second Data - 2nd Page
    const { data: dataPage2, isFetched: isFetchedPage2, isError: isPage2Error } = useQuery(
      [
        type === "Trending" ? "animeDataTrending2" 
        : 
        type === "Latest" ? "animeDataRecent2" 
        : 
        type === "Popular" ? "animeDataPopular2" 
        : 
        type === "Search" ? "animeDataSearch2" 
        : 
        "noKey2", 
        pageParams, fetchCategory, type
      ],
      () => getAnimeList(fetchCategory, pageParams?.secondParams)
    )

    // Combining the results when both requests have been resolved
    const combinedData = useMemo(() => {
      if (isFetchedPage1 && isFetchedPage2) {
        return {
          results: (dataPage1?.results || []).concat(dataPage2?.results || []),
        }
      }
      return null
    }, [isFetchedPage1, isFetchedPage2, dataPage1, dataPage2, pageParams])

    // Setting timeout for skeleton
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
      setIsLoading(true)
      if(isFetchedPage1 && isFetchedPage2 && !isPage1Error && !isPage2Error){
        const timer = setTimeout(() => {
          setIsLoading(false)
        }, 500)
        return () => clearTimeout(timer)
      }
      else if(isPage1Error || isPage2Error){
        toast.error("The request is invalid. Please try again!")
        navigate("/")
      }
    }, [isFetchedPage1, isFetchedPage2, pageParams, isPage1Error, isPage2Error])
           
  return (
    <section className={`min-h-[50rem] w-full custom-transition-duration pb-20 lg:pb-0 ${isCheckedTheme ? 'bg-black' : 'bg-white'}`}>
        <div className={`max-w-[80%] sm:max-w-none w-10/12 mx-auto relative ${spacing}`}>

            {/* Headers */}
            <h1 className={`text-4xl font-semibold text-center lg:text-left pt-10 lg:pt-0 
              custom-transition-duration ${isCheckedTheme ? 'text-gray-500  ' : 'text-black'}`}
            >
              {title}
            </h1>

            <div className="flex flex-col lg:flex-row justify-between items-center border-b-2 border-custom-gray-1 pb-5 gap-x-10 mt-4 lg:mt-0">
                <p className={`text-base  text-center lg:text-left custom-transition-duration ${isCheckedTheme ? 'text-gray-500  ' : 'text-black'}`}>
                  {description}
                </p>

                {
                  hasSeeAll ?
                  <button className={`mt-4 lg:mt-[-.50rem] whitespace-nowrap active:scale-95
                    border-2 px-5 py-2 rounded-full disable-highlight custom-transition-duration
                    ${
                      isCheckedTheme
                        ? 'hover:border-custom-gray-1 hover:text-custom-gray-1 text-white border-white'
                        : 'hover:border-custom-dark-1 hover:text-custom-dark-1 text-black border-black'
                    }`}
                    onClick={() => navigate(`/${type}`)}
                  >
                      See All &#62;
                  </button>
                  :
                  <div className="flex gap-x-3 mt-4 lg:mt-[-.50rem]">
                    {/* Prev Button */}
                    <button 
                      className={`text-gray-500  bg-custom-dark-2 px-5 py-2 rounded-md 
                        disable-highlight custom-transition-duration md:hover:bg-custom-gray-1 
                        active:scale-95 whitespace-nowrap ${pageParams?.firstParams === 1 && 'opacity-30 pointer-events-none'}`}
                      onClick={prevPage}
                    >
                      &#8592; Prev
                    </button>
                    {/* Next Button */}
                    <button 
                      className={`text-gray-500  bg-custom-dark-2 px-5 py-2 rounded-md 
                        disable-highlight custom-transition-duration md:hover:bg-custom-gray-1 
                        active:scale-95 whitespace-nowrap ${
                          (!dataPage1 || !dataPage1.hasNextPage) || (!dataPage2 || !dataPage2.hasNextPage) 
                            ? 'opacity-30 pointer-events-none' : ''
                        }`}
                      onClick={nextPage}
                    >
                      Next &#8594;
                    </button>
                  </div>
                }

            </div>

            {/* Anime Container */}
            <div className="mt-10 grid gap-x-7 gap-y-10 grid-cols-1 sm:grid-cols-2 870size:grid-cols-3 1220size:grid-cols-5 1920size:grid-cols-6">
                {/* Anime data mapping */
                  isLoading ? 
                    <SkeletonLoading size = {18}/>
                  :
                  combinedData?.results.length === 0 ?
                    <div className="w-full absolute">
                      <p className={`text-base ${isCheckedTheme ? 'text-gray-500  ' : 'text-black'}`}>No data found for "{fetchCategory}".</p>
                    </div>
                  :
                  combinedData?.results?.map((res: ItemType) => (
                    <AnimeItem
                      key = {res?.id}
                      id = {res?.id}
                      title = {res?.title}
                      image = {res?.image}
                      genres = {res?.genres}
                      episodeNumber = {res?.episodeNumber}
                      releaseDate = {res?.releaseDate}
                    />
                  ))
                }
            </div>
            
            {/* Button below if has see all is not true */
            !hasSeeAll && combinedData?.results.length !== 0 &&
              <div className="flex flex-wrap justify-center md:justify-end gap-3 mt-10">
                {/* Prev Button */}
                <button 
                  className={`text-gray-500  bg-custom-gray-1 px-5 py-2 rounded-md 
                        disable-highlight custom-transition-duration hover:bg-custom-dark-2 
                        active:scale-95 whitespace-nowrap ${pageParams?.firstParams === 1 && 'opacity-30 pointer-events-none'}`}
                  onClick={prevPage}
                >
                  &#8592; Prev
                </button>
                {/* Next Button */}
                <button 
                  className={`text-gray-500  bg-custom-gray-1 px-5 py-2 rounded-md 
                      disable-highlight custom-transition-duration hover:bg-custom-dark-2 
                      active:scale-95 whitespace-nowrap ${
                        (!dataPage1 || !dataPage1.hasNextPage) || (!dataPage2 || !dataPage2.hasNextPage) 
                          ? 'opacity-30 pointer-events-none' : ''
                      }`}
                  onClick={nextPage}
                >
                  Next &#8594;
                </button>
              </div>
            }
        </div>
    </section>
  )
}
