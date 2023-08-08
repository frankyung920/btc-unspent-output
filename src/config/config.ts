import * as dotenv from 'dotenv';

const path = `${__dirname}/../../.env`;
dotenv.config({ path });

export default {
  BLOCKCHAIN_INFO_API_PATH: `${process.env.BLOCKCHAIN_INFO_API_PATH}`,
};
