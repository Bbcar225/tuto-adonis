import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Category from 'App/Models/Category'
import User from 'App/Models/User'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public category_id: number

  @column()
  public user_id: number

  @column()
  public title: string

  @column()
  public content: string | null

  @column()
  public online: boolean

  @column()
  public thumbnail: string | null

  @belongsTo(() => Category, {
    foreignKey: 'category_id'
  })
  public category: BelongsTo<typeof Category>

  @belongsTo(() => User, {
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
