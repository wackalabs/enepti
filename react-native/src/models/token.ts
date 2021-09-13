export class Token {

  public exp: number

  public token: string

  public room_name: string

  public user_name: string

  public is_owner: boolean

  public enable_recording?: string

  public start_video_off?: boolean

  public static fromJSON(obj: Object): Token {
    let item: Token = Object.assign(new Token(), obj)
    return item
  }

}
