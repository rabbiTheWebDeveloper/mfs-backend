import bcrypt from "bcrypt";

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds: number = 10;
  const hashed: string = await bcrypt.hash(password, saltRounds);
  return hashed;
};

const comparePassword = async (
  password: string,
  userPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, userPassword);
};

export { hashPassword, comparePassword };
