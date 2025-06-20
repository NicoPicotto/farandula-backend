export interface RegisterBody {
   username: string;
   email: string;
   password: string;
   avatar: string;
   avatarColor: string;
}

export interface LoginBody {
   email: string;
   password: string;
}
