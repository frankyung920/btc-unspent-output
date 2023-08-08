import axios, { AxiosResponse } from 'axios';
import config from '../config/config';

export interface UnspentOutput {
    tx_hash_big_endian: string,
    tx_hash: string,
    tx_output_n: number,
    script: string,
    value: number,
    value_hex: string,
    confirmations: number,
    tx_index: number
}

export interface RetrieveUnspentOutputResponse {
    notice: string,
    unspent_outputs: UnspentOutput[],
}

export interface RetrieveUnspentOutputError {
    error: string,
    message: string,
}

export const retrieveUnspentOutputs = async (address: string) => {
  try {
    const apiPath = config.BLOCKCHAIN_INFO_API_PATH + address;
    const response: AxiosResponse<RetrieveUnspentOutputResponse> = await axios.get(apiPath);
    return response.data;
  } catch (error) {
    return error;
  }
};
