import { useEffect, useState } from "react";
import { heroData } from "../../../helpers/heroData";
import { Button } from "../../../widgets/Button/button";
import playIcon from "../../../assets/icons/play.png"
import bookMark from "../../../assets/icons/bookmark.png"
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"
import { animeStore } from "../../../store/animeStore";
import { useNavigate } from "react-router-dom";
import { addBookMark } from "../../../helpers/data";

type HeroData = {
    id : string,
    title : string
    description : string
    image : string
    realImage? : string
    rating : number
    releaseDate : number
    type : string
    totalEpisodes: number
    genres: string[]
}

export const HeroSection = () => {
    // Theme Toggle
    const {isCheckedTheme} = animeStore()

    // Page Navigator
    const navigate = useNavigate()

    // Anime Data from my data folder
    const [dataArray, setDataArray] = useState<HeroData>()

    // Setting up data once the page is load
    useEffect(() => {
        const randomNumber = Math.random() * heroData.length
        setDataArray(heroData[Math.floor(randomNumber)])
    },[])

    // Description trimmer
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false)
    const [showSeeLess, setShowSeeLess] = useState<boolean>(false)
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription)
        setShowSeeLess(!showSeeLess)
    }

    const maxLength = 420;
    const shouldTrim = dataArray?.description?.length  && dataArray?.description?.length > maxLength && !showFullDescription
    const displayedText = shouldTrim ? `${dataArray?.description?.slice(0, maxLength)}.....` : dataArray?.description
    
    // Blur Effect in Lazy load
    const [imageLoaded, setImageLoaded] = useState<boolean>(false)

  return (
    <div 
        className="lg:pb-[26rem] custom-gradient-bg-dark flex" 
        style={{
            background: `radial-gradient(40.56% 36.62% at 63.93% 48.85%, 
              rgba(149, 149, 149, 0.00) 0%, rgba(0, 0, 0, 0.20) 100%), 
              linear-gradient(0deg, ${isCheckedTheme ? 'rgba(7, 13, 17, 0.95)' : 'rgba(255, 255, 255, 0.90)'} 0%, 
              ${isCheckedTheme ? 'rgba(7, 13, 17, 0.95)' : 'rgba(255, 255, 255, 0.90)'} 100%), 
              url(${dataArray?.image}) no-repeat lightgray 70% / cover`,
        }}
    >
        <div className="max-w-[80%] sm:max-w-none w-10/12 mx-auto mt-[5rem] lg:mt-[11rem] lg:flex gap-x-20">
            <LazyLoadImage
              onLoad={() => setImageLoaded(true)}
              wrapperClassName={imageLoaded ? '' : 'blur-up'}
              className="max-w-[85%] lg:min-w-[20rem] max-h-[26rem] sm:max-w-md mx-auto lg:mx-0 object-cover rounded-3xl"
              alt="Anime Image"
              src={dataArray?.image}
              
            />

            <div className="mt-0 lg:mt-4">
                <p className={`text-2xl sm:text-3xl md:text-4xl text-center 
                    lg:text-left mt-10 lg:mt-0 custom-font-rocksalt custom-transition-duration
                    ${isCheckedTheme ? 'text-gray-500 ' : 'text-black'}`
                    }
                >
                    {dataArray?.title}
                </p>
                <p className={`text-center lg:text-left text-base mt-5 max-w-[60rem] custom-transition-duration
                        ${isCheckedTheme ? 'text-gray-500 ' : 'text-black'}`
                    }
                >
                    {displayedText}
                </p>

                {/* Read More Button */
                displayedText && displayedText.length && displayedText.length >= 420 &&
                    <p onClick={toggleDescription } 
                        className={`mt-5 lg:mt-3 text-base text-center mx-auto lg:mx-0 lg:text-left 
                        w-[7.2rem] cursor-pointer custom-transition-duration hover:sm:text-custom-gray-1
                        hover:sm:underline active:scale-95 ${isCheckedTheme ? 'text-gray-500 ' : 'text-black'}`}
                    >
                        {shouldTrim && !showFullDescription && !showSeeLess ? 'Read more 👇' : 'See less ☝️'}
                    </p>
                }

                {/* Buttons */}
                <div className="clear-both mt-10 lg:mt-12 flex flex-col sm:flex-row sm:justify-center gap-5 lg:float-left">
                    <Button
                        value = "Watch"
                        bgColor = "bg-white"
                        shadeColor = "bg-[#0B3D85]"
                        icon = {playIcon}
                        onClick = {()=> navigate(`Anime/${dataArray?.id}`)}
                    />

                    <Button
                        value = "Add to list"
                        bgColor = "bg-white"
                        shadeColor = "bg-[#141D2B]"
                        icon = {bookMark}
                        onClick={() => addBookMark(dataArray?.id || "", dataArray?.title || "", dataArray?.realImage ? dataArray?.realImage : dataArray?.image || "",  dataArray?.totalEpisodes || 0)}
                    />
                </div>

                {/* Other Details */}
                <div className="clear-both mt-14 mb-28 lg:mb-0 lg:mt-[9rem] flex flex-wrap justify-center lg:justify-start gap-x-10 gap-y-2">
                    <p className={`text-base custom-transition-duration 
                            ${isCheckedTheme ? 'text-gray-500 ' : 'text-black'}`
                        }
                    >
                        Rating : <span className={`text-lg font-medium custom-transition-duration  ${isCheckedTheme ? 'text-gray-500 ' : 'text-black'}`}>{dataArray?.rating}</span>
                    </p>
                    <p className={`text-base custom-transition-duration 
                            ${isCheckedTheme ? 'text-gray-500 ' : 'text-black'}`
                        }
                    >
                        Year : <span className={`text-lg font-medium custom-transition-duration  ${isCheckedTheme ? 'text-gray-500 ' : 'text-black'}`}>{dataArray?.releaseDate}</span>
                    </p>
                    <p className={`text-base custom-transition-duration 
                            ${isCheckedTheme ? 'text-gray-500 ' : 'text-black'}`
                        }
                    >
                        Type : <span className={`text-lg font-medium custom-transition-duration  ${isCheckedTheme ? 'text-gray-500 ' : 'text-black'}`}>{dataArray?.type}</span>
                    </p>
                    <p className={`text-base custom-transition-duration 
                            ${isCheckedTheme ? 'text-gray-500 ' : 'text-black'} text-center lg:text-left`
                        }
                    >
                        Genres : &nbsp;
                        {dataArray?.genres && dataArray?.genres.map((genre, index) => (
                            <span key={index} className={`text-lg font-medium custom-transition-duration  ${isCheckedTheme ? 'text-gray-500 ' : 'text-black'}`}>
                                {genre}
                                {index !== dataArray?.genres.length - 1 && `, `}
                            </span>
                        ))}
                    </p>
                </div>
            </div>
        </div>
      
    </div>
  )
}