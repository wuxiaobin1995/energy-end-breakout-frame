/*
 * @Author      : 吴晓斌
 * @Date        : 2020-09-12 15:27:18
 * @LastEditTime: 2020-09-18 13:42:58
 * @Description : Dexie
 */
import Dexie from 'dexie'

export function initDB() {
  const db = new Dexie('End_Breakout_Frame')
  db.version(1).stores({
    // 用户表
    user: 'userId,userGroup,birthday,sex',
    // 训练动作表
    action: 'actionId',
    // 训练数据记录表
    train_data:
      '++,userId,actionId,userGroup,currentTime,relativeDistance,trainWeight,mode,[userGroup+userId+currentTime]'
  })
  return db
}
