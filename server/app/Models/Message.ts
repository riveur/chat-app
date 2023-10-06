import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public content: string

  @column()
  public senderId: number

  @column()
  public receiverId: number

  @belongsTo(() => User, { localKey: 'senderId' })
  public sender: BelongsTo<typeof User>

  @belongsTo(() => User, { localKey: 'receiverId' })
  public receiver: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
