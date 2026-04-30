export default interface User {
  id: string;
  email: string;
  name?: string;
  enable: boolean;
  image?: string;
  updatedAt?: string;
  createdAt?: string;
  provider: string;
  roles?: { id: string; name: string }[];
}
