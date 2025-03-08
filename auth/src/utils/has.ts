import bcrypt from "bcrypt";
class Hash {
  static make(password: string, saltRounds: number = 10) {
    return bcrypt.hashSync(password, saltRounds);
  }
  static comapre(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}

export default Hash;
