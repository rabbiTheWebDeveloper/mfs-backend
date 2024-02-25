export interface IUser extends Document {
    name: string;
    role:string;
    email: string;
    mobile: string;
    password: string;
    photo: string
  }