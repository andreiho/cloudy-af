import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import 'tailwindcss/tailwind.css'
import { Forecast } from '../utils/types'
import { getDayName } from '../utils/utils'

interface Props {
  forecast: Forecast
}

export const Home: NextPage<Props> = (props): JSX.Element => {
  const router = useRouter()

  const today = props.forecast.list[0]
  const [search, setSearch] = useState(props.forecast.city.name)
  const [forecast, setForecast] = useState<Forecast>(props.forecast)
  const [selectedDay, setSelectedDay] = useState(today)
  const [error, setError] = useState('')

  const [, ...nextDays] = forecast.list

  useEffect(() => {
    router.push(`/?city=${props.forecast.city.name}`)
  }, [])

  useEffect(() => {
    setSelectedDay(props.forecast.list[0])
  }, [props.forecast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    getForecast()
  }

  const getForecast = async (city: string = search) => {
    try {
      const forecast: Forecast = await (
        await fetch(`/api/forecast?city=${city}`)
      ).json()

      setError('')
      setForecast(forecast)

      router.push(`/?city=${city}`)
    } catch (error) {
      setError('Oops, looks like that city does not exist. Try again!')
    }
  }

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const res =
        await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en
        `)
      const data: any = await res.json()

      const city = data.city || data.locality
      setSearch(city)
      getForecast(city)
    })
  }

  const getWeatherGradient = () => {
    const { id } = selectedDay.weather[0]

    if (id === 800) {
      // Clear
      return 'from-blue-300 via-blue-400 to-blue-500'
    } else if (id > 800) {
      // Clouds
      return 'from-gray-200 via-gray-300 to-gray-400'
    } else if (id >= 600 && id < 700) {
      return 'from-transparent to-blue-100'
    } else if (id >= 500 && id <= 504) {
      // Rain with sun
      return 'from-blue-200  to-gray-400'
    } else if ((id > 504 && id < 600) || (id >= 300 && id < 400)) {
      // Rain with clouds
      return 'from-gray-300 via-gray-400 to-gray-500'
    } else if (id >= 200 && id < 300) {
      // Thunderstorm
      return 'from-gray-400 via-gray-600 to-gray-800'
    }
  }

  const grad = getWeatherGradient()

  return (
    <div className={`flex items-center h-screen bg-gradient-to-r ${grad}`}>
      <div className="w-100 p-8 sm:w-3/4 sm:p-0 mx-auto">
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="bg-white flex items-center rounded-full shadow-xl">
            <input
              className="bg-transparent rounded-l-full w-full py-4 px-6 leading-tight focus:outline-none"
              type="text"
              placeholder="Enter a city..."
              name="city"
              value={search}
              onChange={handleChange}
            />

            <div className="flex items-center">
              <button
                className="bg-transparent"
                type="button"
                onClick={getLocation}
              >
                <svg viewBox="0 0 20 20" className="w-8 h-8">
                  <path
                    fill="#000"
                    d="M17.659,9.597h-1.224c-0.199-3.235-2.797-5.833-6.032-6.033V2.341c0-0.222-0.182-0.403-0.403-0.403S9.597,2.119,9.597,2.341v1.223c-3.235,0.2-5.833,2.798-6.033,6.033H2.341c-0.222,0-0.403,0.182-0.403,0.403s0.182,0.403,0.403,0.403h1.223c0.2,3.235,2.798,5.833,6.033,6.032v1.224c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403v-1.224c3.235-0.199,5.833-2.797,6.032-6.032h1.224c0.222,0,0.403-0.182,0.403-0.403S17.881,9.597,17.659,9.597 M14.435,10.403h1.193c-0.198,2.791-2.434,5.026-5.225,5.225v-1.193c0-0.222-0.182-0.403-0.403-0.403s-0.403,0.182-0.403,0.403v1.193c-2.792-0.198-5.027-2.434-5.224-5.225h1.193c0.222,0,0.403-0.182,0.403-0.403S5.787,9.597,5.565,9.597H4.373C4.57,6.805,6.805,4.57,9.597,4.373v1.193c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403V4.373c2.791,0.197,5.026,2.433,5.225,5.224h-1.193c-0.222,0-0.403,0.182-0.403,0.403S14.213,10.403,14.435,10.403"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="p-4">
              <button
                className={`bg-blue-400 hover:bg-blue-500 shadow-md text-white rounded-full p-2 focus:outline-none w-12 h-12 flex items-center justify-center`}
              >
                <svg viewBox="-2 -2 24 24">
                  <path
                    fill="#fff"
                    d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </form>

        <div className="flex flex-col justify-between p-4 md:p-8 shadow-xl bg-white rounded-lg">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {!forecast && 'Loading...'}

              {forecast && (
                <>
                  <div className="flex flex-col-reverse items-center md:flex-row md:items-start justify-between mb-10">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <div className="mr-3 hidden sm:block">
                          <img
                            src={`http://openweathermap.org/img/wn/${selectedDay.weather[0].icon}@2x.png`}
                            width="100"
                          />
                        </div>

                        <div className="flex flex-col">
                          <div className="w-28 text-6xl relative">
                            <span className="tabular-nums">
                              {Math.round(selectedDay.main.temp)}
                            </span>

                            <sup className="text-lg absolute top-0 ">
                              <sup>o</sup> C
                            </sup>
                          </div>

                          <div className="text-sm">
                            Feels like {Math.round(selectedDay.main.feels_like)}{' '}
                            <sup>o</sup>
                          </div>
                        </div>
                      </div>

                      <div className="ml-10">
                        <p className="tabular-nums text-gray-600">
                          Wind: {Math.round(selectedDay.wind.speed)} m/s
                        </p>
                        <p className="tabular-nums text-gray-600">
                          Humidity: {selectedDay.main.humidity}%
                        </p>
                        <p className="tabular-nums text-gray-600">
                          Visibility:{' '}
                          {Math.round(selectedDay.visibility / 1000)} km
                        </p>
                      </div>
                    </div>

                    <div className="text-center md:text-left mb-5 md:mb-0">
                      <p className="text-2xl font-semibold">
                        {forecast.city.name}
                      </p>
                      <p className="text-xl font-normal text-gray-500">
                        {getDayName(selectedDay.dt_txt, 'long')}
                      </p>
                      <p className="text-xl font-normal text-gray-500">
                        {selectedDay.weather[0].main}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between overflow-x-auto">
                    {nextDays.map((day, index) => (
                      <div
                        key={index}
                        className={`flex-col text-center p-3 mr-5 rounded-md hover:bg-gray-50 cursor-pointer ${
                          day.dt === selectedDay.dt ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => {
                          if (day.dt === selectedDay.dt) {
                            setSelectedDay(today)
                          } else {
                            setSelectedDay(day)
                          }
                        }}
                      >
                        <p>{getDayName(day.dt_txt, 'short')}</p>
                        <img
                          src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                        />
                        <p className="tabular-nums whitespace-nowrap">
                          {Math.round(day.main.temp)} <sup>o</sup>
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
  const city = (query['city'] as string) || 'Copenhagen'

  const forecast: Forecast = await (
    await fetch(`${baseUrl}/api/forecast?city=${city}`)
  ).json()

  return {
    props: { forecast },
  }
}

export default Home
