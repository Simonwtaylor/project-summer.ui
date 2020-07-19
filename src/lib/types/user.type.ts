export interface IUser {
  id: number;
  displayName: string;
  photoURL: string;
  email: string;
  uid: string;
}

export interface IAddUser {
  displayName: string;
  photoURL: string;
  email: string;
  uid: string;
}
