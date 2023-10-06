import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Message, { foreignKey: 'senderId' })
  public sentMessages: HasMany<typeof Message>

  @hasMany(() => Message, { foreignKey: 'receiverId' })
  public receivedMessages: HasMany<typeof Message>
}
