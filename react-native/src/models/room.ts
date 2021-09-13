export class Room {

  public id: string
  
  public name: string
  
  public token: string
  
  public api_created: boolean
  
  public privacy: 'public' | 'private'
  
  public url: string
  
  public created_at: string
  
  public config: { [key:string]: any }

  public static fromJSON(obj: Object): Room {
    let item: Room = Object.assign(new Room(), obj)
    return item
  }

}
