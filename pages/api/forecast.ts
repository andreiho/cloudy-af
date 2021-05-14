import type { NextApiRequest, NextApiResponse } from 'next'

const apiKey = 'c92ae7acd93509d6635fe775184eadf6'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const promise = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${req.query.city}&units=metric&appid=${apiKey}`
  )
  const data = await promise.json()

  const list = Object.values(
    data.list.reduce((acc, item) => {
      const day = new Date(item.dt_txt).getDate()

      if (acc[day] && acc[day].main.temp > item.main.temp) {
        return acc
      }

      acc[day] = item
      return acc
    }, {})
  )

  res.status(200).json({
    ...data,
    list,
  })
}
