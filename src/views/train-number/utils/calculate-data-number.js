/*
 * @Author      : 吴晓斌
 * @Date        : 2020-09-11 15:49:43
 * @LastEditTime: 2020-09-17 16:27:36
 * @Description : 数据计算方法
 */
import moment from 'moment'

/**
 * @description: 向上运动
 * @param {Array} speedDataFatherArray 二维速度数据
 * @param {Array} distanceDataFatherArray 二维位移数据
 * @param {Number} trainWeight 最终负重
 * @return: {Object}
 */
export function calculateData(
  speedDataFatherArray,
  distanceDataFatherArray,
  trainWeight = 1
) {
  const speedDataFatherArrayOne = speedDataFatherArray.flat(1) // 速度，二维转换成一维

  /* 该次数据记录的时间[s] */
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')

  /* 单独计算每一次训练，求出相应的值 */
  const relativeDistanceArray = [] // 相对位移值数组[mm]
  const averagePowerArray = [] // 平均功率数组[W]
  const maxPowerArray = [] // 峰值功率数组[W]
  let percentMaxPower = 0 // 每一次的峰值功率[W]，用于百分比比较
  for (let i = 0, len = speedDataFatherArray.length; i < len; i++) {
    const speedDataArray = speedDataFatherArray[i]
    const distanceDataArray = distanceDataFatherArray[i]

    // 相对位移值数组[mm]
    const relativeDistance = parseFloat(
      Math.abs(
        Math.max.apply(null, distanceDataArray) -
          Math.min.apply(null, distanceDataArray)
      )
    )
    relativeDistanceArray.push(relativeDistance)

    // 平均功率数组[W]
    const averagePower = parseFloat(
      (
        (trainWeight * 10 * relativeDistance * 0.001) /
        (speedDataArray.length * 0.1)
      ).toFixed(1)
    )
    averagePowerArray.push(averagePower)

    // 峰值功率数组[W]
    const maxPower = parseFloat(
      (trainWeight * 10 * Math.max.apply(null, speedDataArray) * 0.01).toFixed(
        1
      )
    )
    maxPowerArray.push(maxPower)
    percentMaxPower = maxPower
  }

  /* 平均相对位移值[mm] */
  let averageRelativeDistance = 0
  if (relativeDistanceArray.length === 0) {
    averageRelativeDistance = 0
  } else {
    let sumRelativeDistance = 0
    relativeDistanceArray.forEach(v => {
      sumRelativeDistance += v
    })
    averageRelativeDistance = parseFloat(
      (sumRelativeDistance / relativeDistanceArray.length).toFixed(0)
    )
  }

  /* 平均功率[W] */
  let averagePowerFinal = 0
  if (averagePowerArray.length === 0) {
    averagePowerFinal = 0
  } else {
    let sumAveragePower = 0
    averagePowerArray.forEach(v => {
      sumAveragePower += v
    })
    averagePowerFinal = parseFloat(
      (sumAveragePower / averagePowerArray.length).toFixed(0)
    )
  }

  /* 峰值功率[W] */
  const powerDataArray = [] // 瞬时功率数组
  speedDataFatherArrayOne.forEach(v => {
    powerDataArray.push(parseFloat((trainWeight * 10 * v * 0.01).toFixed(1)))
  })
  const maxPowerFinal = parseFloat(
    (
      trainWeight *
      10 *
      Math.max.apply(null, speedDataFatherArrayOne) *
      0.01
    ).toFixed(1)
  )

  /* 平均速度[m/s] */
  let averageSpeedFinal = 0
  if (speedDataFatherArrayOne.length === 0) {
    averageSpeedFinal = 0
  } else {
    let sumSpeed = 0
    speedDataFatherArrayOne.forEach(v => {
      sumSpeed += v
    })
    averageSpeedFinal = parseFloat(
      ((sumSpeed / speedDataFatherArrayOne.length) * 0.01).toFixed(2)
    )
  }

  /* 峰值速度[m/s] */
  const maxSpeedFinal = parseFloat(
    (Math.max.apply(null, speedDataFatherArrayOne) * 0.01).toFixed(2)
  )

  /* 返回计算结果 */
  return {
    currentTime,
    averageRelativeDistance,
    maxPowerFinal,
    maxSpeedFinal,
    averagePowerFinal,
    averageSpeedFinal,
    powerDataArray,
    maxPowerArray,
    percentMaxPower
  }
}
