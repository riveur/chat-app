import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, computed, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @computed()
  public get avatar_url() {
    return `https://ui-avatars.com/api/?name=${this.username}&size=128`
  }

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
