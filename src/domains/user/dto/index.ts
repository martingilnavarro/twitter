export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.createdAt = user.createdAt
    this.private = user.private
    this.image = user.image
    
    
  }

  id: string
  name: string | null
  createdAt: Date
  private: boolean
  image: string | null
  
}

export class ExtendedUserDTO extends UserDTO {
  constructor (user: ExtendedUserDTO) {
    super(user)
    this.email = user.email
    this.name = user.name
    this.password = user.password
   
  }

  email!: string
  username!: string
  password!: string
 
}
