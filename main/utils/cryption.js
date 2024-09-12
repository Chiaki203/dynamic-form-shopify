import Cryptr from "cryptr";

const cryption = new Cryptr(process.env.NEXT_PUBLIC_ENCRYPTION_STRING);
// const cryption = new Cryptr('secret_string');

export default cryption;
